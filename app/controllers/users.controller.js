const fetchAllUsers = require("../models/users.models");

exports.getAllUsers = (req, res) => {
  fetchAllUsers()
    .then((users) => {
      console.log("users fetched", users);
      res.status(200).send({ users });
    })
    .catch((err) => {
      console.error("Error fetching users", err);
      res.status(500).send({ msg: "Server Error" });
    });
};
