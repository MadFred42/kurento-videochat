require ('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').Server(app);
const useSocket = require('socket.io');
const io = useSocket(server);
const cors = require('cors');
const mongoose = require('mongoose');
const userController = require('./controllers/userController');
const roomController = require('./controllers/roomController');
const messageController = require('./controllers/messageController');
const ACTIONS = require('./helpers/socketActions');
const publish = require('./controllers/videoController');
const view = require('./controllers/videoController');
const videoService = require('./services/videoService');
const Room = require('./services/room');

app.use(express.json());
app.use(cors( { 
    credentials: true,
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
 } ));

io.on(ACTIONS.CONNECT, (socket) => {
   console.log(`A user connected ${socket.id}`);
   socket.join('room');
   
   socket.on(ACTIONS.JOIN, async (data, callback) => {
      const res = await userController.registration(data.username, data.password, socket, io);
      return callback(res);
   });

   socket.on(ACTIONS.LOCAL_STREAM, data => {
      console.log(data)
      socket.room = new Room(data);
   });

   socket.on(ACTIONS.OFFER_PUBLISH, async (data, callback) => {
      const res = await publish(io, socket, data, callback);

      return callback(res);
   });
   
   socket.on(ACTIONS.OFFER_VIEW, async (data, callback) => {
      const res = await view(io, socket, data, callback);
      return callback(res);
   });

   socket.on(ACTIONS.ICE_CANDIDATE, async (data, callback) => {
      const res = await videoService.iceCandidate({ candidate: data.candidate, callId: data.callId });
   });

   roomController.createRoom(socket, io);
   messageController.sendMessage(socket, io);
   messageController.getMessages(socket);

   socket.on(ACTIONS.DISCONNECT, async () => {
      console.log(`user ${socket.id} disconnected`);

      await userController.deleteUser(socket.id);
   })
});

const PORT = process.env.PORT || 5000;

const start = async () => {
   try {
      mongoose.connect(process.env.DB_URL);
      server.listen(PORT, () => console.log(`Server started on ${PORT} port`));
   } catch (e) {
      console.log(e)
   }
};

start();