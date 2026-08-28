# FOLLOW / UNFOLLOW ARCHITECTURE

---

# Business Goal

Allow users to follow and unfollow other users efficiently while keeping profile APIs lightweight and scalable.

Render profile pages like:

```json
{
  "id": 10,
  "username": "john",
  "followersCount": 500,
  "followingCount": 120,
  "isFollowing": true
}
```

without loading the complete followers list.

---

# Why Follow Needs Special Handling

A user may have:

```text
10 Followers
1,000 Followers
100,000 Followers
10,000,000 Followers
```

Loading all followers whenever someone views the profile is extremely expensive.

---

# ❌ Wrong Design

Profile API:

```json
{
  "id": 10,
  "username": "john",
  "followers": [
    {
      "id": 1
    },
    {
      "id": 2
    }
  ]
}
```

Frontend:

```javascript
const isFollowing =
  profile.followers.some(
    f => f.id === loggedInUserId
  );
```

Problems:

```text
Huge payload
Slow profile loading
Memory consumption
Database pressure
Poor scalability
```

---

# ✅ Correct Design

Profile API:

```json
{
  "id": 10,
  "username": "john",
  "followersCount": 500,
  "followingCount": 120,
  "isFollowing": true
}
```

Frontend immediately knows:

```text
Followers = 500

Button = Following
```

without downloading 500 follower records.

---

# Database Design

## USERS

```text
id   username
-------------
1    sravan
2    alex
3    bob
10   john
```

---

## USER_FOLLOWS

```text
follower_id   following_id
--------------------------
1             10
2             10
3             10

1             2
1             3
```

Meaning:

```text
User1 follows User10
User2 follows User10
User3 follows User10

User1 also follows User2
User1 also follows User3
```

---

# Relationship Model

```text
User
 |
 └── Follow
       |
       └── User
```

Represents:

```text
User ↔ User
```

relationship.

---

# COMPLETE PROFILE FLOW

---

## Step 1

### User Opens Profile

Logged In User:

```text
UserId = 1
```

Profile Being Viewed:

```text
UserId = 10
```

Frontend:

```http
GET /api/v1/users/10
```

---

## Step 2

### Backend Loads User

Query:

```sql
SELECT *
FROM users
WHERE id = 10;
```

Result:

```text
John
```

Backend Memory:

```java
User user = John
```

At this point backend only knows:

```text
User Information
```

Backend does NOT know:

```text
Followers Count
Following Count
Follow State
```

yet.

---

# Step 3

### Calculate Followers Count

Query:

```sql
SELECT COUNT(*)
FROM user_follows
WHERE following_id = 10;
```

---

# SQL Processing

Rows:

```text
1 → 10
2 → 10
3 → 10
```

Count:

```text
3
```

Backend:

```java
followersCount = 3;
```

Meaning:

```text
John has 3 followers.
```

---

# Step 4

### Calculate Following Count

Query:

```sql
SELECT COUNT(*)
FROM user_follows
WHERE follower_id = 10;
```

Suppose Result:

```text
50
```

Backend:

```java
followingCount = 50;
```

Meaning:

```text
John follows 50 people.
```

---

# Step 5

### Determine Follow State

Current User:

```text
1
```

Profile User:

```text
10
```

Query:

```sql
SELECT EXISTS(
   SELECT 1
   FROM user_follows
   WHERE follower_id = 1
   AND following_id = 10
);
```

---

# SQL Processing

Table:

```text
1 → 10
2 → 10
3 → 10
```

Check:

```text
Does row exist?

1 → 10
```

Result:

```text
TRUE
```

Backend:

```java
isFollowing = true;
```

Meaning:

```text
Current user already follows John.
```

---

# Step 6

### Build UserResponse

Backend Builds:

```json
{
  "id": 10,
  "username": "john",
  "followersCount": 3,
  "followingCount": 50,
  "isFollowing": true
}
```

---

# Step 7

### Return Profile Response

Final Response:

```json
{
  "id": 10,
  "username": "john",
  "followersCount": 3,
  "followingCount": 50,
  "isFollowing": true
}
```

---

# Frontend Rendering

---

Profile Data:

```json
{
  "followersCount": 3,
  "followingCount": 50,
  "isFollowing": true
}
```

UI:

```text
John

Followers: 3
Following: 50

[ Following ]
```

---

# Different User Scenario

Current User:

```text
UserId = 8
```

Profile:

```text
UserId = 10
```

Query:

```sql
SELECT EXISTS(
   SELECT 1
   FROM user_follows
   WHERE follower_id = 8
   AND following_id = 10
);
```

Result:

```text
FALSE
```

Response:

```json
{
  "followersCount": 3,
  "followingCount": 50,
  "isFollowing": false
}
```

UI:

```text
Followers: 3

[ Follow ]
```

---

