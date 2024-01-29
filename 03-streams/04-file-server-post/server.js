const http = require('http');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const re = new RegExp('^/[\\w\.-]+$');
const PUBLIC_DIR = __dirname + '/files';

const server = new http.Server();

server.on('request', (req, res) => {
  let fileName;

  try {
    fileName = decodeURIComponent(req.url);
  } catch (err) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  if (!re.test(fileName)) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  switch (req.method) {
    case 'POST':
      const file = fs.createWriteStream(PUBLIC_DIR + fileName, {flags: 'wx'});
      const limiter = new LimitSizeStream({limit: 1000000});

      req.pipe(limiter).pipe(file);

      file.on('finish', () => {
        res.statusCode = 201;
        res.end();
      });

      limiter.on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('File size limit exceeded');
          req.destroy();
          file.destroy();
          return;
        }

        console.error(err);
        res.statusCode = 500;
        res.end('Internal error');
      });
      file.on('error', (err) => {
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('Conflict');
          return;
        }

        console.error(err);
        res.statusCode = 500;
        res.end('Internal error');
      });

      res.on('close', () => {
        file.destroy();

        if (!req.readableEnded) {
          fs.unlink(PUBLIC_DIR + fileName, (err) => {
            if (err && err.code !== 'ENOENT') console.error(err);
          });
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
