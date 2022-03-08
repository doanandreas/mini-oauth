const express = require("express");
const logger = require("morgan");

const { dummyEndpoint, getOauthToken, getResources } = require("./api");

const app = express();

// Middleware for logging
app.use(logger("dev"));

// Middleware for parsing request body
// with Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Routes for OAuth API
app.get("/", dummyEndpoint);
app.post("/oauth/token", getOauthToken);
app.post("/oauth/resource", getResources);

// Run app
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
