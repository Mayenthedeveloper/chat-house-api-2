const jwt = require("jsonwebtoken");
const config = require("../config/config");

exports.auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token!" });
  }

  jwt.verify(token, config.APP_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ error: err });
    }

    req.user = user;
  });
  next();
};
