"use strict";

// Basic express setup:
const express       = require("express");
const bodyParser    = require("body-parser");
const favicon  = require('serve-favicon');
const path = require('path');

const { PORT } = require('./config');

const app = express();

app.use(favicon('public/images/bird.png'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

(async () => {
  const db = await require("./lib/load-mongo");
  const DataHelpers = require('./lib/data-helpers')(db);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  app.use("/tweets", tweetsRoutes);
  app.listen(PORT, () => {
    console.log("Tweeter listening on port " + PORT);
  });
})();