"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets(async (err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(await tweets);
      }
    });
  });

  // this route technically works, but does nothing on the client side.
  // It increments the counter for the tweet ID you passed through to the body.
  tweetsRoutes.post("/like", async (req, res) => {
    const { _id } = req.body;
    if (!id) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const [err, numOfLikes] = await DataHelpers.likeTweet(_id);
  });

  // posts new tweets to the database
  tweetsRoutes.post("/new", async (req, res) => {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      likes: 0,
    };

    await DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  return tweetsRoutes;

}
