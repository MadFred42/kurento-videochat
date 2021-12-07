import socket from "../socket";
import { ACTIONS } from "../helpers/socketActions";
import WebRtcController from "../kurento/webRtcController";

socket.on(ACTIONS.VIDEOCHAT_ICE, async (data) => {
    console.log(data)
    await WebRtcController.addIceCandidate({ candidate: data.candidate, callId: data.callId });
});