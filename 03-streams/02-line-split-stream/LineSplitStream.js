const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    const rows = (this.buffer + chunk.toString()).split(os.EOL);
    rows.forEach((row, index) => {
      if (index + 1 === rows.length) {
        this.buffer = row;
        return;
      }


      this.emit('data', row);
    });
    callback(null);
  }

  _flush(callback) {
    this.emit('data', this.buffer);
    callback(null);
  }
}

module.exports = LineSplitStream;
