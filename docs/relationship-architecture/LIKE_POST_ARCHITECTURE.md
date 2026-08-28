# Social Media Relationship Architecture

## Overview

This document describes the standard architecture used for relationship-based features in a social media platform.

The architecture applies to:

- Follow / Unfollow
- Like / Unlike
- Save / Unsave
- Comments
- Shares / Reposts
- Reactions
- Friend Requests
- Notifications
- Any User ↔ User relationship
- Any User ↔ Content relationship

The primary goals are:

- Prevent N+1 Queries
- Keep API payloads small
- Improve PostgreSQL performance
- Improve feed rendering performance
- Support millions of interactions
- Keep frontend implementation clean

---

# Core Principle

The frontend should never receive large relationship collections inside primary APIs.

## ❌ Bad Design

```json
{
  "id": 101,
  "content": "Hello World",
  "likes": [
    { "id": 1 },
    { "id": 2 },
    { "id": 3 }
  ]
}
```

Frontend determines:

```javascript
const isLiked =
    post.likes.some(
        user => user.id === currentUserId
    );
```

Problems:

- Huge payloads
- Large memory consumption
- Slow API responses
- Poor scalability

---

## ✅ Good Design

```json
{
  "id": 101,
  "content": "Hello World",
  "likesCount": 3,
  "isLiked": true
}
```

Frontend immediately knows:

```text
Likes Count = 3
Heart State = ❤️
```

without downloading everyone who liked the post.

---

# Golden Rule

If UI needs only:

```text
Count
```

Return:

```json
{
  "count": 100
}
```

If UI needs only:

```text
Current User State
```

Return:

```json
{
  "isSomething": true
}
```

If UI needs actual records:

Create a dedicated paginated endpoint.

Examples:

```http
GET /posts/{id}/likes

GET /users/{id}/followers

GET /posts/{id}/comments

GET /users/me/bookmarks
```

---

# LIKE / UNLIKE ARCHITECTURE

---

# Business Goal

Render feed posts like:

```json
{
  "postId": 101,
  "content": "Hello World",
  "likesCount": 3,
  "isLiked": true
}
```

without loading all users who liked the post.

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

## POST_LIKES

```text
post_id   user_id
-----------------
101       1
101       2
101       3

102       4
102       5

103       1
103       6
```

Meaning:

```text
Post 101 liked by:
1,2,3

Post 102 liked by:
4,5

Post 103 liked by:
1,6
```

---

# COMPLETE FEED FLOW

---

## Step 1

### User Opens Feed

Frontend Request:

```http
GET /api/v1/posts/feed?page=0&size=3
```

---

## Step 2

### Backend Loads Feed Posts

SQL:

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
List<Post> posts =
[
    Post(101),
    Post(102),
    Post(103)
];
```

At this stage backend only knows:

```text
Posts
```

Backend does NOT know:

```text
Like Counts

Liked Status

Comment Counts

Save Status
```

yet.

---

## Step 3

### Extract Post IDs

Backend extracts:

```java
List<Long> postIds =
[
    101,
    102,
    103
];
```

These IDs are used for all optimization queries.

---

## Step 4

### Fetch Like Counts For All Posts At Once

Instead of:

```java
countLikes(101);

countLikes(102);

countLikes(103);
```

which creates:

```text
3 Separate Queries
```

Backend executes one query:

```sql
SELECT
    post_id,
    COUNT(*)
FROM post_likes
WHERE post_id IN (101,102,103)
GROUP BY post_id;
```

---

### SQL Internal Processing

Rows:

```text
101 1
101 2
101 3

102 4
102 5

103**
103 6
```

*rouped:

```text*Group 101

101 1
101*2
101 3

Count =*3
*``

*``text
Group 102

102 4
102 5

Cou*t = 2
```

*``text
Group*103

103 1
103 6

*ount = 2
```

*QL Result:

```text*post_id count*-------------
101     3
102     2
*03     2
```

Backend Converts:

`*`java
{
   101 -> 3,
   102*-> 2,
   103 -> 2*}
```

Now backend knows:

```text*Likes Count Per Post
```

---

## *tep 5

### Determine Which Posts C*rrent User Already Liked

Current *ser:

```text
User ID = 1
```

Bac*end Executes:

```sql
SELECT post_*d
FROM post_likes
WHERE user_id = *
AND post*id IN (101,102,103);
```

---

###*SQL Processing

Matching rows:

``*text
101 1

103 1
```

Result:

*``text
101
103
```

Backend Conver*s:

```java*Set<Long> likedPosts =
[
   101,
 * 103
];
```

Meaning:

```text*Post 101 = Liked

*ost 102*= Not Liked

