const db = require("../../db/connection");

const fetchArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles where article_id = $1;", [articleId])
    .then((response) => {
      console.log("Query article", response.rows);
      return response.rows[0];
    });
};

const fetchAllArticles = () => {
  const queryStr = `
    SELECT articles.article_id,
           articles.title,
           articles.topic,
           articles.author,
           articles.created_at,
           articles.votes,
           articles.article_img_url,
           COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
  `;

  return db.query(queryStr).then((result) => {
    console.log("Query articles", result.rows);
    return result.rows;
  });
};

module.exports = { fetchArticleById, fetchAllArticles };
