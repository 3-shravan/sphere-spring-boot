package com.sphere.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
    org.springframework.data.domain.Page<UserFollow> findByFollowerId(Long followerId, org.springframework.data.domain.Pageable pageable);

    List<UserFollow> findByFolloweeId(Long followeeId);
    org.springframework.data.domain.Page<UserFollow> findByFolloweeId(Long followeeId, org.springframework.data.domain.Pageable pageable);

    long countByFollowerId(Long followerId);

    long countByFolloweeId(Long followeeId);
}