Post 103 = Liked
```
*---

## Step 6

### Build DTO For *ach Post

---

### Post 101

Like *ount:

```text
3
```

State:

```t*xt
Liked
```

DTO:

```json
{
  "p*stId": 101,
  "content": "Hello Wo*ld",
  "likesCount": 3,
  "isLiked*: true
}
```

---

### Post 102

D*O:

```json
{
  "postId": 102,
  "*ontent": "Spring Boot",
  "likesCo*nt": 2,
  "isLiked": false
}
```

*--

### Post 103

DTO:

```json
{
* "postId": 103,
  "content": "Post*reSQL",
  "likesCount": 2,
  "isLi*ed": true
}
```

---

## Step 7

#*# Final Response Returned To Front*nd

```json
{
  "content": [
    {*      "postId": 101,
      "conten*": "Hello World",
      "likesCoun*": 3,
      "isLiked": true
    },*    {
      "postId": 102,
      "*ontent": "Spring Boot",
      "lik*sCount": 2,
      "isLiked": false*    },
    {
      "postId": 103,
*     "content": "PostgreSQL",
    * "likesCount": 2,
      "isLiked":*true
    }
  ]
}
```

---

# Front*nd Rendering

---

## Post 101

Re*ponse:

```json
{
  "likesCount": *,
  "isLiked": true
}
```

UI:

``*text
❤️ 3 Likes
```

---

## Post *02

Response:

```json
{
  "likesC*unt": 2,
  "isLiked": false
}
```
*UI:

```text
🤍 2 Likes
```

---

* LIKE POST FLOW

---

## Initial S*ate

```json
{
  "postId": 102,
  *likesCount": 2,
  "isLiked": false*}
```

Frontend:

```text
🤍 Like
*``

---

## User Clicks Like

Fron*end Sends:

```http
POST /api/v1/p*sts/102/like
```

Backend Receives*

```text
userId = 1
postId = 102
*``

---

## Database Insert

```sq*
INSERT INTO post_likes(
    post_*d,
    user_id
)
VALUES(
    102,
*   1
);
```

Database Becomes:

``*text*101 1
*01 2
101 3

102 1
102 4
102 5

103*1
103 6
```

---

## Backend Recal*ulates

Now:

```text
Post 102 Lik*s = 3

Current*User Liked = TRUE
```

*esponse*

```json
{
  "postId": 102,
  "*ikesCount": 3,
  "isLiked": true
}*``*

---

## Frontend Updates UI

Old*

```text
🤍 2 Likes
```

New:

``*text*❤️ 3 Likes
```

*o page refresh*required.

---

* UNLIKE FLOW

---

## User Clicks *nlike

Frontend:

```http
DELETE /*pi/v1/posts/102/like
```

Backend *eceives:

```text
userId = 1
*ostId = 102
```

---

## Database *elete

```sql
DELETE
FROM*post_likes
WHERE post_id = 102
AND*user_id = 1;
*``

Database Returns To:

*``text
101 1
101 2
*01 3

102 4
102*5

103 1
103 6
*``

---

## Backend Recalculates

*``text*Likes Count = 2

Current User*Liked = FALSE
```

Response:

*``json
{
* "postId": 102,
  "likesCount": 2,*  "isLiked": false
}
```

---

## *rontend Updates

```*ext
🤍 2 Likes
```

*--

* Viewing People Who Liked A Post

*he Feed API must NEVER return:

``*json
{
  "likes": [...]
}
```

*nstead:

```http*GET /api/v1/posts/{postId}/likes?p*ge=0&size=20
```

Response:

```js*n*{
* "content": [
    {
*     "id": 1,
     *"*sername": "sravan"
    },
    {
  *   "id": 2,
      "username": "joh*"
    }
  ],
  "totalElements": 50*0
}
```

Only load this informatio* when user explicitly clicks:

```*ext
5000 Likes
```

---

# Why IN *lause Exists

Feed already contain*:

```text
101
102
103
```

Instea* of asking:

Did User Like 101?

D*d User Like 102?

Did User*Like 103*

which generates multiple queries*

we ask once:

```sql
SELECT post*id
FROM post_likes
WHERE user_id =*1
AND post_id IN (101,102,103);
*``

Meaning:

```text
Among these *eed posts,
which ones*are*liked by current user?
```

Result*

```text
101
103*```

Single query.

Huge performan*e improvement.

---

# N+1 Query P*oblem

## Bad

For every post:

``*java
countLikes(postId);

isLiked*post*d,userId);
```

Feed Size:

```tex*
20 Posts
```

Queries:

```text*20 Count Queries

20 Like*Queries

*0 Database Calls
``*

---

## Good

*``sql
1 Query → Fetch Posts

1 Que*y → Fetch Like Counts

1 Query → F*tch User Likes
```

Total:

```tex*
3 Queries
```

for entire feed.

*--

# Final Architecture Summary

*``text
User Opens Feed
        ↓
F*tch Posts
        ↓
Extract Post I*s
        ↓
Fetch Like Counts (Bat*h Query)
        ↓
Fetch Current U*er Likes (Batch Query)
        ↓
B*ild DTO
        ↓
Return Lightweig*t Response
        ↓
Frontend Rend*rs
        ↓
User Likes / Unlikes
*       ↓
Relationship Table Update*
        ↓
Response Rebuilt
      * ↓
UI Updated
```

---

# Architec*ural Rule

Never return:

```json
*
  "likes": []
}
*``

inside feed*responses.

Always return:

```jso*
{
  "likesCount": 5000,
  "isLike*": true
}
```

*nd use*a dedicated paginated API whenever*actual records are needed.