const { MongoClient } = require("mongodb");
const { MONGODB_URI } = require('./config');

const loadDB = (uri, client) => {
  try {
    return client.connect(uri);
  } catch(err) {
    console.log('ERROR: ', err);
  }
}

module.exports = loadDB(MONGODB_URI, MongoClient);