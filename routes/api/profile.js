const mongoose = require('mongoose');
const express = require('express');
const auth = require('../auth');

const router = express.Router();
const User = mongoose.model('User');

router.param('username', (req, res, next, username) => {
  User.findOne({ username }).then((user) => {
    if (!user) { return res.sendStatus(404); }

    req.profile = user;
    return next();
  }).catch(next);
});

router.get('/:username', auth.optional, (req, res, next) => {
  if (req.payload) {
    console.log('trigger');
    User.findById(req.payload.id).then((user) => {
      if (!user) { return res.json({ profile: req.profile.toProfileJSONFor(false) }); }
      return res.json({ profile: req.profile.toProfileJSONFor(user) });
    }).catch(next);
  } else {
    return res.json({ profile: req.profile.toProfileJSONFor(false) });
  }
});

module.exports = router;
