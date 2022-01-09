const http = require('http');
require('./database/database');

const { router } = require('./routers/routers');

const HOSTNAME = '127.0.0.1';
const PORT = 3001;

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json, text/plain; charset=utf-8;');
  res.setHeader('Access-Control-Max-Age', '-1');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD, OPTIONS');

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  const bodyBuffer = [];
  req.on('data', (data) => {
    bodyBuffer.push(data);
  });

  req.on('end', async () => {
    const body = bodyBuffer.length ? JSON.parse(bodyBuffer) : null;
    await router({ req, res, body });
  });

  res.on('error', (err) => {
    console.error(err);
    res.statusCode = 500;
    res.end(JSON.stringify(err));
  });
});

server.listen(PORT, () => {
   console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
