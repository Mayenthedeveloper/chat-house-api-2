const User = require("../models").User;
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const secret = require("crypto").randomBytes(64).toString("hex");
    // find the user
    const user = await User.findOne({
      where: {
        email,
      },
    });

    // check if user found
    if (!user) return res.status(404).json({ message: "User not found!" });

    // check if password matches
    if (!bcrypt.compareSync(password, user.password))
      return res.status(401).json({ message: "Incorrect password!" });

    // generate auth token
    const userWithToken = generateToken(user.get({ raw: true }));
    userWithToken.user.avatar = user.avatar;
    return res.send(userWithToken);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }

  return res.send([email, password]);
};

exports.register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.create(req.body);
    console.log("Checking user");
    console.log(user);
    const userWithToken = generateToken(user.get({ raw: true }));

    return res.send(userWithToken);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const generateToken = (user) => {
  console.log(user);
  delete user.password;

  const token = jwt.sign(user, config.APP_KEY, { expiresIn: 86000 });

  return { ...{ user }, ...{ token } };
};
