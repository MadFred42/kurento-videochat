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
const videoService = require('./services/videoService');
const videoController = require('./controllers/videoController');

app.use(express.json());
app.use(cors( { 
    credentials: true,
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
 } ));

io.on(ACTIONS.CONNECT, (socket) => {
   console.log(`A user connected ${socket.id}`);
   socket.join('room');

   socket.room = {
      getVideoState: async () => {
          const all = await io.fetchSockets();
          const res = all.map(socket => socket.user);
          return res
      }
   };

   socket.user = {
      id: socket.id,
      addPublishStream: (stream) => {
         socket.user.streams = [
            ...(socket.user.streams || []),
            { ...stream, type: 'publish', userId: socket.id }
         ];
      },
      addViewStream: (videoStream, publishCallId) => {
         socket.user.streams = [
            ...(socket.user.streams || []),
            { ...videoStream, publishCallId, type: 'view', userId: socket.id }
         ];
      }
   };
   
   socket.on(ACTIONS.JOIN, async (data, callback) => {
      const res = await userController.registration(data.username, data.password, socket, io);
      return callback(res);
   });

   socket.on(ACTIONS.LOCAL_STREAM, data => {
      socket.emit('stream:client', {data});
   });

   socket.on(ACTIONS.OFFER_PUBLISH, async (data, callback) => {
      const res = await videoController.publish(io, socket, data);
      callback(res);
   });
   
   socket.on(ACTIONS.OFFER_VIEW, async (data, callback) => {
      try {
         const res = await videoController.view(io, socket, data);
         return callback(res);
      } catch (e) {
         console.log(e)
      }
   });

   socket.on(ACTIONS.ICE_CANDIDATE, async (data, callback) => {
      const res = await videoService.iceCandidate({ candidate: data.candidate, callId: data.callId });
      
      callback(res);
   });

   roomController.createRoom(socket, io);
   messageController.sendMessage(socket, io);
   messageController.getMessages(socket);

   socket.on(ACTIONS.DISCONNECT, async () => {
      console.log(`user ${socket.id} disconnected`);

      const leavingUser = socket.user;
      
      if (leavingUser.streams) {
         leavingUser.streams.forEach(async stream => await stream.endpoint.release());
      }

      leavingUser.streams = [];

      io.emit(ACTIONS.VIDEOCHAT_STATE, { videos: [leavingUser] });

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
   };
};

start();