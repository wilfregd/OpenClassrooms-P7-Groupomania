const express = require('express');
const router = express.Router();

const controller = require('../controllers/post');

//Middlewares
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.get('/getallposts/:id?', auth(), controller.getAllPost);
router.get('/getpost', auth(), controller.getPost);
router.post('/createpost', auth(), multer("post"), controller.createPost);
router.post('/removepostimage', auth(), multer("post"), controller.removePostImage);
router.put('/updatepost', auth(), multer("post"), controller.updatePost);
router.delete('/deletepost/:id', auth(), controller.deletePost);

router.get('/getcomment', auth(), controller.getComment);
router.post('/createcomment', auth(), controller.createComment);
router.put('/updatecomment', auth(), controller.updateComment);
router.delete('/deletecomment/:id', auth(), controller.deleteComment);

module.exports = router;