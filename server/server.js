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

app.use(express.json());
app.use(cors( { 
    credentials: true,
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
 } ));

io.on('connection', (socket) => {
   console.log(`A user connected ${socket.id}`);
   socket.join();

   socket.on('registration', async (data, callback) => {
      const res = await userController.registration(data.username, data.password, socket, io);
      return callback(res);
   });

   // socket.on('message', async (message, callback) => {
   //    console.log(message);
   //    const res = await messageController.sendMessage(message);
   // });
   
   roomController.createRoom(socket, io);
   messageController.sendMessage(socket, io);
   messageController.getMessages(socket);

   socket.on('disconnect', async () => {
      console.log('user disconnected');

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