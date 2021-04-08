const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
var jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    });
    const data = await newUser.save();
    res.json(data);
  } catch (error) {
    res.send({ message: error });
  }
});

router.post('/login', async (req, res, next) => {
  try {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send('email or password incorect');
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        jwt.sign({ user: user }, 'secretkey', (err, token) => {
          req.isAuthenticated = token;
          return res.send(token);
        });
      });
    })(req, res, next);
  } catch (error) {
    res.send(error.message);
  }
});

router.get('/user', async (req, res) => {
  try {
    const result = await User.find();
    res.json(result);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
