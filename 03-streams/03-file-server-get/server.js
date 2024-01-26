const http = require('http');
const fs = require('fs');

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

  console.log(fileName);

  if (!re.test(fileName)) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  switch (req.method) {
    case 'GET':
      const file = fs.createReadStream(PUBLIC_DIR + fileName);
      file.pipe(res);
      file.on('error', (err) => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }

        console.error(`Error ${err.code} ${err.message}`);
        res.statusCode = 500;
        res.end('Internal error');
      });
      res.on('close', () => {
        file.destroy();
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
