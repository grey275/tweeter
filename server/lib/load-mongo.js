const { MongoClient } = require("mongodb");
const { MONGODB_URI } = require('./config');

const loadDB = (uri, client) => {
  return client.connect(uri);
}

module.exports = loadDB(MONGODB_URI, MongoClient);