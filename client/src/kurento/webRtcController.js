import { CONNETION_TYPE } from "./connectionType";
import webRtcConnection from "./webRtcConnection";

class WebRtcController {

    constructor(data) {
        this.connection = data.connection;
    }

    addIceCandidate = async ({ candidate, callId }) => {
        const connection = this.connection[callId];

        if (connection && connection.sdpAnswerSet) {
            return await connection.addIceCandidate(candidate);
        }

        this.candidateQueue[callId] = this.candidateQueue[callId] || [];
        this.candidateQueue[callId].push(candidate);
    };

    addAnswer = async ({ answer, callId }) => {
        const connection = this.connection[callId];
        await connection.addAnswer(answer);
        const candidateQueue = this.candidateQueue[callId];

        if (candidateQueue) {
            for (let i = 0; i < candidateQueue.length; i++) {
                await connection.addIceCandidate(candidateQueue[i]);
            }

            delete this.candidateQueue[callId];
        }
    };  

    createPublishConnection = async (data) => {
        const connection = webRtcConnection({ ...data, type: CONNETION_TYPE.PUBLISH });

        await connection.generateLocalStream();
        await connection.createPeerConnection();
        await connection.createOffer();

        this.connections[connection.callId] = connection;
    };

    createViewConnection = async (data) => {
        const connection = webRtcConnection({ ...data, type: CONNETION_TYPE.VIEW });

        await connection.createPeerConnection();
        await connection.createOffer();

        this.connections[connection.callId] = connection;
    }
};

export default new WebRtcController();