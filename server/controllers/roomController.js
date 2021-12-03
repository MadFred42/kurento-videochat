const ACTIONS = require('../helpers/socketActions');
const roomModel = require('../models/roomModel');

class RoomController {
    async createRoom(socket, io) {
        try {
            socket.on(ACTIONS.ROOM, async (callback) => {
                const room = await roomModel.findOne({});
                
                if (room) {
                    return callback(room);
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