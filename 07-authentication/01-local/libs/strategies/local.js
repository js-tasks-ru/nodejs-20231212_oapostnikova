const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      const authorizedUser = await User.findOne({email: email});

      if (!authorizedUser) {
        done(null, false, 'Нет такого пользователя');
        return;
      }

      if (!await authorizedUser.checkPassword(password)) {
        done(null, false, 'Неверный пароль');
        return;
      }

      done(null, authorizedUser);
    },
);
