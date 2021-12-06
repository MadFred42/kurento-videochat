import ACTIONS from "../helpers/socketActions";
import videoService from "../services/videoService";

export const publish = async (io, socket, data, callback) => {
    const { offer, callId } = data;
    const response = await videoService.publish(socket, { offer, callId }); 
    
    io.emit(ACTIONS.VIDEOCHAT_STATE, { videos: socket.to().getVideoState() });
    
    if (callback) callback(response);
};