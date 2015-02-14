var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<b>Sam sucks</b>\n');
}).listen(80, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
