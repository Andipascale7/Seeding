const db = require("../../db/connection");

const fetchArticleById = (articleId) => {
  return db
    .query(
      `SELECT articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.body,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id) ::INT AS comment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
WHERE articles.article_id = $1
GROUP BY articles.article_id;`,
      [articleId]
    )
    .then((response) => {
      console.log("Query article", response.rows);
      return response.rows[0];
    });
};

const fetchAllArticles = (sortBy, order, topic) => {
  const validSortColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const validOrders = ["asc", "desc"];

  order = order.toLowerCase();

  if (!validSortColumns.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
  }

  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  const queryValues = [];
  let queryStr = `
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
  `;

  if (topic) {
    queryValues.push(topic);
    queryStr += `WHERE articles.topic = $1\n`;
  }

  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sortBy} ${order};
  `;

  return db.query(queryStr, queryValues).then((result) => {
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
      `INSERT INTO comments (article_id, body, votes, author, created_at)
SELECT articles.article_id, $2, 0, $3, NOW()
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

const patchArticleById = (articleId, votes) => {
  return db
    .query(
      `UPDATE articles
SET votes = votes + $1
WHERE article_id = $2
RETURNING *;
  `,
      [votes, articleId]
    )
    .then((response) => {
      console.log("Article votes updated", response.rows);
      return response.rows[0];
    });
};

module.exports = {
  fetchArticleById,
  fetchAllArticles,
  fetchArticleComments,
  postComments,
  patchArticleById,
};
