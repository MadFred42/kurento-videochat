const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const roomModel = require("../models/roomModel");

class UserController {
    async registration (username, password, socket, io) {
        try {
            const sockets = await io.fetchSockets();

            if (sockets.length > 4) {
                return 'Sorry, room is full';
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const newUser = await userModel.create({ username, password: hashPassword, socketId: socket.id });
            const room = await roomModel.findOne({});
            room.users.push(newUser);
            room.save();

            return await newUser.toDto();
        } catch (e) {
            console.log(e);
        }
    };

    async deleteUser (socketId) {
        try {
            await userModel.deleteOne({ socketId });
            const room = await roomModel.findOne({});
            const userIndex = room.users.findIndex(user => user.socketId === socketId);
            room.users.splice(userIndex, 1);
            room.save();
        } catch (e) {
            console.log(e);
        }
    };
};

module.exports = new UserController();