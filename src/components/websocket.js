import { io } from 'socket.io-client';

const socket = io("http://localhost:3001");

socket.on('connect', () => {
  console.log('WebSocket connection established');
});

socket.on('message', (data) => {
  console.log('Received message:', data);
});

socket.on('disconnect', () => {
  console.log('WebSocket connection closed');
});

socket.on('error', (error) => {
  console.error('WebSocket error:', error);
});

export default socket;
