const { default: kurento } = require("../../client/src/kurento/kurento");
const ACTIONS = require("../helpers/socketActions");
const VideoStream = require("../kurento/videoStream");

class VideoService {
    publish = async (socket, { offer, callId }) => {
        const { videoStream, answer } = await this.createUserStream(socket, { callId, offer });
        socket.to(socket.id).addPublishStream(videoStream);

        return {
            answer,
            callId
        };
    };

    view = async (socket, { offer, callId, publishCallId }) => {
        const publishStream = videoStreams[publishCallId];

        if (!publishStream) {
            throw { message: 'Invalid call id' };
        }

        const { videoStream, answer } = await this.createUserStream(socket, { callId, offer });
        socket.to(socket.id).addPublishStream(videoStream);

        await publishStream.endpoint.connect(videoStream.endpoint);

        return {
            answer,
            callId            
        }
    };

    createUserStream = async (socket, { callId, offer }) => {
        const pipeline = await getOrCreatePipeline();
        const endpoint = await kurento.createWebRtcEndpoint(pipeline);

        const videoStream = VideoStream({
            callId,
            endpoint,
            onIceCandidate: candidate => socket.emit(ACTIONS.VIDEOCHAT_ICE, { candidate, callId })
        });

        await videoStream.configureEndpoint();
        videoStreams[callId] = videoStream;
        
        if (candidateQueue[callId]) {
            videoStream.addCandidates(candidateQueue[callId]);
            delete candidateQueue[callId];
        }
        
        const answer = await videoStream.processOffer(offer);
        await videoStream.gatherCandidates();
        return {
            videoStream,
            answer
        }
    };

    iceCandidate = async ({ candidate, callId }) => {
        const videoStream = videoStreams[callId];

        if (videoStream) {
            await videoStream.addCandidate(candidate);
        }

        candidateQueue[callId] = candidateQueue[callId] || [];
        candidateQueue[callId].push(candidate);
    };
};

module.exports = new VideoService();