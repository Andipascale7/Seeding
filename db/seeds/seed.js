const db = require("../connection");
const topics = require("../data/development-data/topics");
const format = require("pg-format");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE topics(
          slug VARCHAR PRIMARY KEY, 
          description VARCHAR(100),
          img_url VARCHAR(1000)
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users(
          username VARCHAR PRIMARY KEY, 
          name VARCHAR(100),
          avatar_url VARCHAR(1000)
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE Articles(
          article_id SERIAL PRIMARY KEY, 
          title VARCHAR(100),
          topic VARCHAR(1000) REFERENCES Topics(slug),
          author VARCHAR(100) REFERENCES Users(username),
          body TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INTEGER DEFAULT 0,
          article_img_url VARCHAR(1000)
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments(
          comment_id SERIAL PRIMARY KEY, 
          article_id INTEGER REFERENCES Articles(article_id),
          body TEXT,
          votes INTEGER DEFAULT 0,
          author VARCHAR(100) REFERENCES Users(username),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      `);
    })
    .then(() => {
      //transform array of objects into nested arrays
      const formattedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });
      const insertTopicsQueryString = format(
        `INSERT INTO topics
  (slug, description, img_url)
  VALUES
  %L
  RETURNING *;`,
        formattedTopics
      );
      return db.query(insertTopicsQueryString);
    })
    .then(() => {
      //transform array of objects into nested arrays
      const formattedUsers = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });
      const insertUsersQueryString = format(
        `INSERT INTO users
  (username, name, avatar_url)
  VALUES
  %L
  RETURNING *;`,
        formattedUsers
      );
      return db.query(insertUsersQueryString);
    })
    .then(() => {
      //transform array of objects into nested arrays
      const formattedArticles = articleData.map((article) => {
        const timestamp = new Date(article.created_at);
        return [
          article.title,
          article.topic,
          article.author,
          article.body,
          timestamp,
          article.votes,
          article.article_img_url,
        ];
      });
      const insertArticlesQueryString = format(
        `INSERT INTO articles
  (  title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url)
  VALUES
  %L
  RETURNING *;`,
        formattedArticles
      );
      return db.query(insertArticlesQueryString);
    })
    .then(() => {
      //transform array of objects into nested arrays
      const formattedComments = commentData.map((comment) => {
        const timestamp = new Date(comment.created_at);
        return [
          comment.article_id,
          comment.body,
          comment.votes,
          comment.author,
          timestamp,
        ];
      });
      const insertCommentsQueryString = format(
        `INSERT INTO comments
  (article_id, body, votes, author, created_at)
  VALUES
  %L
  RETURNING *;`,
        formattedComments
      );
      return db.query(insertCommentsQueryString);
    });
};

module.exports = seed;
// seeding check