const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, { message: 'This user is not registerd' });
          }

          await bcrypt.compare(password, user.password, (err, matched) => {
            if (err) {
              console.log(err.message);
              return res.send(err.message);
            }
            if (matched) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'password not matched' });
            }
          });
        } catch (error) {
          console.log(error.message);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
