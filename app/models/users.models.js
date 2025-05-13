const db = require("../../db/connection");

const fetchAllUsers = () => {
  return db.query("SELECT * FROM users;").then((response) => {
    console.log("Query users", response.rows);
    return response.rows;
  });
};

module.exports = fetchAllUsers;
