const ACTIONS = require ("../helpers/socketActions");
const videoService = require("../services/videoService");

const publish = async (io, socket, data) => {
    const { offer, callId } = data;
    const response = await videoService.publish(socket, { offer, callId }); 
    const res = socket.room.getVideoState();
    console.log(res);
    // io.emit(ACTIONS.VIDEOCHAT_STATE, { videos: socket.room.getVideoState() });
    
    return response;
};

module.exports = view = async (io, socket, data) => {
    const { offer, callId } = data;
    const response = await videoService.publish(socket, { offer, callId }); 
}

module.exports = publish;