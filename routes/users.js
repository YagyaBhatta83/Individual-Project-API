const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const router = express.Router();

router.post("/users/signup", (req, res, next) => {
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

router.post('/users/login', (req, res, next) => {
  User.findOne({ username: req.body.username })
      .then((user) => {
        // console.log(user.username);
          if (user == null) {
              let err = new Error('username not found!');
              err.status = 401;
              return next(err);
          } 
          else{
              bcrypt.compare(req.body.password, user.password)
              .then((isMatch) => {
                  // console.log(req.body.password);
                  //   console.log(user.password);
                  if (!isMatch) {
                      let err = new Error('Password does not match!');
                      err.status = 401;
                      return next(err);
                  }
                  let token = jwt.sign({ _id: user._id }, process.env.SECRET);
                  res.json({ status: 'Login success!', token: token });
              }).catch(next);

          }
      }).catch(next);
  })

module.exports = router;
