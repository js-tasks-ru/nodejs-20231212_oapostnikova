const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;
    if (!token) {
      next(new Error('anonymous sessions are not allowed'));
    }

    const userSession = await Session.findOne({token: token}).populate('user');
    if (!userSession) {
      next(new Error('wrong or expired session token'));
    }

    socket.user = userSession.user;
    next();
  });

  io.on('connection', function(socket, next) {
    socket.on('message', async (msg) => {
      await Message.create({
        user: socket.user.displayName,
        chat: socket.user.id,
        date: new Date(),
        text: msg,
      });
    });
  });

  return io;
}

module.exports = socket;
