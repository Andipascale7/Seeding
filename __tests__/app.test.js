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
