package com.sphere.user.dto.response;

import java.time.Instant;
import java.time.LocalDate;

import com.sphere.user.entity.Gender;

/**
 * Full user projection — used for
 * login/verify-otp/getUser/myProfile/getProfiles.
 * Password is never included (mirrors `.select("-password")` / schema
 * `select:false` in the source — there is simply no field for it here).
 */
public record UserResponse(
                Long id,
                String name,
                String fullName,
                String email,
                LocalDate dob,
                String profilePicture,
                String bio,
                Gender gender,
                boolean accountVerified,
                long followersCount,
                long followingCount,
                Instant createdAt,
                Instant updatedAt) {
}
