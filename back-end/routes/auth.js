const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth');

//Middlewares
const auth = require('../middlewares/auth');

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.get('/isloggedin', controller.isUserLoggedIn);
router.get('/logout', auth(false), controller.logout);

module.exports = router;