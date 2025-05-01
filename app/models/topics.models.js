const endpoints = require("../../endpoints.json");
const db = require("../../db/connection");
const Test = require("supertest/lib/test");

exports.selectNews = () => {
  return endpoints;
};

const fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((response) => {
    console.log("Query topics", response.rows);
    return response.rows;
  });
};


module.exports = fetchTopics;
