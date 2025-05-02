const fetchArticleById = require("../models/articles.models");

// exports.getArticleById = (req, res) => {
//   fetchArticleById(req.params.article_id)
//     .then((article) => {
//       console.log("article fetched", article);
//       res.status(200).send({ article });
//     })
//     .catch((err) => {
//       console.error("Error fetching article", err);
//       res.status(500).send({ msg: "Server Error" });
//     });
// };


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
