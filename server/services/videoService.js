const kurento = require("../kurento/kurento");
const ACTIONS = require("../helpers/socketActions");
const VideoStream = require("../kurento/videoStream");

class VideoService {
    constructor() {
        this.videoStreams = {};
        this.candidateQueue = {};
    }

    async publish(socket, { offer, callId }) {
        const { videoStream, answer } = await this.createUserStream(socket, { callId, offer });
        socket.user.addPublishStream(videoStream);

        return {
            answer,
            callId
        };
    };

    async view(socket, { offer, callId, publishCallId }) {
        console.log(publishCallId)
        const publishStream = this.videoStreams[publishCallId];
        if (!publishStream) {
            throw { message: 'Invalid call id' };
        }
        const { videoStream, answer } = await this.createUserStream(socket, { callId, offer });
        socket.user.addPublishStream(videoStream);

        await publishStream.endpoint.connect(videoStream.endpoint);
        
        return {
            answer,
            callId            
        }
    };

    async createUserStream(socket, { callId, offer }) {
        const pipeline = await kurento.getOrCreatePipeline();
        const endpoint = await kurento.createWebRtcEndpoint(pipeline);
        const videoStream = new VideoStream({
            callId,
            endpoint,
            onIceCandidate: candidate => socket.emit(ACTIONS.VIDEOCHAT_ICE, { candidate, callId }),
        });

        // await videoStream.configureEndpoint();
        this.videoStreams[callId] = videoStream;
        
        if (this.candidateQueue[callId]) {
            videoStream.addCandidates(this.candidateQueue[callId]);
            delete this.candidateQueue[callId];
        }
        const answer = await videoStream.processOffer(offer);
        await videoStream.gatherCandidates();
        return {
            videoStream,
            answer
        };
    };

    async iceCandidate({ candidate, callId }) {
        const videoStream = this.videoStreams[callId];
        if (videoStream) {
            await videoStream.addCandidate(candidate);
        }

        this.candidateQueue[callId] = this.candidateQueue[callId] || [];
        this.candidateQueue[callId].push(candidate);
    };
};

module.exports = new VideoService();