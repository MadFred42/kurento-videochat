const ACTIONS = require ("../helpers/socketActions");
const roomModel = require("../models/roomModel");
const Room = require("../services/room");
const videoService = require("../services/videoService");

exports.publish = async function(io, socket, data) {
    const { offer, callId, type } = data;
    const response = await videoService.publish(socket, { offer, callId }); 
    socket.room = {
        getVideoState: async () => {
            const all = await io.fetchSockets();
            return all.map(user => user.user);
        }
    }
    io.emit(ACTIONS.VIDEOCHAT_STATE, { videos: await socket.room.getVideoState() });
    
    return response;
};

exports.view = async function(io, socket, data) {
    const { offer, callId, publishCallId } = data;
    const response = await videoService.view(socket, { offer, callId, publishCallId }); 

    return response
};