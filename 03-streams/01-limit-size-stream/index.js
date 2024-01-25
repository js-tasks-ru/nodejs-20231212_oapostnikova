const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');
const stream = require('stream');

const limitedStream = new LimitSizeStream({limit: 8, encoding: 'utf-8'}); // 8 байт
const outStream = fs.createWriteStream('out.txt');

limitedStream.pipe(outStream);

limitedStream.write('hello'); // 'hello' - это 5 байт, поэтому эта строчка целиком записана в файл

setTimeout(() => {
  limitedStream.write('world'); // ошибка LimitExceeded! в файле осталось только hello
}, 10);

stream.pipeline(limitedStream, outStream, (err) => {
  if (err) {
    console.error(`Error: ${err.message}`);
  }
});
