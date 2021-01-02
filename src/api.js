const express = require("express");
const serverless = require("serverless-http");
const Parser = require("rss-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

let app = express();
const router = express.Router();
app.use(cors());
app.use(bodyParser.json());

router.post("/rssfeeds", (req, res) => {
  if (req.body.feeds) {
    const FEED_LIST = req.body.feeds;
    //res.json(req.body);

    let parser = new Parser();

    const feedRequests = FEED_LIST.map((feed) => {
      return parser.parseURL(feed);
    });

    Promise.all(feedRequests)
      .then((response) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        // res.setHeader('Access-Control-Allow-Origin', 'some-domain-to-allow.com');
        res.header("Access-Control-Allow-Methods", "POST");
        res.json(response);
      })
      .catch((error) => {
        console.log(error);
        res.status(400);
        res.send({ message: error });
      });
  } else {
    res.send("No feed urls found");
  }
});

app.use(`/.netlify/functions/api`, router);
module.exports = app;
module.exports.handler = serverless(app);
