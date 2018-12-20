"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const urlExists = require("url-exists");
const shortid = require("shortid");

// Save site URL
const projectUrl = "http://localhost:8080";

// Express.js server, with CORS enabled
const app = express();
app.use(cors());

// Mount body-parser for parsing POST bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to Mongo database
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
);

// Setup database schema
const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url_id: String,
  short_url_full: String
});
const ShortURL = mongoose.model("ShortURL", urlSchema);

// Default landing page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// API endpoint - POST new URL to shorten
app.post("/api/shorturl/new", (req, res) => {
  urlExists(req.body.url, function(err, exists) {
    if (err) return res.send(err);
    if (!exists) {
      res.json({ error: "invalid URL" });
    } else {
      ShortURL.findOne({ original_url: req.body.url }, (err, data) => {
        if (err) return res.send(err);
        if (data) {
          res.json({
            original_url: data.original_url,
            short_url_id: data.short_url_id,
            short_url_full: data.short_url_full
          });
        } else {
          const short_url = shortid.generate();
          const newURL = new ShortURL({
            original_url: req.body.url,
            short_url_id: short_url,
            short_url_full: projectUrl + "/api/shorturl/" + short_url
          })
            .save()
            .then(data =>
              res.json({
                original_url: data.original_url,
                short_url_id: data.short_url_id,
                short_url_full: data.short_url_full
              })
            )
            .catch(err => res.send(err));
        }
      });
    }
  });
});

// API endpoint - GET original URL from shortened one
app.get("/api/shorturl/:shorturl", (req, res) => {
  if (req.params.shorturl === "new") {
    res.redirect(projectUrl);
  } else {
    ShortURL.findOne({ short_url_id: req.params.shorturl }, (err, data) => {
      if (err) return res.send(err);
      if (data) {
        res.redirect(data.original_url);
      } else {
        res.json({ error: "URL not found in database" });
      }
    });
  }
});

// Listen for requests
var listener = app.listen(process.env.PORT, () => {
  console.log("Listening on port " + listener.address().port);
});
