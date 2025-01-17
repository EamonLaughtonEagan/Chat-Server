/*
(c) 2018 Louis D. Nel
Example for simple web socket chat server.

This sample demonstrates how to implement a basic chat application in Node.js
using "raw" web sockets provided by npm ws module.

To run this app first execute
npm install
to install npm modules listed in package.json file

Use several browser instances to visit http://localhost:3000/chatClient.html
and have them chat with each other
*/

const http = require('http') //need to http
const fs = require('fs') //need to read static files
const url = require('url') //to parse url strings
const WebSocketServer = require('ws').Server //npm module ws

const ROOT_DIR = 'html' //dir to serve static files from

const MIME_TYPES = {
  'css': 'text/css',
  'gif': 'image/gif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'application/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'txt': 'text/plain'
}

function get_mime(filename) {
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES['txt']
}

function broadcast(msg) {
  wss.clients.forEach(function(client) {
    client.send(msg)
  })
}

const server = http.createServer(function(request, response) {
  let urlObj = url.parse(request.url, true, false)
  console.log('\n============================')
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
  console.log("METHOD: " + request.method)

  /*
  Notice our server code is now only used to server the
  application's static files
  */

  let filePath = ROOT_DIR + urlObj.pathname
  if (urlObj.pathname === '/') filePath = ROOT_DIR + '/chatClient.html'

  fs.readFile(filePath, function(err, data) {
    if (err) {
      //report error to console
      console.log('ERROR: ' + JSON.stringify(err))
      //respond with not found 404 to client
      response.writeHead(404)
      response.end(JSON.stringify(err))
      return
    }
    response.writeHead(200, {
      'Content-Type': get_mime(filePath)
    })
    response.end(data)
  })
})

//Create web socket server and events to process
const wss = new WebSocketServer({
  server: server
})
wss.on('connection', function(ws) {
  console.log('Client connected')
  ws.on('message', function(msg) {
    console.log('Message: ' + msg)
    broadcast(msg)
  })
})

server.listen(80)

console.log('Server Running at port 3000  CNTL-C to quit')
console.log('To Test:')
console.log('Open several browsers to: http://localhost:3000/chatClient.html')
