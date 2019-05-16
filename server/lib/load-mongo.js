const { MongoClient } = require("mongodb");
const { MONGODB_URI } = require('./config');

const loadDB = async (uri, client) => {
  const db = await client.connect(uri);
  // console.log('db: ', db);
  return (db
    .collection('tweets')
    .find()
    .toArray()
  );

}

console.log(' here we go! ')
module.exports = loadDB(MONGODB_URI, MongoClient);