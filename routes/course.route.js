const express = require('express');
const controller = require('../controllers/course.controller');


const router = express.Router();

router.get('/:id', controller.course);


module.exports = router;