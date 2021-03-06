import adapter from 'webrtc-adapter';
import { getConstraints } from './constraints';
import { getUserMedia } from './getUserMedia';
import socket from '../socket';
import { ACTIONS } from '../helpers/socketActions';
import socketEmit from '../helpers/socketEmit';

export default class WebRtcConnection {

    constructor(data) {
        this.callId = data.callId;
        this.userId = data.userId;
        this.type = data.type;
        this.iceServers = data.iceServers;
        this.sdpAnswerSet = false;
        this.publishCallId = data.publishCallId
        this.onGotOffer = (offer, callId, type) => socket.emit(
            type === 'publish' ? ACTIONS.OFFER_PUBLISH : ACTIONS.OFFER_VIEW, { 
                offer, 
                callId,     
                type, 
                publishCallId: data.publishCallId,
             }, (callback) => data.getAnswer(callback)
        );
        this.onGotCandidate = (callId, candidate) => socketEmit(ACTIONS.ICE_CANDIDATE, { callId, candidate });
        this.onGotLocalStream = (stream) => {
            data.onGotLocalStream({
                id: this.userId,
                localStream: stream
            })
        };
        this.onGotStream = ({ stream }) => {
            data.onGotRemoteStream({
                id: this.userId,
                localStream: stream
            })
        };
    };

    createPeerConnection = async () => {
        this.peerConnection = new RTCPeerConnection(this.iceServers);
        this.peerConnection.onicecandidate = e => e.candidate && this.onGotCandidate(this.callId, e.candidate);

        if (this.type !== 'publish') {
            this.peerConnection.ontrack = (e) => {
                this.stream = this.stream || new MediaStream();
                this.stream.addTrack(e.track);
                this.onGotStream({ stream: this.stream });
            }
        }
        // this.peerConnection.onconnectionstatechange = this.onIceConnectionsStateChange;
    };

    // onIceConnectionsStateChange = (state) => {
    //     console.log('ice connection state change:', state);
    //     console.log('iceConnectionState: ', this.peerConnection.iceConnectionState);
    // }

    generateLocalStream = async () => {
        const constraints = getConstraints();
        this.localStream = await getUserMedia(constraints);
        this.onGotLocalStream?.(this.localStream);
    };
    
    createOffer = async () => {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => this.peerConnection.addTrack(track));
            
        }
        const offer = await this.peerConnection.createOffer({
            offerToReceiveAudio: this.type === 'view', 
            offerToReceiveVideo: this.type === 'view'
        });        
        await this.peerConnection.setLocalDescription(offer);
        this.onGotOffer?.(offer.sdp, this.callId, this.type);
    };

    addAnswer = async (sdp) => {
        const answer = new RTCSessionDescription({ type: "answer", sdp });
        await this.peerConnection.setRemoteDescription(answer);
        this.sdpAnswerSet = true;
    };

    addIceCandidate = async (candidate) => {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    stopStream = async () => {
        this.peerConnection.close();
    }
};