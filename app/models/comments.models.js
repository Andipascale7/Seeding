const db = require("../../db/connection");

const removeCommentById = (commentId) => {
  return db
    .query("delete FROM comments where comment_id = $1 returning *;", [
      commentId,
    ])
    .then((response) => {
      return response.rows[0];
    });
};

module.exports = {
  removeCommentById,
};
