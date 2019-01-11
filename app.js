const http = require('http');
const fs = require('fs');
const os = require('os');

const notes = require('./notes.js');

console.log(notes.slowFib(6));
const user = os.userInfo();

fs.appendFile('test.txt', `Hello ${user.username}`, err => {
  if (err) {
    console.log(err);
  }
});

const hostname = '127.0.0.1';
const port = 3001;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello Wodsradwld\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
