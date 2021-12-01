const roomModel = require('../models/roomModel');

class RoomController {
    async createRoom(req, res) {
        try {
            const room = await roomModel.findOne({});
            if (room) {
                return res.json(room);
            }
    
            const newRoom = await roomModel.create({});
    
            return res.json(newRoom);  
        } catch (e) {
            console.log(e);
        }
    };
};

module.exports = new RoomController();