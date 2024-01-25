const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.transferred = 0;
  }

  _transform(chunk, encoding, callback) {
    this.transferred += this.writableLength;

    if (this.transferred > this.limit) {
      this.emit('error', new LimitExceededError());
      return;
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
