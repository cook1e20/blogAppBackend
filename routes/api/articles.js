const mongoose = require('mongoose');
const express = require('express');
const auth = require('../auth');

const router = express.Router();
const User = mongoose.model('User');
const Article = mongoose.model('Article');

router.post('/', auth.required, (req, res, next) => {
  console.log(req.payload.id);
  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.sendStaus(401); }

    const article = new Article(req.body.article);
    article.author = user;
    return article.save().then(() => res.json({ article: article.toJSONFor(user) }));
  }).catch(next);
});

router.param('article', (req, res, next, slug) => {
  Article.findOne({ slug })
    .populate('author')
    .then((article) => {
      if (!article) {
        return res.sendStatus(404);
      }
      req.article = article;

      return next();
    }).catch(next);
});

router.get('/:article', auth.optional, (req, res, next) => {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.article.populate('author').execPopulate()]).then((results) => {
    const user = results[0];
    return res.json({ article: req.article.toJSONFor(user) });
  }).catch(next);
});

router.put('/:article', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then((user) => {
    if (req.article.author.id.toString() === req.payload.id.toString()) {
      if (req.body.article.title) {
        req.article.title = req.body.article.title;
      }
      if (req.body.article.description) {
        req.article.description = req.body.article.description;
      }
      if (req.body.article.body) {
        req.article.body = req.body.article.body;
      }

      return req.article.save().then(() => res.json({ article: req.article.toJSONFor(user) }));
    }
    return res.sendStatus(403);
  }).catch(next);
});

router.delete(':/article', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then(() => {
    if (req.article.authod.id.toString() === req.payload.id.toString()) {
      req.article.remove().then(() => res.sendStatus(204));
    } else {
      return res.sendStatus(403);
    }
  }).catch(next);
});

module.exports = router;
