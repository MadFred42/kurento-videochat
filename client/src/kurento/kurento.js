import kurentoClient from 'kurento-client';

class Kurento {

    constructor() {
        this.connection = null;
    };

    getKurentoConnection = async () => {
        if (this.connection) {
            return this.connection;
        }

        this.connection = await kurentoClient(process.env.REACT_APP_KURENTO_URL);
        return this.connection;
    };

    createPipeLine = async () => {
        const connection = await this.getKurentoConnection();
        return connection.create("MediaPipeline");
    };

    createWebRtcEndpoint = async (pipeline) => {
        return pipeline.create("WebRtcEndpoint");
    }
};

export default new Kurento();