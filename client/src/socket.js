import { io } from 'socket.io-client';

const socket = io('http://localhost:5000/', { transports: ["websocket"] });

socket.on('connection', () => {
    console.log(socket.id);
  });

export default socket;