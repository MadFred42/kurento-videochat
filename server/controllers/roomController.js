const roomModel = require('../models/roomModel');

class RoomController {
    async createRoom(socket, io) {
        try {
            socket.on('createroom', async (callback) => {
                const room = await roomModel.findOne({});

                if (room) {
                    return res.json(room);
                }
        
                const newRoom = await roomModel.create({});

                return callback(newRoom);
            });
        } catch (e) {
            console.log(e);
        }
    };
};

module.exports = new RoomController();