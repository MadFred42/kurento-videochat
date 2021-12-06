const ACTIONS = require("../helpers/socketActions");

class VideoStream {
    constructor(data) {
        this.callId = data.callId;
        this.endpoint = data.endpoint;
        this.endpoint.on(ACTIONS.ICE_CANDIDATE, e => data.onIceCandidate(IceCandidage(e.candidate)));
    };

    processOffer = async (offer) => this.endpoint.processOffer(offer);

    gatherCandidates = async () => {
        await this.endpoint.gatherCandidates(); 
    };

    configureEndpoint = async () => {
        const iceServers = await IceServersProvider.getIceServerForKurento();
        await this.endpoint.setStunServerAddress(iceServers.stun.ip);
        await this.endpoint.setStunServerPort(iceServers.stun.port);
        await this.endpoint.setTurnUrl(iceServers.turn);
    };

    addCandidates = (candidates) => {
        candidates.forEach(candidate => this.addCandidate(candidate));        
    };

    addCandidate = async (candidate) => {
        await this.endpoint.addIceCandidate(IceCandidate(candidate));
    };
};

module.exports = new VideoStream();