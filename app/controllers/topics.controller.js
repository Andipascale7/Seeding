const articles = require("../../db/data/test-data/articles");
const endpoints = require("../../endpoints.json");
const fetchTopics = require("../models/topics.models");

exports.getNews = (req, res) => {
  res.status(200).send({ endpoints: endpoints });
};

exports.getAllTopics = (req, res) => {
  
  fetchTopics()
    .then((topics) => {
      console.log("topics fetched", topics);
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.error("Error fetching topics", err);
      res.status(500).send({ msg: "Server Error" });
    });
};
