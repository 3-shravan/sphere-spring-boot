# SAVE / UNSAVE (BOOKMARK) ARCHITECTURE

---

# Business Goal

Allow users to save posts for later viewing without affecting public engagement metrics.

Render feed posts like:

```json
{
  "postId": 101,
  "content": "Hello World",
  "isSaved": true
}
```

without loading all saved posts for the user.

---

# Why Save Requires Special Handling

Bookmarks are a personal relationship.

Unlike likes:

```text
Likes = Public

Bookmarks = Private
```

Only the logged-in user should know whether they saved a post.

---

# ❌ Wrong Design

When rendering feed:

```json
{
  "postId": 101,
  "savedUsers": [
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
isSaved =
    savedUsers.some(
        user => user.id === currentUserId
    );
```

Problems:

- Huge payload
- Privacy concerns
- Poor scalability
- Unnecessary data transfer

---

# ✅ Correct Design

Feed API:

```json
{
  "postId": 101,
  "isSaved": true
}
```

Frontend immediately knows:

```text
🔖 Saved
```

without downloading the entire bookmark collection.

---

# Database Design

## POSTS

```text
id   content
-------------------
101  Hello World
102  Spring Boot
103  PostgreSQL
```

---

## SAVED_POSTS

```text
user_id   post_id
-----------------
1         101
1         103

2         102

3         101
```

Meaning:

```text
User1 saved:
101
103

User2 saved:
102

User3 saved:
101
```

---

# Relationship Model

```text
User
 |
 └── Saved Post
       |
       └── Post
```

This represents:

```text
User ↔ Post
```

relationship.

---

# COMPLETE FEED FLOW

---

## Step 1

### User Opens Feed

Frontend:

```http
GET /api/v1/posts/feed?page=0&size=3
```

Current User:

```text
UserId = 1
```

---

## Step 2

### Backend Loads Posts

Query:

```sql
SELECT *
FROM posts
ORDER BY created_at DESC
LIMIT 3;
```

Result:

```text
101
102
103
```

Backend Memory:

```java
[
   Post101,
   Post102,
   Post103
]
```

At this stage backend only knows:

```text
Posts
```

It does NOT know:

```text
Saved Status
Like Status
Comment Count
```

---

## Step 3

### Extract Post IDs

Backend:

```java
List<Long> postIds =
[
   101,
   102,
   103
];
```

These IDs will be used in batch queries.

---

## Step 4

### Determine Saved Posts For Current User

Current User:

```text
userId = 1
```

Backend executes:

```sql
SELECT post_id
FROM saved_posts
WHERE user_id = 1
AND post_id IN (101,102,103);
```

---

# SQL Processing

Saved Posts Table:

```text
1 101
1 103

2 102

3 101
```

Apply:

```sql
user_id = 1
```

Remaining Rows:

```text
1 101

1 103
```

Apply:

```sql
post_id IN (101,102,103)
```

Still:

```text
101
103
```

---

# SQL Result

```text
post_id
-------
101
103
```

Backend Converts:

```java
Set<Long> savedPosts =
[
   101,
   103
];
```

Meaning:

```text
Post101 = Saved

Post102 = Not Saved

Post103 = Saved
```

---

## Step 5

### Build DTO For Each Post

For Post101:

Check:

```java
savedPosts.contains(101)
```

Result:

```text
true
```

DTO:

```json
{
  "postId": 101,
  "content": "Hello World",
  "isSaved": true
}
```

---

For Post102:

```java
savedPosts.contains(102)
```

Result:

```text
false
```

DTO:

```json
{
  "postId": 102,
  "content": "Spring Boot",
  "isSaved": false
}
```

---

For Post103:

```java
savedPosts.contains(103)
```

Result:

```text
true
```

DTO:

```json
{
  "postId": 103,
  "content": "PostgreSQL",
  "isSaved": true
}
```

---

## Step 6

### Final Feed Response

```json
{
  "content": [
    {
      "postId": 101,
      "content": "Hello World",
      "isSaved": true
    },
    {
      "postId": 102,
      "content": "Spring Boot",
      "isSaved": false
    },
    {
      "postId": 103,
      "content": "PostgreSQL",
      "isSaved": true
    }
  ]
}
```

---

# Frontend Rendering

---

## Post101

Response:

```json
{
  "isSaved": true
}
```

UI:

```text
🔖 Saved
```

---

## Post102

Response:

