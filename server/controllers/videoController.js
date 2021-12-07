const ACTIONS = require ("../helpers/socketActions");
const videoService = require("../services/videoService");

const publish = async (io, socket, data) => {
    const { offer, callId } = data;
    const response = await videoService.publish(socket, { offer, callId }); 
    // io.emit(ACTIONS.VIDEOCHAT_STATE, { videos: socket.to().getVideoState() });
    
    return response;
};

module.exports = publish;