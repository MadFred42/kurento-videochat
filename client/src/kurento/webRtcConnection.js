import adapter from 'webrtc-adapter';
import { getConstraints } from './constraints';
import { getUserMedia } from './getUserMedia';
import socket from '../socket';
import { ACTIONS } from '../helpers/socketActions';
import socketEmit from '../helpers/socketEmit';

export default class WebRtcConnection {
    constructor(data) {
        this.callId = data.callId;
        this.type = data.type;
        this.iceServers = data.iceServers;
        this.sdpAnswerSet = false;
        this.onGotOffer = (offer, callId) => socket.emit(ACTIONS.OFFER, { offer, callId }, (callback) => data.getAnswer(callback));
        this.onGotCandidate = (callId, candidate) => socketEmit(ACTIONS.ICE_CANDIDATE, { callId, candidate });
    };

    createPeerConnection = async () => {
        // this.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });
        this.peerConnection = new RTCPeerConnection();
        this.peerConnection.onicecandidate = e => e.candidate && this.onGotCandidate(this.callId, e.candidate);

        if (this.type !== 'publish') {
            this.peerConnection.ontrack = (e) => {
                this.stream = this.stream || new MediaStream();
                this.stream.addTrack(e.track);
                this.onGotStream({ stream: this.stream });
            }
        }

        console.log(this.peerConnection.iceConnectionState);
    };

    generateLocalStream = async () => {
        const constrains = getConstraints();
        this.localStream = await getUserMedia(constrains);
        this.onGotLocalStream?.(this.localStream);
    };

    createOffer = async () => {
        if (this.localStream) {
            this.peerConnection.addStream(new MediaStream(this.localStream.getTracks()));
        }
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        this.onGotOffer?.(offer.sdp, this.callId);
    };

    addAnswer = async (sdp) => {
        const answer = new RTCSessionDescription({ type: "answer", sdp });
        await this.peerConnection.setRemoteDescription(answer);
        this.sdpAnswerSet = true;
    };

    addIceCandidate = async (candidate) => {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };
};