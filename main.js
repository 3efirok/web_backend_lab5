const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { program } = require('commander');

program
  .helpOption('--help', 'display help')
  .option('-h, --host <host>', 'server host')
  .option('-p, --port <port>', 'server port')
  .option('-c, --cache <path>', 'cache directory path')
  .parse(process.argv);

const options = program.opts();

if (!options.host || !options.port || !options.cache) {
  console.error('Please specify required arguments');
  process.exit(1);
}

if (!fs.existsSync(options.cache)) {
  fs.mkdirSync(options.cache, { recursive: true });
}

console.log(`Host: ${options.host}`);
console.log(`Port: ${options.port}`);
console.log(`Cache directory: ${options.cache}`);

const host = options.host;
const port = Number(options.port);
const cacheDir = options.cache;

function getStatusCodeFromUrl(url) {
  return url.replace(/^\/+/, '').split('/')[0] || '';
}

function getCacheFilePath(code) {
  return path.join(cacheDir, `${code}.jpg`);
}

function isValidCode(code) {
  return /^\d+$/.test(code);
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
  res.end(text);
}

function sendImage(res, imageBuffer, statusCode = 200) {
  res.writeHead(statusCode, { 'Content-Type': 'image/jpeg' });
  res.end(imageBuffer);
}

const server = http.createServer(async (req, res) => {
  const code = getStatusCodeFromUrl(req.url);

  if (!code || !isValidCode(code)) {
    sendText(res, 400, 'Bad Request');
    return;
  }

  if (req.method !== 'GET') {
    sendText(res, 405, 'Method Not Allowed');
    return;
  }

  const filePath = getCacheFilePath(code);

  try {
    const image = await fs.promises.readFile(filePath);
    sendImage(res, image, 200);
  } catch (err) {
    if (err.code === 'ENOENT') {
      sendText(res, 404, 'Not Found');
      return;
    }
    sendText(res, 500, 'Internal Server Error');
  }
});

server.listen(port, host, () => {
  console.log(`Server started at http://${host}:${port}`);
});
