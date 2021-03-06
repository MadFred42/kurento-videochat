const ACTIONS = require("../helpers/socketActions");
const IceCandidate = require('kurento-client-elements/lib/complexTypes/IceCandidate');
const IceServersProvider = require('./iceServersProvider');

class VideoStream {
    constructor(data) {
        this.callId = data.callId;
        this.endpoint = data.endpoint;
        this.endpoint.on("OnIceCandidate", event => {
            data.onIceCandidate(IceCandidate(event.candidate))
        });
    };
    // 
    async processOffer(offer) {
        return await this.endpoint.processOffer(offer);
    };

    async gatherCandidates() {
        await this.endpoint.gatherCandidates(); 
    };

    async configureEndpoint() {
        const iceServers = await IceServersProvider.getIceServerForKurento();
        await this.endpoint.setStunServerAddress(iceServers.stun.ip);
        await this.endpoint.setStunServerPort(iceServers.stun.port);
        await this.endpoint.setTurnUrl(iceServers.turn);
    };

    addCandidates(candidates) {
        candidates.forEach(candidate => this.addCandidate(candidate));        
    };

    async addCandidate(candidate) {
        await this.endpoint.addIceCandidate(IceCandidate(candidate));
    };
};

module.exports = VideoStream;