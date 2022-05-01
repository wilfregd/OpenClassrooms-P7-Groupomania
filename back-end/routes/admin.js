const express = require('express');
const router = express.Router();

const controller = require('../controllers/admin');
const auth = require('../middlewares/auth');

router.post('/ban', auth(true), controller.banUser);
router.post('/unban', auth(true), controller.unbanUser);

module.exports = router;