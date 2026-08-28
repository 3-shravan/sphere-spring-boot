package com.sphere.user.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sphere.user.dto.response.CountProjection;
import com.sphere.user.dto.response.UserSummaryResponse;
import com.sphere.user.entity.UserFollow;
import com.sphere.user.entity.UserFollowId;

public interface UserFollowRepository extends JpaRepository<UserFollow, UserFollowId> {

    boolean existsByFollowerIdAndFolloweeId(Long followerId, Long followeeId);

    @Modifying
    @Query("DELETE FROM UserFollow f WHERE f.followerId = :followerId AND f.followeeId = :followeeId")
    void deleteByFollowerIdAndFolloweeId(@Param("followerId") Long followerId, @Param("followeeId") Long followeeId);

    @Modifying
    @Query("""
            DELETE FROM UserFollow f
            WHERE (f.followerId = :userA AND f.followeeId = :userB)
               OR (f.followerId = :userB AND f.followeeId = :userA)
            """)
    void deleteBothDirections(@Param("userA") Long userA, @Param("userB") Long userB);

    List<UserFollow> findByFollowerId(Long followerId);

    List<UserFollow> findByFolloweeId(Long followeeId);

    long countByFollowerId(Long followerId);

    long countByFolloweeId(Long followeeId);

    // Optimized single-query paginated followers projection (no N+1 lookups)
    @Query("""
            SELECT new com.sphere.user.dto.response.UserSummaryResponse(u.id, u.username, u.profilePictureUrl)
            FROM UserFollow f, User u
            WHERE f.followerId = u.id AND f.followeeId = :userId
            ORDER BY f.createdAt DESC
            """)
    Page<UserSummaryResponse> findFollowersSummaryByFolloweeId(@Param("userId") Long userId, Pageable pageable);

    // Optimized single-query paginated following projection (no N+1 lookups)
    @Query("""
            SELECT new com.sphere.user.dto.response.UserSummaryResponse(u.id, u.username, u.profilePictureUrl)
            FROM UserFollow f, User u
            WHERE f.followeeId = u.id AND f.followerId = :userId
            ORDER BY f.createdAt DESC
            """)
    Page<UserSummaryResponse> findFollowingSummaryByFollowerId(@Param("userId") Long userId, Pageable pageable);

    // Batch query to determine which users from a list the current user follows
    @Query("SELECT f.followeeId FROM UserFollow f WHERE f.followerId = :followerId AND f.followeeId IN :followeeIds")
    Set<Long> findFollowedIds(@Param("followerId") Long followerId, @Param("followeeIds") List<Long> followeeIds);

    // Batch query to aggregate follower counts for a list of users
    @Query("SELECT f.followeeId AS targetId, COUNT(f) AS count FROM UserFollow f WHERE f.followeeId IN :userIds GROUP BY f.followeeId")
    List<CountProjection> countFollowersGrouped(@Param("userIds") List<Long> userIds);

    // Batch query to aggregate following counts for a list of users
    @Query("SELECT f.followerId AS targetId, COUNT(f) AS count FROM UserFollow f WHERE f.followerId IN :userIds GROUP BY f.followerId")
    List<CountProjection> countFollowingGrouped(@Param("userIds") List<Long> userIds);
}
