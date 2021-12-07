import { CONNECTION_TYPE } from "./connectionType";
import webRtcConnection from "./webRtcConnection";

export default class WebRtcController {

    constructor() {
        this.connections = {};
        this.candidateQueue = {};
        this.localStream = {};
    }

    createPublishConnection = async (data) => {
        const connection = new webRtcConnection({
            ...data, 
            type: CONNECTION_TYPE.PUBLISH, 
            getAnswer: callback => this.addAnswer({ answer: callback.answer, callId: callback.callId }),
        });

        await connection.generateLocalStream();
        await connection.createPeerConnection();
        await connection.createOffer('publish');
        this.connections[connection.callId] = connection;
    };

    createViewConnection = async (data) => {
        const connection = new webRtcConnection({
            ...data, 
            type: CONNECTION_TYPE.VIEW,
            getAnswer: callback => this.addAnswer({ answer: callback.answer, callId: callback.callId }),
        });

        await connection.createPeerConnection();
        await connection.createOffer('view');

        this.connections[connection.callId] = connection;
    };

    addIceCandidate = async ({ candidate, callId }) => {
        console.log(candidate)
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
};