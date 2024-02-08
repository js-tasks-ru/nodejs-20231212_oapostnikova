const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const orderedProduct = await Product.findOne({_id: ctx.request.body.product});

  const newOrder = await Order.create({
    user: ctx.user,
    product: orderedProduct,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
  });

  sendMail({
    template: 'order-confirmation',
    locals: {
      id: newOrder.id,
      product: orderedProduct,
    },
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
  });

  ctx.body = {
    order: newOrder.id,
  };

  return next();
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user.id})
      .limit(100)
      .populate('product')
      .populate('user');

  ctx.body = {orders: orders.map(mapOrder)};

  return next();
};
