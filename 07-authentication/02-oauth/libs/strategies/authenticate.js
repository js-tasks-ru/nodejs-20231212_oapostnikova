const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  let authorizedUser = await User.findOne({email: email});
  if (!authorizedUser) {
    try {
      authorizedUser = await User.create({
        email: email,
        displayName: displayName,
      });
    } catch (err) {
      done(err);
      return;
    }
  }

  done(null, authorizedUser);
};
