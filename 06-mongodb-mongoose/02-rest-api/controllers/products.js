const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({subcategory: subcategory}).populate('category');

  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find().populate('category');

  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  if (!ctx.params.id || !mongoose.isValidObjectId(ctx.params.id)) {
    ctx.throw(400, 'product not found');
  }

  const product = await Product.findById(ctx.params.id).populate('category');
  if (!product) {
    ctx.throw(404, 'product not found');
  }

  ctx.body = {product: mapProduct(product)};
};
