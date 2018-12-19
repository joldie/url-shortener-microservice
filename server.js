"use strict";

require("dotenv").config();

// Express.js server
const express = require("express");
const app = express();

// Enable CORS
const cors = require("cors");
app.use(cors());

// Default landing page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// API endpoint
app.get("/api/shorturl", (req, res) => {
  res.json({
    original_url: 0,
    short_url: 0
  });
});

// Listen for requests
var listener = app.listen(process.env.PORT, () => {
  console.log("Listening on port " + listener.address().port);
});
