const db = require("../../db/connection");

const fetchArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles where article_id = $1;", [articleId])
    .then((response) => {
      console.log("Query article", response.rows);
      return response.rows[0];
    });
};

module.exports = fetchArticleById;
