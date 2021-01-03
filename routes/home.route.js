const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');


router.get('/', homeController.home);

router.get('/videotest', homeController.videoTest);

module.exports = router;
