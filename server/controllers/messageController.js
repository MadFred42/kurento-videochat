const messageModel = require("../models/messageModel");
const roomModel = require("../models/roomModel");

class MessageController {
    async sendMessage(socket, io) {
        try {
            socket.on('message', async (message, callback) => {
                const newMessage = await messageModel.create({ text: message.message })
                const room = await roomModel.findOne({});
                room.messages.push(newMessage);
                room.save();

                return callback(room.messages);
            });
        } catch (e) {
            console.log(e);
        }
    };

    async getMessages(socket) {
        try {
            socket.on('message:get', async (callback) => {
                const room = await roomModel.findOne({});

                return callback(room.messages);
            });
        } catch (e) {
            console.log(e);
        }
    }
};

module.exports = new MessageController();