# Social Media Relationship Architecture: Implementation Walkthrough

All relationship-based features across `user-service` and `post-service` have been successfully refactored according to the core principles defined in [SOCIAL_MEDIA_ARCHITECTURE.md](file:///c:/Users/sravanku/PROJECTS/sphere-spring-boot/SOCIAL_MEDIA_ARCHITECTURE.md).

---

## Architectural Changes & Optimizations

### 1. Follow / Unfollow (`user-service`)
- **Relationship Table:** Retained the dedicated, indexed `user_follows` table (`(follower_id, followee_id)` composite primary key).
- **Single-Query Projections for Paginated Followers / Following:**
  - Replaced the previous N+1 query pattern (`findByFolloweeId` + iterative `userRepository.findById`) with single-query JPQL DTO projections:
    ```java
    @Query("""
        SELECT new com.sphere.user.dto.response.UserSummaryResponse(u.id, u.username, u.profilePictureUrl)
        FROM UserFollow f, User u
        WHERE f.followerId = u.id AND f.followeeId = :userId
        ORDER BY f.createdAt DESC
    """)
    Page<UserSummaryResponse> findFollowersSummaryByFolloweeId(@Param("userId") Long userId, Pageable pageable);
    ```
- **Batch Aggregations & EXISTS for User Lists:**
  - `getAllUsers`, `getSuggestedUsers`, and `getTodaysBirthdays` now use `toHydratedUserResponses`, which aggregates `followersCount`, `followingCount`, and `isFollowing` across the entire result set in **3 batch queries total** instead of executing per-user lookups or returning zeroed dummy values.
- **Dedicated Paginated APIs:**
  - `GET /api/v1/users/{userId}/followers?page=0&size=20`
  - `GET /api/v1/users/{userId}/following?page=0&size=20`

---

### 2. Like / Unlike (`post-service`)
- **Normalized Storage:**
  - Maintained dedicated `post_likes` table (`(post_id, user_id)` composite PK).
  - **Removed embedded `recentLikers` JSON column** from `Post.java` and `PostResponse.java`. No large collections or relation arrays are stored in entities or primary DTOs.
- **Feed N+1 Query Elimination:**
  - Previously, fetching a feed page of 20 posts ran 80 individual queries.
  - Replaced with batch aggregations (`countLikesByPostIds` using `GROUP BY` and `findLikedPostIdsByUserId` using `IN (:postIds)`).
  - A feed page now resolves like counts and `isLiked` state flags in **2 batch queries** for the entire batch.
- **Dedicated Paginated Likes Listing API:**
  - Added `GET /api/v1/posts/{postId}/likes?page=1&limit=20` returning `Page<AuthorSummary>` for retrieving user records who liked a post.

---

### 3. Save / Unsave (Bookmark) (`post-service`)
- **Normalized Storage:**
  - Retained dedicated `saved_posts` table (`(user_id, post_id)` composite PK).
- **Batch State Determination:**
  - Replaced per-post `existsByUserIdAndPostId` with batch query `findSavedPostIdsByUserId(userId, postIds)`.
  - Determines `isSaved` for all posts in a feed in a **single query**.
- **Dedicated Paginated Bookmarks API:**
  - Refactored `GET /api/v1/posts/saved` to accept `page` and `limit` and return paginated `FeedPageResponse`.

---

### 4. Comments (`post-service`)
- **Relational Storage with Tree Hierarchy:**
  - Retained `comments` table with indexed `post_id` and self-referencing `parent_comment_id` FK (`ON DELETE CASCADE`).
- **Batch Comment Counts in Feeds:**
  - Implemented `countCommentsByPostIds` (`SELECT c.postId, COUNT(c) FROM Comment c WHERE c.postId IN :postIds GROUP BY c.postId`).
  - Feeds now hydrate `commentsCount` in a **single batch query**.
- **Dedicated API:**
  - Zero comments are embedded in `PostResponse`. Comment trees are retrieved strictly via `GET /api/v1/posts/{postId}/comments`.

---

## Primary API Response Shapes

### User Profile (`UserResponse`)
```json
{
  "id": 1,
  "name": "john_doe",
  "fullName": "John Doe",
  "email": "john@example.com",
  "profilePicture": "https://...",
  "bio": "Software Engineer",
  "followersCount": 120,
  "followingCount": 85,
  "isFollowing": true
}
```

### Post Feed (`PostResponse`)
```json
{
  "id": 42,
  "author": {
    "id": 1,
    "name": "john_doe",
    "profilePicture": "https://..."
  },
  "postType": "media",
  "caption": "Exploring nature",
  "media": "https://...",
  "likesCount": 54,
  "likedByCurrentUser": true,
  "isLiked": true,
  "commentsCount": 12,
  "isSaved": false,
  "createdAt": "2026-08-28T11:00:00Z"
}
```
*(Notice: No embedded collections like `followers: []`, `likes: []`, or `comments: []` inside primary DTOs).*
