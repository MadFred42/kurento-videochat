const ACTIONS = require ("../helpers/socketActions");
const videoService = require("../services/videoService");

const publish = async (io, socket, data, callback) => {
    const { offer, callId } = data;
    const response = await videoService.publish(socket, { offer, callId }); 
    // io.emit(ACTIONS.VIDEOCHAT_STATE, { videos: socket.to().getVideoState() });
    
    if (callback) callback(response);
};

module.exports = publish;