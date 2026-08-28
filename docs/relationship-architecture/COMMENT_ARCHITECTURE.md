# COMMENTS ARCHITECTURE

---

# Business Goal

Render feed posts like:

```json
{
  "postId": 101,
  "content": "Hello World",
  "commentsCount": 500,
  "latestCommentPreview": "Nice Post"
}
```

without loading all comments for every post.

---

# Why Comments Need Special Handling

Comments are typically much larger than likes.

A post may have:

```text
50 Comments
500 Comments
5,000 Comments
50,000 Comments
```

Returning all comments inside the feed API would make the feed extremely slow.

---

# ❌ Wrong Design

```json
{
  "postId": 101,
  "content": "Hello World",
  "comments": [
      {
        "id": 1,
        "content": "Nice"
      },
      {
        "id": 2,
        "content": "Awesome"
      }
  ]
}
```

Problems:

- Large payload
- Slow feed loading
- Increased memory usage
- Difficult pagination
- N+1 issues

---

# ✅ Correct Design

Feed API returns:

```json
{
  "postId": 101,
  "content": "Hello World",
  "commentsCount": 500
}
```

Load actual comments only when user clicks:

```text
View Comments
```

---

# Database Design

## POSTS

```text
id      content
------------------------
101     Hello World
102     Spring Boot
103     PostgreSQL
```

---

## COMMENTS

```text
id   post_id   user_id   content
---------------------------------------------
1    101       1         Nice Post
2    101       2         Great Work
3    101       3         Amazing
4    102       1         Thanks
5    103       4         Useful
6    103       5         Awesome
7    103       6         Helpful
```

---

# Relationship Model

```text
Post
 |
 └── Comments
```

Each comment belongs to one post.

---

# COMPLETE FEED FLOW

---

## Step 1

### User Opens Feed

Frontend:

```http
GET /api/v1/posts/feed?page=0&size=3
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

---

## Step 3

### Extract Post IDs

Backend:

```java
postIds =
[
  101,
  102,
  103
];
```

---

## Step 4

### Fetch Comment Counts

Instead of:

```java
countComments(101);

countComments(102);

countComments(103);
```

Use one batch query.

---

SQL:

```sql
SELECT
    post_id,
    COUNT(*)
FROM comments
WHERE post_id IN (101,102,103)
GROUP BY post_id;
```

---

# Internal SQL Processing

Comments Table:

```text
1    101   Nice Post
2    101   Great Work
3    101   Amazing

4    102   Thanks

5    103   Useful
6    103   Awesome
7    103   Helpful
```

---

Group By 101

```text
Comment 1
Comment 2
Comment 3
```

Count:

```text
3
```

---

Group By 102

```text
Comment 4
```

Count:

```text
1
```

---

Group By 103

```text
Comment 5
Comment 6
Comment 7
```

*ount:

```text
3
```

*--

SQL Result:

```text
post_id  *count
---------------
*01       3
102       1
103      *3
*``

Backend Creates:

*``java
Map<Long, Long>

