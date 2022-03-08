const crypto = require("crypto");
const redis = require("redis");

// Access token expiry in milliseconds
// Set to 30 seconds expiry
const TOKEN_EXPIRE_MS = 30000;

// Connection to redis server
const client = redis.createClient({
  host: "redis-server",
  port: 6379,
});

// Dummy user data
const constants = {
  NAME: "Doan Andreas Nathanael",
  NPM: "1806205123",
  USERNAME: "doanandreas",
  PASSWORD: "gantengbanget",
  CLIENT_ID: "root",
  CLIENT_SECRET: "rahasia",
};

// Dummy auth validator
const authenticate = ({
  username,
  password,
  grant_type,
  client_id,
  client_secret,
}) =>
  username === constants.USERNAME &&
  password === constants.PASSWORD &&
  grant_type === "password" &&
  client_id === constants.CLIENT_ID &&
  client_secret === constants.CLIENT_SECRET;

const isBearerToken = (authHeader) => {
  if (authHeader) {
    const type = authHeader.split(" ")[0];
    const token = authHeader.split(" ")[1];

    if (type === "Bearer") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

// Dummy token generator
const getAccessToken = (username) => {
  return new Promise((resolve, reject) => {
    client.get(`${username}_access_token`, (err, accessToken) => {
      let tokenResult = null;

      if (accessToken) {
        tokenResult = accessToken;
      } else {
        const generatedToken = crypto
          .createHash("sha1")
          .update(Math.random().toString())
          .digest("hex");

        client.set(
          `${username}_access_token`,
          generatedToken,
          "PX",
          TOKEN_EXPIRE_MS
        );

        tokenResult = generatedToken;
      }

      resolve(tokenResult);
    });
  });
};

const getRefreshToken = (username) => {
  return new Promise((resolve, _) => {
    client.get(`${username}_refresh_token`, (err, refreshToken) => {
      let tokenResult = null;

      if (refreshToken) {
        tokenResult = refreshToken;
      } else {
        const generatedToken = crypto
          .createHash("sha1")
          .update(Math.random().toString())
          .digest("hex");

        client.set(`${username}_refresh_token`, generatedToken);

        tokenResult = generatedToken;
      }

      resolve(tokenResult);
    });
  });
};

const isAccessTokenAuthorized = (token) => {
  return new Promise((resolve, _) => {
    client.get(`${constants.USERNAME}_access_token`, (err, accessToken) => {
      if (accessToken) {
        resolve(token === accessToken);
      } else {
        resolve(false);
      }
    });
  });
};

module.exports = {
  constants,
  authenticate,
  isBearerToken,
  TOKEN_EXPIRE_MS,
  getAccessToken,
  getRefreshToken,
  isAccessTokenAuthorized,
};
