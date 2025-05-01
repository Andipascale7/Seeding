const fetchArticleById = require("../models/articles.models");

exports.getArticleById = (req, res) => {
  fetchArticleById(req.params.article_id)
    .then((article) => {
      console.log("article fetched", article);
      res.status(200).send({ article });
    })
    .catch((err) => {
      console.error("Error fetching article", err);
      res.status(500).send({ msg: "Server Error" });
    });
};
