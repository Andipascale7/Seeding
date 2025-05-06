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

const fetchArticleComments = (articleId) => {
  return db
    .query(
      ` SELECT 
      comments.comment_id,
      comments.votes,
      comments.created_at,
      comments.author,
      comments.body,
      articles.article_id
    FROM comments
    JOIN articles ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    ORDER BY comments.created_at DESC;
  `,
      [articleId]
    )
    .then((response) => {
      console.log("Query comments", response.rows);
      return response.rows;
    });
};

const postComments = (articleId, username, body) => {
  return db
    .query(
      `INSERT INTO comments (body, votes, author, created_at)
SELECT $2, 0, $3, NOW()
FROM articles
WHERE articles.article_id = $1
RETURNING *;

  `,
      [articleId, body, username]
    )
    .then((response) => {
      console.log("New comment added", response.rows);
      return response.rows[0];
    });
};

module.exports = {
  fetchArticleById,
  fetchAllArticles,
  fetchArticleComments,
  postComments,
};
