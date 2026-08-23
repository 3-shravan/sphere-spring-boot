package com.sphere.user.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sphere.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsernameAndAccountVerifiedTrue(String username);

    Optional<User> findByEmailAndAccountVerifiedTrue(String email);

    boolean existsByUsernameAndAccountVerifiedTrue(String username);

    boolean existsByEmailAndAccountVerifiedTrue(String email);

    @Query("""
            SELECT u FROM User u
            WHERE u.accountVerified = false
              AND u.email = :email
            """)
    Optional<User> findUnverifiedByEmail(@Param("email") String email);

    Optional<User> findByResetPasswordTokenHashAndAccountVerifiedTrueAndResetPasswordTokenExpiresAtAfter(
            String tokenHash, Instant now);

    @Query("""
            SELECT u FROM User u
            WHERE u.accountVerified = true
              AND (:search IS NULL OR :search = ''
                   OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))
              AND u.id NOT IN :excludedIds
            ORDER BY u.createdAt DESC
            """)
    List<User> searchVerifiedUsers(@Param("search") String search, @Param("excludedIds") List<Long> excludedIds, Pageable pageable);

    @Query("""
            SELECT u FROM User u
            WHERE u.accountVerified = true
              AND EXTRACT(DAY FROM u.dob) = :day
              AND EXTRACT(MONTH FROM u.dob) = :month
            """)
    List<User> findTodaysBirthdays(@Param("day") int day, @Param("month") int month);

    @Modifying
    @Query("""
            UPDATE User u SET u.resetPasswordTokenHash = NULL, u.resetPasswordTokenExpiresAt = NULL
            WHERE u.resetPasswordTokenExpiresAt < :now
            """)
    int clearExpiredResetTokens(@Param("now") Instant now);

    @Modifying
    @Query("DELETE FROM User u WHERE u.accountVerified = false AND u.createdAt < :cutoff")
    int deleteUnverifiedOlderThan(@Param("cutoff") Instant cutoff);
}
