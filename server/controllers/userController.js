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

            return await newUser.toDto();
        } catch (e) {
            console.log(e);
        }
    };

    async deleteUser (socketId) {
        try {
            const user = await userModel.deleteOne({ socketId });
        } catch (e) {
            console.log(e);
        }
    };
};

module.exports = new UserController();