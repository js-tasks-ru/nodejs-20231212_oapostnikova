const http = require('http');
const fs = require('fs');

const re = new RegExp('^/[\\w\.-]+$');
const PUBLIC_DIR = __dirname + '/files';

const server = new http.Server();

server.on('request', (req, res) => {
  let fileName;

  try {
    fileName = decodeURIComponent(req.url);
  } catch (e) {
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
    case 'DELETE':
      fs.unlink(PUBLIC_DIR + fileName, (err) => {
        if (!err) {
          res.statusCode = 200;
          res.end();
          return;
        }

        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('Bad request');

          return;
        }

        console.error(`Error ${e.code} ${e.message}`);

        res.statusCode = 500;
        res.end('Internal error');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
