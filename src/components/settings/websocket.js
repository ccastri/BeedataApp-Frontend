require('dotenv').config();

const socket = new WebSocket(`ws://${process.env.WEBSOCKET_SERVER}`);

socket.addEventListener('open', function (event) {
  console.log('WebSocket connection established');
});

socket.addEventListener('message', function (event) {
  console.log('Received message:', event.data);
});

socket.addEventListener('close', function (event) {
  console.log('WebSocket connection closed');
});

socket.addEventListener('error', function (event) {
  console.error('WebSocket error:', event);
});

module.exports = socket;