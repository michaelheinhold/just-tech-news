const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
  console.log(req.session);
  Post.findAll({
    attributes: ['id', 'post_url', 'title', 'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    order: [['created_at', 'DESC']],
    include: [
        {
            model: User,
            attributes: ['username']
        },
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User, 
                attributes: ['username']
            }
        }
    ]
  }).then(dbPostData => {
    const posts = dbPostData.map(post => post.get({ plain: true }));
    res.render('homepage', { posts });
  }).catch(err => res.status(500).json(err));
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.get('/create_account', (req, res) => {
  res.render('create_account');
})

module.exports = router;