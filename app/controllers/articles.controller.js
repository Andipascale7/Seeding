const {
  fetchArticleById,
  fetchAllArticles,
  fetchArticleComments,
} = require("../models/articles.models");

exports.getArticleById = (req, res) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: "Article not found" });
      }
      res.status(200).send({ article });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" });
      } else {
        console.error("Error fetching article", err);
        res.status(500).send({ msg: "Server Error" });
      }
    });
};

exports.getAllArticles = (req, res) => {
  fetchAllArticles()
    .then((articles) => {
      console.log("articles fetched", articles);
      res.status(200).send({ articles });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" });
      } else {
        console.error("Error fetching article", err);
        res.status(500).send({ msg: "Server Error" });
      }
    });
};

exports.getCommentsForArticle = (req, res) => {
  const { article_id } = req.params;

  fetchArticleComments(article_id)
    .then((comments) => {
      if (comments.length === 0) {
        return res.status(404).send({ msg: "Comments not found" });
      }
      res.status(200).send({ comments });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" });
      } else {
        console.error("Error fetching comments", err);
        res.status(500).send({ msg: "Server Error" });
      }
    });
};
