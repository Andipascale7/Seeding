const express = require("express");
const app = express();
const db = require("./db/connection");

const exportedTopic = require("./app/controllers/topics.controller");
const exportedArticle = require("./app/controllers/articles.controller");

const getNews = exportedTopic.getNews;

const getAllTopics = exportedTopic.getAllTopics;

const getArticleById = exportedArticle.getArticleById;

const getAllArticles = exportedArticle.getAllArticles;

const getCommentsForArticle = exportedArticle.getCommentsForArticle;

const addCommentForArticle = exportedArticle.addCommentForArticle;

const updateArticleById = exportedArticle.updateArticleById;




app.use(express.json());

app.get("/api", getNews);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsForArticle);

app.post("/api/articles/:article_id/comments", addCommentForArticle);

app.patch("/api/articles/:article_id", updateArticleById);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