```json
{
  "isSaved": false
}
```

UI:

```text
📑 Save
```

---

## Post103

Response:

```json
{
  "isSaved": true
}
```

UI:

```text
🔖 Saved
```

---

# SAVE POST FLOW

---

## Initial State

Response:

```json
{
  "postId": 102,
  "isSaved": false
}
```

UI:

```text
📑 Save
```

---

## User Clicks Save

Frontend Sends:

```http
POST /api/v1/posts/102/save
```

Backend Receives:

```text
userId = 1
postId = 102
```

---

## Database Insert

```sql
INSERT INTO saved_posts
(
    user_id,
    post_id
)
VALUES
(
    1,
    102
);
```

---

## Database After Insert

```text
1 101
1 102
1 103

2 102

3 101
```

---

## Updated State

Query:

```sql
SELECT EXISTS(
   SELECT 1
   FROM saved_posts
   WHERE user_id = 1
   AND post_id = 102
);
```

Result:

```text
TRUE
```

---

## Response

```json
{
  "postId": 102,
  "isSaved": true
}
```

---

## Frontend Updates

Old:

```text
📑 Save
```

New:

```text
🔖 Saved
```

No page refresh required.

---

# UNSAVE FLOW

---

## User Clicks Saved Button

Frontend:

```http
DELETE /api/v1/posts/102/save
```

Backend Receives:

```text
userId = 1
postId = 102
```

---

## Database Delete

```sql
DELETE
FROM saved_posts
WHERE user_id = 1
AND post_id = 102;
```

---

## Database After Delete

```text
1 101
1 103

2 102

3 101
```

---

## Response

```json
{
  "postId": 102,
  "isSaved": false
}
```

---

## Frontend Updates

```text
📑 Save
```

---

# Viewing Saved Posts

Unlike likes and comments:

```text
Bookmarks are private
```

Only the owner should see them.

---

# User Opens Saved Posts Screen

Frontend:

```http
GET /api/v1/posts/saved?page=0&size=10
```

Current User:

```text
UserId = 1
```

---

# Backend Fetches Saved Posts

Query:

```sql
SELECT post_id
FROM saved_posts
WHERE user_id = 1;
```

Result:

```text
101
103
```

---

# Load Actual Posts

```sql
SELECT *
FROM posts
WHERE id IN (101,103);
```

---

# Response

```json
{
  "content": [
    {
      "postId": 101,
      "content": "Hello World",
      "isSaved": true
    },
    {
      "postId": 103,
      "content": "PostgreSQL",
      "isSaved": true
    }
  ]
}
```

---

# Why We Use IN()

Once feed posts are loaded:

```text
101
102
103
```

Instead of asking:

```text
Is 101 saved?
Is 102 saved?
Is 103 saved?
```

and executing three queries,

we ask once:

```sql
SELECT post_id
FROM saved_posts
WHERE user_id = 1
AND post_id IN (101,102,103);
```

Meaning:

```text
Among these visible feed posts,
which ones has the current user saved?
```

Result:

```text
101
103
```

Single query.

---

# N+1 Query Problem

## ❌ Wrong

For every post:

```java
isSaved(postId,userId);
```

Feed:

```text
20 Posts
```

Queries:

```text
20 Database Calls
```

---

## ✅ Correct

Single Query:

```sql
SELECT post_id
FROM saved_posts
WHERE user_id = ?
AND post_id IN (...);
```

Total:

```text
1 Database Call
```

for entire feed.

---

# Complete Save Architecture Flow

```text
User Opens Feed
        ↓
Load Posts
        ↓
Extract Post IDs
        ↓
Find User Saved Posts
        ↓
Build DTOs
        ↓
Return Feed Response
        ↓
Render Save Icon
        ↓
User Saves Post
        ↓
Insert Into saved_posts
        ↓
Return Updated State
        ↓
UI Changes To Saved
```

---

# Final Response Design

Feed DTO:

```json
{
  "postId": 101,
  "content": "Hello World",
  "isSaved": true
}
```

---

Saved Posts Screen:

```http
GET /posts/saved
```

Returns:

```json
{
  "content": [
    {
      "postId": 101
    },
    {
      "postId": 103
    }
  ]
}
```

---

# Architectural Rule

Never return:

```json
{
  "savedUsers": []
}
```

Never return:

```json
{
  "savedPosts": []
}
```

inside feed responses.

Instead return:

```json