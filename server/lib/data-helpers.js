"use strict";

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

    likeTweet: async(_id) => {
      try {
        await db
          .collection('tweets')
          .update(
            { '_id': _id},
            { $inc: { likes: '1' }},
          );
        console.log('liked tweet from id', _id);
        const tweet = await db
          .collection('tweets')
          .find({ '_id': _id });
        console.log(`liked ${tweet.user.name}'s tweet`)
      } catch(err) {
        console.log('ERROR: ', err);
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

          console.log(`get ${getNum}`, tweets.length)
        callback(null, tweets.sort(sortNewestFirst));
      });
    }
  };
}
