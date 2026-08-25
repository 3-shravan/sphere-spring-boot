# ai-service

Scalable AI platform microservice for the **Sphere** social network.  
Powered by **Spring AI + OpenAI Vision (GPT-4o)**.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Environment Variables](#environment-variables)
4. [Running Locally](#running-locally)
5. [API Reference](#api-reference)
6. [End-to-End Flow](#end-to-end-flow)
7. [Sample Requests & Responses](#sample-requests--responses)
8. [Adding Future AI Features](#adding-future-ai-features)
9. [Spring AI Version Note](#spring-ai-version-note)

---

## Overview

`ai-service` is a **provider-agnostic AI platform service** — not a feature-specific service.  
It is designed so that new AI capabilities (content moderation, OCR, translation, recommendations, …) can be plugged in without modifying existing code.

**Feature #1 — Image Analysis:**

- Short, engaging **caption** generation
- Detailed visual **description** generation
- Relevant **hashtag** generation

All results are **cached** in PostgreSQL (`post_ai_metadata`) to avoid repeated OpenAI calls for the same post image.

---

## Architecture

```
ai-service/
├── AiServiceApplication.java
├── ai/
│   ├── provider/
│   │   ├── AiProvider.java            ← Provider interface (abstraction)
│   │   └── OpenAiProvider.java        ← OpenAI implementation (Spring AI)
│   └── prompt/
│       └── PromptService.java         ← ALL prompts live here (never hardcoded)
├── client/
│   ├── PostServiceClient.java         ← Feign client → post-service internal API
│   └── PostServiceClientFallbackFactory.java
├── config/
│   ├── OpenApiConfig.java             ← Swagger/OpenAPI
│   └── SecurityConfig.java            ← Spring Security (JWT stateless)
├── controller/
│   └── ImageAnalysisController.java   ← REST endpoints
├── dto/
│   ├── request/ImageAnalysisRequest.java
│   └── response/
│       ├── ErrorResponse.java
│       └── ImageAnalysisResponse.java
├── entity/
│   └── PostAiMetadata.java            ← JPA entity (post_ai_metadata table)
├── exception/
│   ├── AiProviderException.java
│   ├── ApiException.java
│   ├── ErrorType.java
│   └── GlobalExceptionHandler.java
├── repository/
│   └── PostAiMetadataRepository.java
├── security/
│   ├── JwtAuthenticationFilter.java
│   └── JwtService.java
├── service/
│   ├── ImageAnalysisService.java      ← Service interface
│   └── impl/
│       └── ImageAnalysisServiceImpl.java
└── util/
    ├── ErrorJsonWriter.java
    └── ResponseUtil.java
```

---

## Environment Variables

| Variable              | Required | Default  | Description                                                 |
| --------------------- | -------- | -------- | ----------------------------------------------------------- |
| `OPENAI_API_KEY`      | **Yes**  | —        | Your OpenAI API key. The service won't start without it.    |
| `DB_URL`              | **Yes**  | —        | JDBC URL, e.g. `jdbc:postgresql://localhost:5432/sphere_ai` |
| `DB_USERNAME`         | **Yes**  | —        | PostgreSQL username                                         |
| `DB_PASSWORD`         | **Yes**  | —        | PostgreSQL password                                         |
| `JWT_SECRET`          | **Yes**  | —        | Must match `user-service`'s `JWT_SECRET`                    |
| `EUREKA_URI`          | **Yes**  | —        | e.g. `http://localhost:8761/eureka/`                        |
| `INTERNAL_API_SECRET` | **Yes**  | —        | Shared internal API key for Feign calls                     |
| `AI_SERVICE_PORT`     | No       | `8084`   | HTTP port                                                   |
| `OPENAI_CHAT_MODEL`   | No       | `gpt-4o` | OpenAI model name                                           |
| `OPENAI_MAX_TOKENS`   | No       | `1024`   | Maximum tokens per response                                 |
| `OPENAI_TEMPERATURE`  | No       | `0.3`    | Model temperature (0.0 = deterministic, 1.0 = creative)     |

---

## Running Locally

### Prerequisites

- Java 21
- PostgreSQL (create a database `sphere_ai`)
- Eureka / discovery-service running

### Step 1 — Create the database

```sql
CREATE DATABASE sphere_ai;
```

### Step 2 — Create `.env` in the project root or `ai-service/`

```properties
OPENAI_API_KEY=sk-...
DB_URL=jdbc:postgresql://localhost:5432/sphere_ai
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-shared-jwt-secret
EUREKA_URI=http://localhost:8761/eureka/
INTERNAL_API_SECRET=your-internal-secret
```

### Step 3 — Run

```bash
cd ai-service
mvn spring-boot:run
```

Swagger UI: http://localhost:8084/swagger-ui.html

---

## API Reference

All endpoints are under `/api/v1/ai/image` and require a valid JWT  
(Bearer token in `Authorization` header or `token` cookie).

| Method   | Path                         | Description                                      |
| -------- | ---------------------------- | ------------------------------------------------ |
| `POST`   | `/api/v1/ai/image/analyze`   | Analyse image → caption + description + hashtags |
| `GET`    | `/api/v1/ai/image/post/{id}` | Retrieve cached AI metadata for a post           |
| `DELETE` | `/api/v1/ai/image/post/{id}` | Delete cached AI metadata for a post             |

---

## End-to-End Flow

```
Browser/Client
    │
    │ POST /api/v1/ai/image/analyze   { postId, imageUrl }
    ▼
API Gateway  (JWT validation + routing)
    │
    ▼
ai-service
    │
    ├─► Repository.findByPostId(postId)
    │       ├── FOUND + forceRegenerate=false  → return cached result ✓
    │       └── NOT FOUND (or forceRegenerate=true)
    │               │
    │               ├─► PromptService.imageCaptionPrompt()
    │               ├─► OpenAiProvider.analyzeImage(imageUrl, captionPrompt)
    │               │       └── Spring AI → OpenAI Vision API (gpt-4o)
    │               │
    │               ├─► PromptService.imageDescriptionPrompt()
    │               ├─► OpenAiProvider.analyzeImage(imageUrl, descriptionPrompt)
    │               │
    │               ├─► PromptService.imageHashtagPrompt()
    │               ├─► OpenAiProvider.analyzeImage(imageUrl, hashtagPrompt)
    │               │
    │               └─► Repository.save(PostAiMetadata)
    │
    └─► Return ImageAnalysisResponse
```

---

## Sample Requests & Responses

### POST `/api/v1/ai/image/analyze`

**Request:**

```json
{
  "postId": 42,
  "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  "forceRegenerate": false
}
```

**Response (fresh generation):**

```json
{
  "success": true,
  "message": "AI metadata generated successfully",
  "aiMetadata": {
    "id": 1,
    "postId": 42,
    "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    "caption": "Golden hour hits different when the mountains are your backdrop ✨",
    "description": "A sweeping landscape photograph capturing a mountain range bathed in warm golden light at sunset, with a clear sky and scattered clouds in the background.",
    "hashtags": [
      "mountains",
      "sunset",
      "goldenhour",
      "landscape",
      "nature",
      "travel",
      "photography",
      "outdoors",
      "scenery",
      "adventure"
    ],
    "aiProvider": "openai",
    "modelVersion": "gpt-4o",
    "cached": false,
    "createdAt": "2026-08-25T10:30:00Z",
    "updatedAt": "2026-08-25T10:30:00Z"
  }
}
```

**Response (from cache):**

```json
{
  "success": true,
  "message": "AI metadata retrieved from cache",
  "aiMetadata": {
    "cached": true,
    ...
  }
}
```

### GET `/api/v1/ai/image/post/42`

**Response:**

```json
{
  "success": true,
  "message": "AI metadata fetched successfully",
  "aiMetadata": { ... }
}
```

### DELETE `/api/v1/ai/image/post/42`

**Response:**

```json
{
  "success": true,
  "message": "AI metadata deleted successfully"
}
```

### Error Response (all endpoints)

```json
{
  "success": false,
  "type": "AiProviderError",
  "message": "OpenAI image analysis failed: Rate limit exceeded",
  "data": null
}
```

---

## Adding Future AI Features

The service is designed for **Open/Closed Principle** compliance.  
To add a new AI feature (e.g. Content Moderation):

1. **Add prompt(s)** to `PromptService` — never touch existing methods.
2. **Add service interface** method to a new `ContentModerationService`.
3. **Add impl** in `service/impl/` using `AiProvider.analyzeImage()` or `AiProvider.generate()`.
4. **Add controller** in `controller/`.
5. **Add entity/repository** if persistence is needed.
6. **Add Flyway migration** in `db/migration/`.

No changes needed to `OpenAiProvider`, `PromptService` (existing methods), or any existing service.

Future AI features already scaffolded in `PromptService`:

- `contentModerationPrompt()`
- `ocrExtractionPrompt()`
- `sentimentAnalysisPrompt(text)`

---

## Spring AI Version Note

This service uses **Spring AI `1.0.0`** (the GA release). If you encounter
dependency resolution issues with Spring Boot 4.x, update the `spring-ai.version`
property in `pom.xml` to the latest Spring AI release that declares compatibility
with Spring Boot 4.x / Spring Framework 7.x:

```xml
<spring-ai.version>X.Y.Z</spring-ai.version>
```

The application code, architecture, and configuration will remain unchanged — only
the BOM version needs updating.
