const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const auth = require('./auth');


const User = mongoose.model('User');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/users', (req, res, next) => {
  const user = new User();
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);
  user.save().then(() => res.json({ user: user.toAuthJSON(user) })).catch(next);
});

router.post('/users/login', (req, res, next) => {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "cant't be blank." } });
  }
  if (!req.body.user.password) {
    return res.status(422).json({ errors: { email: "cant't be blank." } });
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
    if (typeof req.body.user.username !== 'undefinded') {
      user.username = req.body.user.username;
    }
    if (typeof req.body.user.email !== 'undefinded') {
      user.email = req.body.user.email;
    }
    if (typeof req.body.user.bio !== 'undefinded') {
      user.bio = req.body.user.bio;
    }
    if (typeof req.body.user.image !== 'undefinded') {
      user.image = req.body.user.image;
    }
    if (typeof req.body.user.password !== 'undefinded') {
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
