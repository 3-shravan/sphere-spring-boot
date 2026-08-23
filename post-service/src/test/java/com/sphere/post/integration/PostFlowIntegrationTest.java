// package com.sphere.post.integration;

// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// import java.security.Key;
// import java.util.Date;

// import org.junit.jupiter.api.Test;
// import org.mockito.Mockito;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.http.MediaType;
// import org.springframework.test.context.DynamicPropertyRegistry;
// import org.springframework.test.context.DynamicPropertySource;
// import org.springframework.test.web.servlet.MockMvc;
// import org.testcontainers.containers.PostgreSQLContainer;
// import org.testcontainers.junit.jupiter.Container;
// import org.testcontainers.junit.jupiter.Testcontainers;

// import com.sphere.post.client.AuthorSummary;
// import com.sphere.post.client.UserServiceClient;

// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.security.Keys;

// /**
//  * End-to-end thought-post creation + public single-post fetch, through the
//  * real controller layer and a real Postgres/Flyway-migrated schema.
//  * UserServiceClient (Feign) is mocked since no live user-service runs in
//  * this test — this test therefore does NOT cover the real Feign wire
//  * contract, only post-service's own logic assuming a working client. A
//  * true cross-service contract test (e.g. Spring Cloud Contract, or a
//  * docker-compose-based test running both services) is a good next step,
//  * not yet built.
//  */
// @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
// @AutoConfigureMockMvc
// @Testcontainers
// class PostFlowIntegrationTest {

//     private static final String JWT_SECRET = "integration-test-secret-integration-test-secret";

//     @Container
//     static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
//             .withDatabaseName("sphere_posts_test")
//             .withUsername("test")
//             .withPassword("test");

//     @DynamicPropertySource
//     static void configure(DynamicPropertyRegistry registry) {
//         registry.add("spring.datasource.url", postgres::getJdbcUrl);
//         registry.add("spring.datasource.username", postgres::getUsername);
//         registry.add("spring.datasource.password", postgres::getPassword);
//         registry.add("sphere.jwt.secret", () -> JWT_SECRET);
//         registry.add("sphere.internal.api-key", () -> "integration-test-internal-key");
//         registry.add("eureka.client.enabled", () -> "false");
//     }

//     @Autowired
//     private MockMvc mockMvc;

//     @MockBean
//     private UserServiceClient userServiceClient;

//     @Test
//     void createThoughtPost_thenFetchPublicly_succeeds() throws Exception {
//         Long authorId = 42L;
//         Mockito.when(userServiceClient.getAuthorSummary(authorId))
//                 .thenReturn(new AuthorSummary(authorId, "itestuser", "https://example.com/pic.jpg"));

//         String token = signTestToken(authorId);

//         String body = """
//                 {"thoughts":"Integration-test thought"}
//                 """;

//         String response = mockMvc.perform(post("/api/v1/posts/thought")
//                         .header("Authorization", "Bearer " + token)
//                         .contentType(MediaType.APPLICATION_JSON)
//                         .content(body))
//                 .andExpect(status().isCreated())
//                 .andExpect(jsonPath("$.post.author.name").value("itestuser"))
//                 .andExpect(jsonPath("$.post.thoughts").value("Integration-test thought"))
//                 .andReturn().getResponse().getContentAsString();

//         Number postIdNumber = com.jayway.jsonpath.JsonPath.read(response, "$.post.id");
//         Long postId = postIdNumber.longValue();

//         // Public fetch — no Authorization header at all.
//         mockMvc.perform(get("/api/v1/posts/" + postId))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.post.thoughts").value("Integration-test thought"));
//     }

//     private String signTestToken(Long userId) {
//         Key key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes());
//         return Jwts.builder()
//                 .claim("id", userId)
//                 .issuedAt(new Date())
//                 .expiration(new Date(System.currentTimeMillis() + 3_600_000))
//                 .signWith(key)
//                 .compact();
//     }
// }
