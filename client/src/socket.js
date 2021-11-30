import { io } from 'socket.io-client';

const socket = io(process.env.SERVER_URL, { transports: ["websocket"] });

socket.on('connection', () => {
    console.log(socket.id);
  });

export default socket;