const express = require('express');
const router = express.Router();
const {errorHandler} = require("../middleware")
const {getPosts, newPost, createPost, showPost} = require("../controllers/post")

/* GET post listing. */
router.get('/', errorHandler(getPosts));

/* GET new post. */
router.get('/new', newPost);

/* create a post. */
router.post('/', errorHandler(createPost));

/* show post. */
router.get('/:id', errorHandler(showPost));

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
