package com.sphere.user.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.sphere.user.dto.request.UpdateProfileRequest;
import com.sphere.user.dto.response.UserResponse;
import com.sphere.user.entity.Gender;
import com.sphere.user.entity.User;
import com.sphere.user.entity.UserFollow;
import com.sphere.user.exception.BadRequestException;
import com.sphere.user.exception.NotFoundException;
import com.sphere.user.mapper.UserMapper;
import com.sphere.user.repository.UserFollowRepository;
import com.sphere.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Ports server/src/controllers/user.controller.js.
 * Status-code deviations from source (per your instruction to fix obvious
 * bugs rather than preserve them, documented here): none identified in the
 * user domain itself — the two known status-code bugs from the reverse-
 * engineering pass (comment-related) live in post-service, not here.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserFollowRepository userFollowRepository;
    private final UserMapper userMapper;
    private final CloudinaryService cloudinaryService;
    private final NotificationPublisher notificationPublisher;

    // ---------------------------------------------------------------
    // GET /users?search=
    // ---------------------------------------------------------------

    public List<UserResponse> getAllUsers(Long currentUserId, String search) {
        List<User> users = userRepository.searchVerifiedUsers(search, List.of(-1L),
                PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "createdAt")));
        return users.stream().map(this::toSummaryAsUserResponse).toList();
    }

    // ---------------------------------------------------------------
    // GET /users/suggested
    // ---------------------------------------------------------------

    /**
     * Ports the two-stage recommender from user.controller.js#getSuggestedUsers:
     * (1) mutual-connection scoring, (2) fallback newest-users.
     *
     * PERFORMANCE NOTE (flag for docs/improvements/RECOMMENDED_IMPROVEMENTS.md):
     * this is implemented in application code over repository calls for a
     * first-cut correct port; the source used a single Mongo aggregation
     * pipeline. A follow-up should replace this with one indexed SQL query
     * (self-join on user_follows) rather than N+1 lookups.
     */
    @Transactional(readOnly = true)
    public List<UserResponse> getSuggestedUsers(Long currentUserId) {
        List<Long> followingIds = userFollowRepository.findByFollowerId(currentUserId).stream()
                .map(UserFollow::getFolloweeId).toList();

        Map<Long, Integer> mutualScore = new HashMap<>();
        for (Long followedId : followingIds) {
            for (UserFollow theirFollow : userFollowRepository.findByFollowerId(followedId)) {
                Long candidateId = theirFollow.getFolloweeId();
                if (candidateId.equals(currentUserId) || followingIds.contains(candidateId)) {
                    continue;
                }
                mutualScore.merge(candidateId, 1, Integer::sum);
            }
        }

        List<Long> mutualIds = mutualScore.entrySet().stream()
                .sorted((a, b) -> b.getValue() - a.getValue())
                .limit(20)
                .map(Map.Entry::getKey)
                .toList();

        List<User> mutualUsers = mutualIds.isEmpty() ? List.of()
                : userRepository.findAllById(mutualIds).stream()
                        .filter(User::isAccountVerified).toList();

        Set<Long> excludeForFallback = new LinkedHashSet<>(followingIds);
        excludeForFallback.add(currentUserId);
        excludeForFallback.addAll(mutualIds);

        List<User> fallbackUsers = userRepository.searchVerifiedUsers(null,
                excludeForFallback.isEmpty() ? List.of(-1L) : new ArrayList<>(excludeForFallback),
                PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt")));

        List<UserResponse> suggestions = new ArrayList<>();
        mutualUsers.forEach(u -> suggestions.add(toSummaryAsUserResponse(u)));
        fallbackUsers.forEach(u -> suggestions.add(toSummaryAsUserResponse(u)));

        return suggestions;
    }

    // ---------------------------------------------------------------
    // GET /users/birthdays
    // ---------------------------------------------------------------

    public List<UserResponse> getTodaysBirthdays() {
        LocalDate today = LocalDate.now();
        return userRepository.findTodaysBirthdays(today.getDayOfMonth(), today.getMonthValue()).stream()
                .map(this::toSummaryAsUserResponse)
                .toList();
    }

    // ---------------------------------------------------------------
    // Profile
    // ---------------------------------------------------------------

    @Transactional(readOnly = true)
    public UserResponse myProfile(Long currentUserId) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new NotFoundException("error while getting your profile"));
        return toFullUserResponse(user, currentUserId);
    }

    @Transactional(readOnly = true)
    public UserResponse getProfileByUsername(String username, Long currentUserId) {
        User user = userRepository.findByUsernameAndAccountVerifiedTrue(username)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return toFullUserResponse(user, currentUserId);
    }

    public record UpdateProfileResult(UserResponse user, boolean changed) {
    }

    @Transactional
    public UpdateProfileResult updateProfile(Long currentUserId, UpdateProfileRequest request,
            MultipartFile profilePicture) {
        User user = userRepository.findById(currentUserId).orElseThrow(() -> new NotFoundException("User not found"));

        LocalDate dob = (request.dob() == null || request.dob().isBlank()) ? null : LocalDate.parse(request.dob());
        if (dob != null && !isAtLeast13YearsOld(dob)) {
            throw new BadRequestException("You must be at least 13 years old.");
        }

        boolean hasNewPicture = profilePicture != null && !profilePicture.isEmpty();
        boolean unchanged = eq(user.getUsername(), request.name())
                && eq(user.getFullName(), request.fullName())
                && eq(user.getBio(), request.bio())
                && eq(user.getGender() == null ? null : user.getGender().name(), request.gender())
                && eq(user.getDob(), dob)
                && !hasNewPicture;

        if (unchanged) {
            return new UpdateProfileResult(toFullUserResponse(user, currentUserId), false);
        }

        if (hasNewPicture) {
            if (user.getProfilePicturePublicId() != null) {
                cloudinaryService.delete(user.getProfilePicturePublicId());
            }
            CloudinaryService.UploadResult uploaded = cloudinaryService.upload(profilePicture, "avatars");
            user.setProfilePictureUrl(uploaded.url());
            user.setProfilePicturePublicId(uploaded.publicId());
        }

        if (request.name() != null)
            user.setUsername(request.name().trim());
        if (request.fullName() != null)
            user.setFullName(request.fullName().trim());
        if (request.bio() != null)
            user.setBio(request.bio().trim());
        if (request.gender() != null && !request.gender().isBlank())
            user.setGender(Gender.valueOf(request.gender()));
        if (dob != null)
            user.setDob(dob);

        userRepository.save(user);
        return new UpdateProfileResult(toFullUserResponse(user, currentUserId), true);
    }

    @Transactional
    public void deleteProfilePicture(Long currentUserId) {
        User user = userRepository.findById(currentUserId).orElseThrow(() -> new NotFoundException("User not found"));
        if (user.getProfilePicturePublicId() == null) {
            throw new BadRequestException("No profile picture to delete");
        }
        cloudinaryService.delete(user.getProfilePicturePublicId());
        user.setProfilePictureUrl(null);
        user.setProfilePicturePublicId(null);
        userRepository.save(user);
    }

    /**
     * Ports deleteAccount — DELIBERATELY preserves the source's non-cascading
     * behavior for now (Decision #5 in DECISIONS_REQUIRED.md is still open).
     * Unlike the source's Mongo delete-result quirk (returning the raw
     * `{acknowledged, deletedCount}` object as "user"), this returns nothing
     * unusual — a documented, low-risk cleanup since no frontend consumer
     * exists for this endpoint (docs/api/FRONTEND_API_CONTRACT.md).
     */
    @Transactional
    public void deleteAccount(Long currentUserId) {
        if (!userRepository.existsById(currentUserId)) {
            throw new NotFoundException("User not found");
        }
        userRepository.deleteById(currentUserId);
    }

    // ---------------------------------------------------------------
    // Follow / Block
    // ---------------------------------------------------------------

    @Transactional
    public String followUnfollow(Long currentUserId, Long targetUserId) {
        if (currentUserId.equals(targetUserId)) {
            throw new BadRequestException("You cannot follow yourself");
        }
        User self = userRepository.findById(currentUserId).orElseThrow(() -> new NotFoundException("User not found"));
        boolean alreadyFollowing = userFollowRepository.existsByFollowerIdAndFolloweeId(currentUserId, targetUserId);
        if (alreadyFollowing) {
            userFollowRepository.deleteByFollowerIdAndFolloweeId(currentUserId, targetUserId);
            return "Unfollowed successfully";
        }

        UserFollow follow = new UserFollow();
        follow.setFollowerId(currentUserId);
        follow.setFolloweeId(targetUserId);
        userFollowRepository.save(follow);

        notificationPublisher.publishFollowNotification(targetUserId, currentUserId, self.getUsername(),
                self.getProfilePictureUrl());
        return "Followed successfully";
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private UserResponse toFullUserResponse(User user, Long currentUserId) {
        UserResponse base = userMapper.toUserResponse(user);
        long followers = userFollowRepository.countByFolloweeId(user.getId());
        long following = userFollowRepository.countByFollowerId(user.getId());
        
        boolean isFollowing = false;
        if (currentUserId != null) {
            isFollowing = userFollowRepository.existsByFollowerIdAndFolloweeId(currentUserId, user.getId());
        }
        
        return new UserResponse(base.id(), base.name(), base.fullName(), base.email(), base.dob(),
                base.profilePicture(), base.bio(), base.gender(), base.accountVerified(), followers, following,
                isFollowing,
                base.createdAt(), base.updatedAt());
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<com.sphere.user.dto.response.UserSummaryResponse> getFollowers(Long userId, int page, int size) {
        org.springframework.data.domain.PageRequest pageRequest = org.springframework.data.domain.PageRequest.of(page, size);
        return userFollowRepository.findByFolloweeId(userId, pageRequest)
                .map(f -> userRepository.findById(f.getFollowerId()).map(userMapper::toSummary).orElse(null));
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<com.sphere.user.dto.response.UserSummaryResponse> getFollowing(Long userId, int page, int size) {
        org.springframework.data.domain.PageRequest pageRequest = org.springframework.data.domain.PageRequest.of(page, size);
        return userFollowRepository.findByFollowerId(userId, pageRequest)
                .map(f -> userRepository.findById(f.getFolloweeId()).map(userMapper::toSummary).orElse(null));
    }

    // For list-style endpoints (search/suggested/birthdays) the source
    // projects only a few fields (name/profilePicture/...); reusing the full
    // UserResponse shape here (with counts omitted/zeroed) keeps one
    // response type across the API rather than introducing a parallel DTO
    // for a projection difference that costs little to just include.
    private UserResponse toSummaryAsUserResponse(User user) {
        return userMapper.toUserResponse(user);
    }

    private boolean isAtLeast13YearsOld(LocalDate dob) {
        return dob.isBefore(LocalDate.now().minusYears(13)) || dob.isEqual(LocalDate.now().minusYears(13));
    }

    private boolean eq(Object a, Object b) {
        return java.util.Objects.equals(a, b);
    }
}
