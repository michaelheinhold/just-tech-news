const router = require('express').Router();
const { Comment } = require('../../models');

router.get('/', (req, res) => {
  Comment.findAll()
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => res.status(500).json(err));
});

router.post('/', (req, res) => {
  if(req.session) {
    Comment.create({
      comment_text: req.body.comment_text,
      //use id from session
      user_id: req.session.user_id,
      post_id: req.body.post_id
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => res.status(500).json(err));
  }
});

router.delete('/:id', (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbCommentData => {
      if(!dbCommentData) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }
      res.json(dbCommentData)
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;