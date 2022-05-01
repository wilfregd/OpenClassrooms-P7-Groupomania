const express = require('express');
const router = express.Router();

const controller = require('../controllers/user');

//Middlewares
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.get('/:id', auth(false), controller.getUser);
router.put('/updateuser', auth(false), multer("user"), controller.updateUserInfo);
router.post('/deleteaccount', auth(false), controller.deleteAccount);

module.exports = router;