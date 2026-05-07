const fs = require('node:fs');
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
