export const POSTS_QUERY_KEYS = {
  all: ["posts"],

  // --- FEEDS ---
  feeds: () => [...POSTS_QUERY_KEYS.all, "feeds"],
  feed: (type = "all") => [...POSTS_QUERY_KEYS.feeds(), { type }],

  // --- SAVED POSTS ---
  saved: () => [...POSTS_QUERY_KEYS.all, "saved"],

  // --- PROFILE POSTS ---
  profiles: () => [...POSTS_QUERY_KEYS.all, "profiles"],
  profile: (userId) => [...POSTS_QUERY_KEYS.profiles(), { userId }],

  // --- INDIVIDUAL POST DETAIL ---
  details: () => [...POSTS_QUERY_KEYS.all, "detail"],
  detail: (id) => [...POSTS_QUERY_KEYS.details(), { id }],
}

export const USERS_QUERY_KEY = {
  all: ["users"],
  suggested: () => [...USERS_QUERY_KEY.all, "suggested-users"],
  profile: (username) => [...USERS_QUERY_KEY.all, "profile", { username }],
}

/*
 
 ["posts"]                               ← root (everything post-related)
│
├── ["posts", "feeds"]                  ← all paginated feed lists
│   ├── ["posts", "feeds", {type:"all"}]        ← /posts?page=...
│   └── ["posts", "feeds", {type:"following"}]  ← /posts/following?page=...
│
├── ["posts", "saved"]                  ← non-paginated list of saved posts
│
├── ["posts", "profiles"]               ← profile-specific posts
│   ├── ["posts", "profiles", {userId:"123"}]   ← /users/123/posts?page=...
│   └── ["posts", "profiles", {userId:"456"}]   ← /users/456/posts?page=...
│
└── ["posts", "detail"]                 ← individual post
    └── ["posts", "detail", {id:"abc"}]         ← /posts/abc

 
 */
