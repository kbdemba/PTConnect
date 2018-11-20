var express = require('express');
var router = express.Router();

/* GET post listing. */
router.get('/', (req, res, next) => {
  res.send('post');
});

/* GET new post. */
router.get('/new', (req, res, next) => {
  res.send('new post');
});

/* create a post. */
router.post('/', (req, res, next) => {
  res.send('creat post');
});

/* show post. */
router.get('/:id', (req, res, next) => {
  res.send('show a post');
});

/* edit post. */
router.get('/:id/edit', (req, res, next) => {
  res.send('edit a post');
});

/* update a post. */
router.put('/:id', (req, res, next) => {
  res.send('update a post');
});

/* destroy a post. */
router.delete('/:id', (req, res, next) => {
  res.send('delete a post');
});

module.exports = router;
