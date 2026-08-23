package com.sphere.user.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sphere.user.entity.User;
import com.sphere.user.entity.UserFollow;
import com.sphere.user.exception.NotFoundException;
import com.sphere.user.repository.UserFollowRepository;
import com.sphere.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
public class InternalUserController {

    private final UserRepository userRepository;
    private final UserFollowRepository userFollowRepository;

    public record AuthorSummary(Long id, String name, String profilePicture) {}

    @GetMapping("/{id}")
    public AuthorSummary getAuthorSummary(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
        return new AuthorSummary(user.getId(), user.getUsername(), user.getProfilePictureUrl());
    }

    @GetMapping("/{id}/following-ids")
    public List<Long> getFollowingIds(@PathVariable Long id) {
        return userFollowRepository.findByFollowerId(id).stream()
                .map(UserFollow::getFolloweeId)
                .toList();
    }

    @GetMapping("/{id}/blocked-ids")
    public List<Long> getBlockedIds(@PathVariable Long id) {
        // Block functionality was removed, so return empty list
        return List.of();
    }
}
