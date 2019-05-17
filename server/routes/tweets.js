"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    console.log('get got')
    DataHelpers.getTweets(async (err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(await tweets);
        console.log('tweets!', tweets)
      }
    });
  });

  tweetsRoutes.post("/", async (req, res) => {
    console.log('posted!')
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
