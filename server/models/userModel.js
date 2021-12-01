const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: {type: String, unique: true, required:true},
    password: {type: String, required: true},
    socketId: {type: String, required:true}
});

UserSchema.methods.toDto = function toDto() {
    return {
        username: this.username,
        id: this.id,
        socketId: this.socketId
    };
};

module.exports = model('User', UserSchema);