# FOLLOW FLOW

---

## Initial State

```json
{
  "followersCount": 3,
  "isFollowing": false
}
```

Frontend:

```text
[ Follow ]
```

---

## User Clicks Follow

Frontend:

```http
POST /api/v1/users/10/follow
```

Backend Receives:

```text
Current User = 8

Target User = 10
```

---

# Database Insert

Query:

```sql
INSERT INTO user_follows
(
   follower_id,
   following_id
)
VALUES
(
   8,
   10
);
```

---

# Database After Insert

```text
1 → 10
2 → 10
3 → 10
8 → 10
```

John now has:

```text
4 Followers
```

---

# Backend Recalculates

Followers Count:

```text
4
```

Follow State:

```text
TRUE
```

---

# Response

```json
{
  "userId": 10,
  "followersCount": 4,
  "isFollowing": true
}
```

---

# Frontend Updates

Old:

```text
[ Follow ]
```

New:

```text
[ Following ]
```

No profile refresh required.

---

# UNFOLLOW FLOW

---

## User Clicks Following

Frontend:

```http
DELETE /api/v1/users/10/follow
```

---

Backend Receives:

```text
Current User = 8

Target User = 10
```

---

# Database Delete

```sql
DELETE
FROM user_follows
WHERE follower_id = 8
AND following_id = 10;
```

---

# Database After Delete

```text
1 → 10
2 → 10
3 → 10
```

John returns to:

```text
3 Followers
```

---

# Backend Recalculates

Followers Count:

```text
3
```

Follow State:

```text
FALSE
```

---

# Response

```json
{
  "userId": 10,
  "followersCount": 3,
  "isFollowing": false
}
```

---

# Frontend Updates

Old:

```text
[ Following ]
```

New:

```text
[ Follow ]
```

---

# Followers Screen

The profile API should NEVER return:

```json
{
  "followers": [...]
}
```

---

When User Clicks:

```text
3 Followers
```

Frontend Calls:

```http
GET /api/v1/users/10/followers?page=0&size=20
```

---

# Backend Query

```sql
SELECT u.*
FROM users u
JOIN user_follows uf
ON u.id = uf.follower_id
WHERE uf.following_id = 10
LIMIT 20;
```

---

# Response

```json
{
  "content": [
    {
      "id": 1,
      "username": "sravan"
    },
    {
      "id": 2,
      "username": "alex"
    },
    {
      "id": 3,
      "username": "bob"
    }
  ],
  "totalElements": 3
}
```

---

# Following Screen

User Clicks:

```text
50 Following
```

Frontend:

```http
GET /api/v1/users/10/following?page=0&size=20
```

---

# Response

```json
{
  "content": [
    {
      "id": 100,
      "username": "mike"
    },
    {
      "id": 101,
      "username": "sam"
    }
  ],
  "totalElements": 50
}
```

---

# User Listing / Suggestions Page

Suppose:

```text
GET /users/suggestions
```

returns:

```text
20 users
```

For each user we need:

```text
followersCount

isFollowing
```

---

# ❌ Bad Approach

For every user:

```java
countFollowers(user);

checkFollowing(user);
```

20 users:

```text
20 follower queries

20 follow queries

40 database calls
```

---

# ✅ Correct Approach

Batch Count Query

```sql
SELECT
  following_id,
  COUNT(*)
FROM user_follows
WHERE following_id IN (...)
GROUP BY following_id;
```

---

Batch Following Query

```sql
SELECT following_id
FROM user_follows
WHERE follower_id = :currentUser
AND following_id IN (...);
```

Only:

```text
2 Queries
```

for all users.

---

# Why EXISTS Is Used

Instead of:

```sql
SELECT *
FROM user_follows
WHERE follower_id = 1
AND following_id = 10;
```

we use:

```sql
SELECT EXISTS(...);
```

because we only care about:

```text
TRUE

or

FALSE
```

Not the full row.

This is faster and more efficient.

---

# Complete Follow Architecture Flow

```text
User Opens Profile
        ↓
Load User
        ↓
Calculate Followers Count
        ↓
Calculate Following Count
        ↓
Determine Follow State
        ↓
Build UserResponse
        ↓
Return Profile
        ↓
Render Follow Button
        ↓
User Follows / Unfollows
        ↓
Update user_follows Table
        ↓
Recalculate State
        ↓
Return Updated Response
        ↓
Update UI
```

---

# Final Response Design

Profile DTO:

```json
{
  "id": 10,
  "username": "john",
  "followersCount": 500,
  "followingCount": 120,
  "isFollowing": true
}
```

---

Followers Screen:

```http
GET /users/{id}/followers
```

Following Screen:

```http
GET /users/{id}/following
```

---

# Architectural Rule

Never return:

```json
{
  "followers": []
}
```

Never return:

```json
{
  "following": []
}