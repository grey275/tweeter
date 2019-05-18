"use strict";
const { ObjectId } = require('mongodb');

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`

let getNum = 1;
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: async (newTweet, callback) => {
      simulateDelay(async () => {
        await db
          .collection('tweets')
          .insertOne(newTweet);
        callback(null, true);
      });
    },

    likeTweet: async _id => {
      try {
        await db
          .collection('tweets')
          .update({ '_id': ObjectId(_id )},
                  { $inc: { likes: 1 } });

        const tweet = await db
          .collection('tweets')
          .findOne({ _id: ObjectId(_id) })



        return [null, tweet.likes];
      } catch(err) {
        return [err];
      }
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: (callback) => {
      simulateDelay(async () => {
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        const tweets = await db
          .collection('tweets')
          .find()
          .toArray();

        callback(null, tweets.sort(sortNewestFirst));
      });
    }
  };
}
