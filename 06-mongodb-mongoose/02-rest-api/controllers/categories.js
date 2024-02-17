const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

const MAX_ITEMS_PER_REQUEST = 100;

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find().limit(MAX_ITEMS_PER_REQUEST);

  ctx.body = {categories: categories.map(mapCategory)};
};
