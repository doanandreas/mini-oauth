const {
  getAccessToken,
  getRefreshToken,
  TOKEN_EXPIRE_MS,
  authenticate,
  isBearerToken,
  isAccessTokenAuthorized,
  constants,
} = require("./utils");

const dummyEndpoint = (req, res) => {
  res.send("hi mom");
};

const getOauthToken = async (req, res) => {
  const authStatus = authenticate(req.body);

  authStatus ? getTokenAuthorized(req, res) : getTokenUnathorized(req, res);
};

const getTokenAuthorized = async (req, res) => {
  const accessToken = await getAccessToken(req.body.username);
  const refreshToken = await getRefreshToken(req.body.username);

  res.json({
    access_token: accessToken,
    expires_in: TOKEN_EXPIRE_MS,
    token_type: "Bearer",
    scope: null,
    refresh_token: refreshToken,
  });
};

const getTokenUnathorized = async (req, res) => {
  res.status(401).json({
    error: "invalid_request",
    desc: "Incorrect username or password :)",
  });
};

const getResources = (req, res) => {
  isBearerToken(req.headers.authorization)
    ? getResourcesValidToken(req, res)
    : getResourcesUnauthorized(req, res);
};

const getResourcesValidToken = async (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  const isAuthorized = await isAccessTokenAuthorized(accessToken);

  isAuthorized
    ? getResourcesAuthorized(req, res)
    : getResourcesUnauthorized(req, res);
};

const getResourcesAuthorized = async (req, res) => {
  const accessToken = await getAccessToken(constants.USERNAME);
  const refreshToken = await getRefreshToken(constants.USERNAME);

  res.json({
    access_token: accessToken,
    client_id: constants.CLIENT_ID,
    user_id: constants.USERNAME,
    full_name: constants.NAME,
    npm: constants.NPM,
    expires: null,
    refresh_token: refreshToken,
  });
};

const getResourcesUnauthorized = (req, res) => {
  res.status(401).json({
    error: "invalid_request",
    desc: "Access token is invalid :(",
  });
};

module.exports = {
  dummyEndpoint,
  getOauthToken,
  getResources,
};
