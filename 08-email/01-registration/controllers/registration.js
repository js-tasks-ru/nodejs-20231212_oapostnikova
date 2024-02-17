const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const newUser = await User.create({
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
    verificationToken: uuid(),
  });
  await newUser.setPassword(ctx.request.body.password);
  await newUser.save();

  sendMail({
    template: 'confirmation',
    locals: {token: 'token'},
    to: newUser.email,
    subject: 'Подтвердите почту',
  });

  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const token = ctx.request.body.verificationToken;
  const verifiedUser = await User.findOne({verificationToken: token});

  if (!verifiedUser) ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');

  verifiedUser.set({verificationToken: undefined});
  await verifiedUser.save();

  ctx.body = {token: token};
};
