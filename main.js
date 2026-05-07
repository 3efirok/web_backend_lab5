const fs = require('node:fs');
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

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is running');
});

server.listen(port, host, () => {
  console.log(`Server started at http://${host}:${port}`);
});
