const { Schema, model } = require('mongoose');

const RoomSchema = new Schema({
    users: { type: [], validate: [arrayLimit] },
    messages: { type: Array } 
});

function arrayLimit(arr) {
    return arr.length <= 4;
};

module.exports = model('Room', RoomSchema);