{
   101 -* 3,
   102 -> 1,
   103 -> 3
}
```*
*--

# Step 5

### Build Feed DTO

*ost101

```json
{
  "*ostId": 101,
  "content": "Hello W*rld",
  "*ommentsCount": 3
}
```

*--

Post102*
```json
{
  "postId": 102,
  "con*ent": "Spring Boot",
  "commentsCo*nt": 1
}
```

---

Post103

```jso*
{
  "postId": 103,
  "content": "*ostgreSQL",
  "commentsCount": 3
}*```

---

# Step 6

### Final Feed*Response

```json
{
  "content": [*    {
      "postId": 101,
      "*ommentsCount": 3
    },
    {
    * "postId": 102,
      "commentsCou*t": 1
    },
    {
      "postId":*103,
      "commentsCount": 3
    *
  ]
}
```

---

# Frontend Render*ng

---

Post101

```json
{
  "com*entsCount": 3
}
```

Show:

```tex*
💬 View all 3 comments
```

*--

Post102

*``json
{
  "commentsCount": 1
}
``*

Show:

```text
💬 View 1 comment*```

---

# Why Actual Comments Ar* Not Loaded

Imagine:

```text
Fee* Size = 20 Posts

Post101 = 5000 C*mments

Post102 = 2000*Comments

*ost103 = 8000 Comments
```

Loadin* all comments means:

```text
1500*+ comment records
```

for one fee* request.

Not acceptable.

---

#*User Clicks View Comments

Fronten*:

```http
GET /api/v1/posts/101/c*mments?page=0&size=10
```

Now com*ents are loaded separately.

---

* Comment Retrieval Flow

---

## S*ep 1

Frontend Requests Comments

*``http
GET /api/v1/posts/101/comme*ts?page=0&size=10
```

---

## Ste* 2

Backend Query

```sql
SELECT **FROM comments
WHERE post_id = 101
*RDER BY created_at ASC
LIMIT 10 OF*SET 0;
```

---

Result

```text
1*Nice Post
2 Great Work
3 Amazing
`*`

---

# Step 3

Build Response

*``json
{
  "content": [
    {
    * "commentId": 1,
      "userId": 1*
      "content": "Nice Post"
    *,
    {
      "commentId": 2,
    * "userId": 2,
      "content": "Gr*at Work"
    },
    {
      "comme*tId": 3,
      "userId": 3,
      *content": "Amazing"
    }
  ],
  "*age": 0,
  "size": 10,
  "totalEle*ents": 3
}
```

---

# Add Comment*Flow

---

Current Count

```text
*ost101 = 3 comments
```

---

Fron*end

```http
POST /api/v1/posts/10*/comments
```

Body

```json
{
  "*ontent": "Very Helpful"
}
```

---*
Backend Inserts

```sql
INSERT IN*O comments
(
   post_id,
   user_i*,
   content
)
VALUES
(
   101,
  *5,
   'Very Helpful'
);
```

---

*omments Table

```text
1 Nice Post*2 Great Work
3 Amazing
4 Very Help*ul
```

---

Count Becomes

```*ext
4
```

---

Response

*``json
{
  "commentId": 4,
  "cont*nt": "Very Helpful",
  "commentsCo*nt": 4
}
```

---

Frontend Update*

```text
💬 View all 4 comments
`*`

---

# Delete Comment Flow

---*
Frontend

```http
DELETE /api/v1/*omments/4
```

---

Backend

```sq*
DELETE
FROM comments
WHERE id*= 4;
```

---

New Count

```text*3
*``

---

Response

```json
{
  "*ostId": 101,
  "commentsCount": 3
*
```

*--

# Nested Comments (Replies)

D*tabase

```text
id   post_id   par*nt_comment_id
--------------------*-----------
1    101       null
2 *  101       null
3    101       1
*    101       1
*``

Meaning:

```text
Comment 1
 ├*─ Reply 3* └── Reply 4

Comment 2
``*

---

* Feed Should Still Return

```json*{
  "*ommentsCount": 4
}
```

*ot the entire comment tree.

---

* Dedicated Endpoint Returns Tree

*``http
GET /posts/101/comments
```*
Response:

```json
[
  {
    "com*entId": 1,
    "content": "Nice",
*   "replies": [
      {
        "c*mmentId": 3,
        "content": "T*anks"
      },
      {
        "co*mentId": 4,
        "content": "Ag*ee"
      }
    ]
  }
]
```

---

* N+1 Query Problem

❌ Wrong

For E*ery Post:

```java
countComments(p*stId);
```

20 Posts:

```text
20 *ueries
```

---

✅ Correct

```sql*SELECT
    post_id,
    COUNT(*)
F*OM comments
WHERE post_id IN (...)*GROUP BY post_id;
```

Only:

```t*xt
1 Query
```

for entire feed.

*--

# Final Architecture Flow

```*ext
User Opens Feed
        ↓
Load*Posts
        ↓
Extract Post IDs
 *      ↓
Batch Fetch Comment Counts*        ↓
Build Feed DTO
        ↓*Return Feed
        ↓
Show "View X*Comments"
        ↓
User Clicks Co*ments
        ↓
Dedicated Comment *PI Called
        ↓
Comments Loade*
        ↓
User Adds / Deletes Com*ent
        ↓
Comment Table Update*
        ↓
Comment Count Updated
 *      ↓
UI Updated
```

---

# Fin*l Rule

Feed API:

```json
{
  "commentsCount": 500
}
```

Dedicated API:

```http
GET /posts/{id}/comments
```

Never:

```json
{
  "comments": [...]
}
```

inside feed responses.

Counts belong in primary APIs.

Actual records belong in dedicated paginated APIs.