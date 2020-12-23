const mongoose = require('mongoose');

const { findById } = require('./course.model');

const paginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const schema = new Schema({
    _id: mongoose.ObjectId,
    sub_category: Array, // id cac category con
    name: String,
    description: String,
});

schema.plugin(paginate);

const Category = mongoose.model('Category', schema, 'Category');

module.exports = {
    async loadAllCategories() {
        return await Category.find({});
    },

    findById(categoryId) {
        return Category.findById(categoryId).lean();
    },
    async selectFromOneId(id) {
        return await Category.findById(id);
    },
    async loadAll() {
        return await Category.find().lean().populate('sub_category');
    },
    async loadTopCategory() {
        return await Category.find({ sub_category: { $gt: [] } })
            .lean()
            .populate('sub_category');
    },
};
