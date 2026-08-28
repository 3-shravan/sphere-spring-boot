package com.sphere.user.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sphere.user.dto.request.UpdateProfileRequest;
import com.sphere.user.dto.response.UserResponse;
import com.sphere.user.entity.User;
import com.sphere.user.service.UserService;
import com.sphere.user.util.ResponseUtil;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Ports server/src/routes/user.routes.js. Every route here requires auth
 * (matches the source — user.routes.js applies authUser to all of these).
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Users", description = "Profile, search, suggested users, birthdays, follow")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(required = false) String search) {
        var users = userService.getAllUsers(currentUser.getId(), search);
        return ResponseEntity.ok(ResponseUtil.success("Users fetched successfully", Map.of("users", users)));
    }

    @GetMapping("/suggested")
    public ResponseEntity<Map<String, Object>> getSuggestedUsers(@AuthenticationPrincipal User currentUser) {
        var users = userService.getSuggestedUsers(currentUser.getId());
        return ResponseEntity.ok(ResponseUtil.success("Suggested users fetched", Map.of("users", users)));
    }

    @GetMapping("/birthdays")
    public ResponseEntity<Map<String, Object>> getTodaysBirthdays(@AuthenticationPrincipal User currentUser) {
        var users = userService.getTodaysBirthdays(currentUser != null ? currentUser.getId() : null);
        return ResponseEntity.ok(ResponseUtil.success("Today's Birthdays", Map.of("users", users)));
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> myProfile(@AuthenticationPrincipal User currentUser) {
        UserResponse user = userService.myProfile(currentUser.getId());
        return ResponseEntity.ok(ResponseUtil.success("Profile fetched", Map.of("user", user)));
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<Map<String, Object>> getProfileByUsername(@PathVariable String username, @AuthenticationPrincipal User currentUser) {
        UserResponse user = userService.getProfileByUsername(username, currentUser != null ? currentUser.getId() : null);
        return ResponseEntity.ok(ResponseUtil.success("Profile fetched", Map.of("user", user)));
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<Map<String, Object>> getFollowers(
            @PathVariable Long userId,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "20") int size) {
        org.springframework.data.domain.Page<com.sphere.user.dto.response.UserSummaryResponse> followers = userService.getFollowers(userId, page, size);
        return ResponseEntity.ok(ResponseUtil.success("Followers fetched", Map.of("followers", followers)));
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<Map<String, Object>> getFollowing(
            @PathVariable Long userId,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "20") int size) {
        org.springframework.data.domain.Page<com.sphere.user.dto.response.UserSummaryResponse> following = userService.getFollowing(userId, page, size);
        return ResponseEntity.ok(ResponseUtil.success("Following fetched", Map.of("following", following)));
    }

    @PostMapping(value = "/update", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @ModelAttribute UpdateProfileRequest request,
            @RequestPart(required = false) MultipartFile profilePicture) {
        UserService.UpdateProfileResult result = userService.updateProfile(currentUser.getId(), request,
                profilePicture);
        String message = result.changed() ? "Profile updated successfully" : "No changes were made";
        return ResponseEntity.ok(ResponseUtil.success(message, Map.of("user", result.user())));
    }

    @PutMapping("/{id}/follow")
    public ResponseEntity<Map<String, Object>> followUnfollow(
            @AuthenticationPrincipal User currentUser, @PathVariable Long id) {
        String message = userService.followUnfollow(currentUser.getId(), id);
        return ResponseEntity.ok(ResponseUtil.success(message));
    }

    @DeleteMapping("/profile-picture")
    public ResponseEntity<Map<String, Object>> deleteProfilePicture(@AuthenticationPrincipal User currentUser) {
        userService.deleteProfilePicture(currentUser.getId());
        return ResponseEntity.ok(ResponseUtil.success("Profile picture removed."));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteAccount(@AuthenticationPrincipal User currentUser) {
        userService.deleteAccount(currentUser.getId());
        return ResponseEntity.ok(ResponseUtil.success("Account deleted"));
    }
}
