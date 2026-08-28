# Semantic Post Search - Full Beginner Flow (One-File Guide)

This file explains the complete implementation of AI-powered semantic post search in this project.

Goal:

- User can type a query like: mountain sunrise
- System can find posts about related meaning (nature dawn, early hike, golden hour), not only exact words.

---

## 1) What Was Implemented

We implemented semantic search across:

- Frontend (`client`) - Explore page UI + API call
- Backend (`post-service`) - semantic ranking endpoint for posts
- AI Backend (`ai-service`) - query expansion endpoint

New API added:

- `GET /api/v1/posts/search/semantic?q=<query>&page=1&limit=12`

Internal AI API used by post-service:

- `GET /api/v1/ai/misc/semantic-query?query=<query>`

---

## 2) Why This Design (Architecture and Principles)

We followed existing project architecture and service boundaries:

1. `client` only talks to public APIs through gateway.
2. `post-service` owns post retrieval and ranking logic.
3. `ai-service` owns AI intelligence (prompting and semantic term expansion).
4. `post-service` calls `ai-service` through Feign client (`AiServiceClient`).

Why this is good:

- Separation of concerns: UI, domain logic, AI logic are separated.
- Reusability: same semantic expansion can be used by other services later.
- Fault tolerance: fallback exists if AI service fails.
- Extensibility: can swap ranking algorithm later without breaking frontend.

---

## 3) End-to-End Request Flow

### Step A - User types query on Explore page

- Example: `mountain sunrise`
- Frontend hook debounces input (500ms), so it does not spam API.

### Step B - Frontend calls semantic search endpoint

- `client` calls:
  - `GET /api/v1/posts/search/semantic?q=mountain%20sunrise&page=1&limit=12`

### Step C - Post-service receives request

- Controller method in `PostController` handles `/search/semantic`.
- Delegates to `PostService.semanticSearchPosts(...)`.

### Step D - Post-service asks ai-service for semantic expansion

- Feign call:
  - `GET /api/v1/ai/misc/semantic-query?query=mountain sunrise`
- AI returns normalized and related terms.

Example AI output:

```json
{
  "normalizedQuery": "mountain sunrise",
  "terms": ["mountain", "sunrise", "dawn", "nature", "hiking", "golden hour"]
}
```

### Step E - Post-service creates term set

- Combines:
  - original query tokens
  - normalized tokens
  - AI expanded terms
- Removes duplicates and normalizes case.

### Step F - Candidate post retrieval

- Pulls a candidate page from global feed (excluding blocked users, existing rule).
- Candidate window currently uses recent posts for fast response.

### Step G - Semantic scoring in post-service

Each candidate post gets a score by checking semantic terms in:

- tags (highest weight)
- caption
- thoughts
- location
- author name

Why weighted scoring:

- Tags and captions usually represent post meaning strongest.
- Location/author are weaker semantic signals.

### Step H - Sort + paginate + hydrate

- Filter out score 0 posts.
- Sort by score descending, then recency.
- Paginate by requested page/limit.
- Hydrate post response with likes/comments/saved flags using existing optimized methods.

### Step I - Response sent to frontend

Response includes:

- `posts`
- `currentPage`, `totalPages`, `hasMore`
- `semanticTerms` (useful for UI transparency)

### Step J - Explore UI renders semantic results

- Shows small term chips (`semanticTerms`) and matching posts grid.
- User search dropdown for people still works in parallel.

---

## 4) Frontend Changes (What and Why)

### Files changed

- `client/src/lib/utils/global-query-keys.js`
  - Added semantic query key for caching.

- `client/src/shared/api/shared-api.js`
  - Added `getSemanticPosts(query, page, limit)`.

- `client/src/features/explore/hooks/useSemanticPosts.js` (new)
  - Debounced semantic search query hook.
  - Uses React Query for caching/loading/error flow.

- `client/src/features/explore/pages/Explore.jsx`
  - Calls semantic hook.
  - Renders semantic terms and `PostGrid` results.

Why this is correct:

