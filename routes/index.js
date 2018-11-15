const express = require('express');


const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.use('/', require('./api/user'));
router.use('/profiles', require('./api/profile'));
router.use('/articles', require('./api/articles'));


module.exports = router;
