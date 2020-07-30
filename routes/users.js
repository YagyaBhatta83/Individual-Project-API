const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  let password = req.body.password;
  bcrypt.hash(password, 10, function(err, hash) {
    if (err) {
      let err = new Error("Could not hash!");
      err.status = 500;
      return next(err);
    }
    User.create({
      fullName: req.body.fullName,
      username: req.body.username,
      password: hash,
      phoneNumber: req.body.phoneNumber,
      location: req.body.location
    })
      .then(user => {
        let token = jwt.sign({ _id: user._id }, process.env.SECRET);
        res.json({ status: "Signup success!", token: token });
      })
      .catch(next);
  });
});

module.exports = router;
