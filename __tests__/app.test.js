const endpointsJson = require("../endpoints.json");

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((responseObject) => {
        const body = responseObject.body;
        const endpoints = body.endpoints;
        expect(endpoints).toEqual(endpointsJson);
      });
    // .then(({ body: { endpoints } }) => {
    //   expect(endpoints).toEqual(endpointsJson);
    // });
    //^^^^^^^^^^^^^^^^^left code for referance
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with array of topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((responseObject) => {
        const topics = responseObject.body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((singleTopic) => {
          expect(typeof singleTopic.slug).toBe("string");
          expect(typeof singleTopic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object matching the given ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toBeInstanceOf(Object);
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });

  test("400: responds with 'Bad request' when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("ERROR HANDLING: invalid paths", () => {
  test("404: responds with 'Route not found' for an invalid path", () => {
    return request(app)
      .get("/api/not-a-real-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

test("404: responds with 'Article not found' when article does not exist", () => {
  return request(app)
    .get("/api/articles/9999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found");
    });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects sorted by date descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
          expect(article).not.toHaveProperty("body");
        });

        const sorted = [...articles].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        expect(articles).toEqual(sorted);
      });
  });

  test("400: responds with 'Bad request' when invalid query triggers a 22P02 error", () => {
    return request(app)
      .get("/api/articles/invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for a valid article_id, sorted by most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(Array.isArray(comments)).toBe(true);

        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
            })
          );
        });

        for (let i = 1; i < comments.length; i++) {
          const prev = new Date(comments[i - 1].created_at);
          const curr = new Date(comments[i].created_at);
          expect(prev >= curr).toBe(true);
        }
      });
  });

  test("400: responds with 'Bad request' when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: responds with 'Comments not found' when no comments exist for article_id", () => {
    return request(app)
      .get("/api/articles/9789/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comments not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with the posted comment when given valid username and body", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "This is a test comment",
            author: "butter_bridge",
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });

  test("400: responds with 'Bad request' when article_id is not a number", () => {
    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send({ username: "butter_bridge", body: "Some comment" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: responds with 'Comments not found' when the article does not exist", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({ username: "butter_bridge", body: "Some comment" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comments not added");
      });
  });

  test("400: responds with 'Bad request: body must contain only 'username' and 'body' as strings' when body is missing from request", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: body must contain only 'username' and 'body' as strings"
        );
      });
  });

  test("400: responds with 'Bad request: body must contain only 'username' and 'body' as strings' when username is missing from request", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ body: "Missing username here" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: body must contain only 'username' and 'body' as strings"
        );
      });
  });

  test("400: responds with 'Bad request: body must contain only 'username' and 'body' as strings' when both username and body are missing", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: body must contain only 'username' and 'body' as strings"
        );
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: increments votes when passed a valid inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
  });

  test("200: decrements votes when passed a negative inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toEqual(expect.any(Number));
      });
  });

  test("400: responds with error for missing inc_votes field", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: body must contain only 'inc_votes' as a number"
        );
      });
  });

  test("400: responds with error for extra fields in the body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1, extra: "invalid" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: body must contain only 'inc_votes' as a number"
        );
      });
  });

  test("400: responds with error when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "ten" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: body must contain only 'inc_votes' as a number"
        );
      });
  });

  test("404: responds with error if article_id doesn't exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("400: responds with error for invalid article_id type", () => {
    return request(app)
      .patch("/api/articles/not-a-number")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: responds with no content when comment is successfully deleted", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("404: responds with 'Comment not found' for a non-existent comment", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });

  test("400: responds with 'Bad request' for invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
