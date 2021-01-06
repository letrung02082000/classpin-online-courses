const mongoose = require('mongoose');

const { findById } = require('./course.model');

const paginate = require('mongoose-paginate-v2');
const { getMonday } = require('../utils/getMonday');

const Schema = mongoose.Schema;

const schema = new Schema({
    _id: mongoose.ObjectId,
    sub_category: Array, // id cac category con
    name: String,
    description: String,
    last_count: { type: Date, default: Date.now },
    student_count: { type: Number, default: 0 },
});

schema.plugin(paginate);

const Category = mongoose.model('Category', schema, 'Category');

module.exports = {
    async loadAllCategories() {
        return await Category.find({}).lean();
    },
    async AllCategories() {
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
    addCategory(category) {
        return Category.create(category);
    },
    async addSubCategory(subId, topId) {
        let category = await Category.findById(topId);
        if (!category.sub_category) {
            cetegory.sub_category = [];
        }
        category.sub_category.push(subId);
        return await category.save();
    },
    deleteOneCategory(id) {
        return Category.deleteOne({ _id: id });
    },
    async changeCategory(id, option = {}) {
        let category = await Category.findById(id);
        if (!category) {
            return;
        }
        console.log(option);
        category.name = option.name;
        category.description = option.description;
        return await category.save();
    },
    async changeSubCategory(catId, oldId, newId) {
        let cat = await Category.findById(catId);
        if (!cat) return;
        let oldTopCat = await Category.findById(oldId);
        let newTopCat = await Category.findById(newId);
        let index = oldTopCat.sub_category.indexOf(catId);
        if (index >= 0) {
            oldTopCat.sub_category.splice(index, 1);
            await oldTopCat.save();
        }
        newTopCat.sub_category.push(catId);
        await newTopCat.save();
    },
    async findTopCategory(id) {
        let all = await Category.find({ sub_category: { $gt: [] } });
        for (let i = 0; i < all.length; i++) {
            let index = all[i].sub_category.indexOf(id);
            if (index >= 0) {
                return all[i];
            }
        }
        return;
    },

    async increaseStudentCount(categoryId) {
        const category = await Category.findById(
            mongoose.mongo.ObjectId(categoryId),
            function (err) {
                if (err) throw Error(err);
            }
        );

        category.student_count += 1;
        category.last_count = Date.now();
        category.save();
    },

    async resetLastCount(categoryId) {
        const category = await Category.findById(
            mongoose.mongo.ObjectId(categoryId),
            function (err) {
                if (err) throw Error(err);
            }
        );

        category.student_count = 0;
        category.last_count = Date.now();
        category.save();
    },

    async loadTenWeeklyCategories() {
        const monday = getMonday();
        const now = Date.now();
        return await Category.find({
            last_count: { $gte: monday, $lte: now },
        })
            .sort({ student_count: -1 })
            .limit(10)
            .lean();
    },
};
