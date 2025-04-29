const endpoints = require("../../endpoints.json")

exports.getNews = (req, res) => {
    
        res.status(200).send({ endpoints:endpoints });
    }
 