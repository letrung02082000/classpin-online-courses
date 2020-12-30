const express = require('express');
const controller = require('../controllers/admin.controller');
const router = express.Router();


router.get('/category', controller.showCategory);
router.get('/category/AddTopCategory', controller.addTopCategory);
router.get('/category/AddSubCategory', controller.addSubCategory);
router.post('/category/AddTopCategory', controller.postAddTopCategory);
router.post('/category/AddSubCategory', controller.postAddSubCategory);
router.post('/category/delete', controller.deleteCategory);

module.exports = router;