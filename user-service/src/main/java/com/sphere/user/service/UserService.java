package com.sphere.user.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.sphere.user.dto.request.UpdateProfileRequest;
import com.sphere.user.dto.response.CountProjection;
import com.sphere.user.dto.response.UserResponse;
import com.sphere.user.dto.response.UserSummaryResponse;
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
 * Implements high-performance relationship architecture:
 * - Direct JPQL Projections for paginated followers/following (O(1) database queries)
 * - Batch aggregation and EXISTS checks for user lists (eliminating N+1)
 * - Dynamic state and count calculation
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

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers(Long currentUserId, String search) {
        List<User> users = userRepository.searchVerifiedUsers(search, List.of(-1L),
                PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "createdAt")));
        return toHydratedUserResponses(users, currentUserId);
    }

    // ---------------------------------------------------------------
    // GET /users/suggested
    // ---------------------------------------------------------------

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

        List<User> combined = new ArrayList<>(mutualUsers);
        combined.addAll(fallbackUsers);

        return toHydratedUserResponses(combined, currentUserId);
    }

    // ---------------------------------------------------------------
    // GET /users/birthdays
    // ---------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<UserResponse> getTodaysBirthdays(Long currentUserId) {
        LocalDate today = LocalDate.now();
        List<User> users = userRepository.findTodaysBirthdays(today.getDayOfMonth(), today.getMonthValue());
        return toHydratedUserResponses(users, currentUserId);
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

    @Transactional
    public void deleteAccount(Long currentUserId) {
        if (!userRepository.existsById(currentUserId)) {
            throw new NotFoundException("User not found");
        }
        userRepository.deleteById(currentUserId);
    }

    // ---------------------------------------------------------------
    // Follow / Unfollow
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
    // Dedicated Paginated Followers & Following APIs (Single JPQL Projection)
    // ---------------------------------------------------------------

    @Transactional(readOnly = true)
    public Page<UserSummaryResponse> getFollowers(Long userId, int page, int size) {
        return userFollowRepository.findFollowersSummaryByFolloweeId(userId, PageRequest.of(page, size));
    }

    @Transactional(readOnly = true)
    public Page<UserSummaryResponse> getFollowing(Long userId, int page, int size) {
        return userFollowRepository.findFollowingSummaryByFollowerId(userId, PageRequest.of(page, size));
    }

    // ---------------------------------------------------------------
    // Helpers & Batch Hydration (Eliminates N+1 Queries)
    // ---------------------------------------------------------------

    private UserResponse toFullUserResponse(User user, Long currentUserId) {
        long followers = userFollowRepository.countByFolloweeId(user.getId());
        long following = userFollowRepository.countByFollowerId(user.getId());
        
        boolean isFollowing = false;
        if (currentUserId != null) {
            isFollowing = userFollowRepository.existsByFollowerIdAndFolloweeId(currentUserId, user.getId());
        }
        
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getDob(),
                user.getProfilePictureUrl(),
                user.getBio(),
                user.getGender(),
                user.isAccountVerified(),
                followers,
                following,
                isFollowing,
                user.getCreatedAt(),
                user.getUpdatedAt());
    }

    private List<UserResponse> toHydratedUserResponses(List<User> users, Long currentUserId) {
        if (users == null || users.isEmpty()) {
            return List.of();
        }

        List<Long> userIds = users.stream().map(User::getId).toList();

        Map<Long, Long> followersMap = userFollowRepository.countFollowersGrouped(userIds).stream()
                .collect(Collectors.toMap(CountProjection::getTargetId, CountProjection::getCount));

        Map<Long, Long> followingMap = userFollowRepository.countFollowingGrouped(userIds).stream()
                .collect(Collectors.toMap(CountProjection::getTargetId, CountProjection::getCount));

        Set<Long> followedIds = currentUserId != null
                ? userFollowRepository.findFollowedIds(currentUserId, userIds)
                : Set.of();

        return users.stream().map(u -> new UserResponse(
                u.getId(),
                u.getUsername(),
                u.getFullName(),
                u.getEmail(),
                u.getDob(),
                u.getProfilePictureUrl(),
                u.getBio(),
                u.getGender(),
                u.isAccountVerified(),
                followersMap.getOrDefault(u.getId(), 0L),
                followingMap.getOrDefault(u.getId(), 0L),
                followedIds.contains(u.getId()),
                u.getCreatedAt(),
                u.getUpdatedAt()
        )).toList();
    }

    private boolean isAtLeast13YearsOld(LocalDate dob) {
        return dob.isBefore(LocalDate.now().minusYears(13)) || dob.isEqual(LocalDate.now().minusYears(13));
    }

    private boolean eq(Object a, Object b) {
        return java.util.Objects.equals(a, b);
    }
}
