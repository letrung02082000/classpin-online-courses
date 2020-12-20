const express = require('express');
//const controller = require('../controllers/course.controller');



const router = express.Router();

router.get('/', controller.allCategory);
router.get('/:id', controller.category);

module.exports = router;