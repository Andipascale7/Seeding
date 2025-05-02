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

  // test("500: responds with 'Server Error' when article_id is not a number", () => {
  //   return request(app)
  //     .get("/api/articles/not-a-number")
  //     .expect(500)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("Server Error");

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
