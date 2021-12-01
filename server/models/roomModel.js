const { Schema, model } = require('mongoose');

const RoomSchema = new Schema({
    users: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], validate: [arrayLimit] },
    password: { type: String, required: true } 
});

function arrayLimit(arr) {
    return arr.length <= 4;
};

module.exports = model('Room', RoomSchema);