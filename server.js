"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const urlExists = require("url-exists");

// Express.js server
const app = express();

// Enable CORS
app.use(cors());

// Connect to Mongo database and setup schema
mongoose.connect(process.env.MONGO_URI);

const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url_id: String,
  short_url_full: String
});
const ShortURL = mongoose.model("ShortURL", urlSchema);

// Mount body-parser for parsing POST bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Default landing page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// API endpoint
app.post("/api/shorturl/new", (req, res) => {
  urlExists(req.body.url, function(err, exists) {
    if (!exists || err) {
      res.json({ error: "invalid URL" });
    } else {
      res.json({ no_error: "valid URL" });
    }
  });
});

// Listen for requests
var listener = app.listen(process.env.PORT, () => {
  console.log("Listening on port " + listener.address().port);
});
