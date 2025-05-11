const { removeCommentById } = require("../models/comments.models");

exports.deleteCommentById = (req, res) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then((comment) => {
      if (!comment) {
        return res.status(404).send({ msg: "Comment not found" });
      }
      res.status(204).send();
    })
    .catch((err) => {
      if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" });
      } else {
        console.error("Error finding comment", err);
        res.status(500).send({ msg: "Server Error" });
      }
    });
};