- Keeps data fetching logic inside hooks.
- Keeps page component mostly presentational.
- Reuses existing shared post grid component (no duplicate UI logic).

---

## 5) Post-Service Changes (What and Why)

### Files changed

- `post-service/src/main/java/com/sphere/post/controller/PostController.java`
  - Added endpoint: `GET /search/semantic`.

- `post-service/src/main/java/com/sphere/post/service/PostService.java`
  - Added `semanticSearchPosts(...)`.
  - Added helper methods:
    - `buildSemanticTerms(...)`
    - `tokenize(...)`
    - `normalizeToken(...)`
    - `scorePost(...)`
  - Added fallback-safe logging if AI expansion fails.

- `post-service/src/main/java/com/sphere/post/client/AiServiceClient.java`
  - Added Feign method for semantic query expansion.

- `post-service/src/main/java/com/sphere/post/client/AiServiceClientFallbackFactory.java`
  - Added semantic expansion fallback map.

Why this is correct:

- API contract remains clean and paginated.
- Service owns ranking logic (domain responsibility).
- Reuses current hydration pipeline for consistent `PostResponse` shape.

---

## 6) AI-Service Changes (What and Why)

### Files changed

- `ai-service/src/main/java/com/sphere/ai/ai/prompt/PromptService.java`
  - Added semantic query expansion prompt.

- `ai-service/src/main/java/com/sphere/ai/controller/MiscAiController.java`
  - Added endpoint `GET /semantic-query`.
  - Calls `aiProvider.generate(...)`.
  - Parses strict JSON output from model.
  - Sanitizes terms.
  - Returns safe fallback terms if model output is invalid.

Why this is correct:

- AI prompt logic stays centralized in `PromptService`.
- Controller remains lightweight orchestration.
- Fault-tolerant parsing prevents runtime failures from malformed model output.

---

## 7) Fallback and Reliability Strategy

Failure cases covered:

1. AI service unavailable

- Feign fallback in post-service returns safe defaults.
- Search still works using original query tokens.

2. AI returns malformed JSON

- ai-service catches parse error and returns tokenized fallback.

3. Empty/blank query

- Returns empty result quickly.

4. Partial text quality

- Sanitization removes symbols/noise.

This ensures feature is usable even when AI quality/dependency fluctuates.

---

## 8) Ranking Logic (Current Version)

Current ranking is weighted lexical matching over AI-expanded terms.

Example weights:

- tag match: +6
- caption match: +5
- thought match: +4
- location match: +3
- author match: +2

This creates practical semantic behavior without introducing vector DB yet.

Why not embeddings now:

- Faster integration into your current architecture.
- No infrastructure change required.
- Easy to test and tune.

---

## 9) How to Test Quickly

1. Start services (gateway + ai-service + post-service + client).
2. Open Explore page.
3. Search with meaning phrase: `mountain sunrise`.
4. Verify results include semantically related posts.
5. Check semantic chips displayed above grid.

API-level check:

- Call `GET /api/v1/posts/search/semantic?q=mountain sunrise&page=1&limit=12`.

---

## 10) What “Working Fine” Means Here

- Frontend builds successfully.
- `post-service` compiles successfully.
- `ai-service` compiles successfully.
- Endpoint contract is stable and paginated.
- UI displays semantic posts and semantic terms.
- Fallbacks avoid hard failures.

---

## 11) Future Upgrade Path (Production-Level Semantic Search)

When you are ready to go beyond this v1:

1. Add embeddings for posts (caption + tags + thoughts).
2. Store vectors in pgvector / OpenSearch / Pinecone.
3. Use cosine similarity for true semantic nearest-neighbor retrieval.
4. Keep current weighted lexical score as hybrid reranker.
5. Add click-based learning to improve relevance over time.

This gives stronger meaning-based retrieval at scale.

---

## 12) Summary for Beginners

Think of this implementation as two-stage search:

1. AI understands what user means and gives related keywords.
2. Post-service finds and ranks posts using those terms.

So user intent is translated first, then matching happens with ranking.

That is why `mountain sunrise` can match `nature dawn` style posts.
