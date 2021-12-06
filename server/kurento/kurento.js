const kurentoClient = require('kurento-client');

class Kurento {

    constructor() {
        this.connection = null;
        this.pipeline = null;
    };

    async getKurentoConnection() {
        if (this.connection) {
            return this.connection;
        }
        this.connection = await kurentoClient(process.env.KURENTO_URL);
        
        return this.connection;
    };

    async createPipeLine() {
        const connection = await this.getKurentoConnection();
        this.pipeline = await connection.create("MediaPipeline");
        return this.pipeline;
    };

    async getOrCreatePipeline() {
        if (!this.pipeline) {
            await this.createPipeLine();
        }

        return this.pipeline;
    };

    async createWebRtcEndpoint(pipeline) {
        return pipeline.create("WebRtcEndpoint");
    };
};

module.exports = new Kurento();