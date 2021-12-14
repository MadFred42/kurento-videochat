import { ACTIONS } from "../helpers/socketActions";
import socket from "../socket";
import { CONNECTION_TYPE } from "./connectionType";
import webRtcConnection from "./webRtcConnection";

export default class WebRtcController {

    constructor() {
        this.connections = {};
        this.candidateQueue = {};
        this.localStream = {};
        socket.on(ACTIONS.VIDEOCHAT_ICE, async data =>  {
            this.addIceCandidate({ candidate: data.candidate, callId: data.callId });
        });
    }

    createPublishConnection = async (data) => {
        const connection = new webRtcConnection({
            ...data, 
            type: CONNECTION_TYPE.PUBLISH, 
            getAnswer: callback => this.addAnswer({ answer: callback.answer, callId: callback.callId }),
        });
        
        await connection.generateLocalStream();
        await connection.createPeerConnection();
        await connection.createOffer();
        this.connections[connection.callId] = connection;

        console.log(`connections after publish:`);
        console.log(this.connections)
    };

    createViewConnection = async (data) => {
        const connection = new webRtcConnection({
            ...data, 
            type: CONNECTION_TYPE.VIEW,
            getAnswer: callback => this.addAnswer({ answer: callback.answer, callId: callback.callId }),
        });
        await connection.createPeerConnection();
        await connection.createOffer();

        this.connections[connection.callId] = connection;

        console.log(`connections after view:`);
        console.log(this.connections)
    };

    addIceCandidate = async ({ candidate, callId }) => {
        const connection = this.connections[callId];

        if (connection && connection.sdpAnswerSet) {
            return await connection.addIceCandidate(candidate);
        }

        this.candidateQueue[callId] = this.candidateQueue[callId] || [];
        this.candidateQueue[callId].push(candidate);
    };

    addAnswer = async ({ answer, callId }) => {
        const connection = this.connections[callId];
        await connection.addAnswer(answer);
        const candidateQueue = this.candidateQueue[callId];
        
        if (candidateQueue) {
            for (let i = 0; i < candidateQueue.length; i++) {
                await connection.addIceCandidate(candidateQueue[i]);
            }

            delete this.candidateQueue[callId];
        }
    };  

    getConnection(userId, type) {
        const connections = [];
        Object.keys(this.connections).forEach(id => {
            if (this.connections[id].userId === userId && this.connections[id].type === type) {
                connections.push(this.connections[id]);
            }
        });

        return connections;
    };

    getConnections(userId, type) {
        const connections = [];
        Object.keys(this.connections).forEach(id => {
            if (this.connections[id].userId === userId && this.connections[id].type === type) {
                connections.push(this.connections[id]);
            }
        });
        
        return connections;
    };

    stopViewStreams(userId) {
        Object.keys(this.connections).forEach(async id => {
            if (this.connections[id].userId === userId) {
                await this.connections[id].stopStream();
                delete this.connections[id];
            }
        });
    };
};