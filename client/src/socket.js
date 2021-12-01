import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000/';

const socket = io(SOCKET_URL, { transports: ["websocket"] });

socket.on('connection', () => {
    console.log(socket.id);
  });

export default socket;