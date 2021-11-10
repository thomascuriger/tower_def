const ClientWebSocket = require('./Communications/ClientWebSocket');
const PORT_WS = 8000;
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: PORT_WS});

const DateTime = require('./DateTime/DateTime').DateTime;

server.on("connection", function(socket) {
  // Create and register client web socket
  var clientWebSocket = new ClientWebSocket(socket);
  socket.onmessage = function(event) {
    console.log("Data received: " + event.data);
    clientWebSocket.receive(event.data)
  }
  socket.onclose = function(event) {
    clientWebSocket.dispose();
    console.log(clientWebSocket.getPlayerName() + "(" + clientWebSocket.getPlayerIdentifier() + ") closed connection");
  }
});


console.clear();
console.log("Tower Defense");
console.log("Server");
console.log("Version: 00:00:00 / FFHS HS2021/22 / Martin Bartolomé & Thomas Curiger");
console.log("----------------------------------------------------------------------------------------------------------------");
console.log("Boot time: " + new DateTime().toTimestampLongString());

console.log("WebSocket server is running.");
console.log("Listening to port " + PORT_WS + ".");
