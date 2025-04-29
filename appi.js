const express = require("express");
const app = express();
const db = require("./db/connection");
const exportedObject = require("./app/controllers/topics.controllers"); //
const getNews = exportedObject.getNews;
// const {getNews} = require("./app/controllers/topics.controllers"); l6= l4&l5
app.use(express.json());


app.get("/api", getNews);

module.exports = app;
