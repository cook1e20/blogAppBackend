const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const auth = require('../auth');

const router = express.Router();
const User = mongoose.model('User');

router.post('/users', (req, res, next) => {
  const user = new User();
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);
  user.save().then(() => res.json({ user: user.toAuthJSON() })).catch(next);
});

router.post('/users/login', (req, res, next) => {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "cant't be blank." } });
  }
  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "cant't be blank." } });
  }
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) { return next(err); }

    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    }
    return res.status(422).json(info);
  })(req, res, next);
});

router.get('/user', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.sendStatus(401); }
    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
});

router.put('/user', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.sendStatus(401); }
    if (req.body.user.username) {
      user.username = req.body.user.username;
    }
    if (req.body.user.email) {
      user.email = req.body.user.email;
    }

    if (req.body.user.bio) {
      user.bio = req.body.user.bio;
    }
    if (req.body.user.image) {
      user.image = req.body.user.image;
    }
    if (req.body.user.password) {
      user.setPassword(req.body.user.password);
    }
    return user.save().then(() => res.json({ user: user.toAuthJSON() }));
  }).catch(next);
});

router.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].messsage;
        return errors;
      }),
    });
  }
  return next(err);
});

module.exports = router;
