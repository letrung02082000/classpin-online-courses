const express = require('express');
const router = express.Router();
const controller = require('../controllers/verify.controller');

router.get('/', controller.verifyEmail);


module.exports = router;