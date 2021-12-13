module.exports = new class IceServersProvider {

    async getIceServerForKurento() {
        return {
            turn: 'kurentoturn:kurentoturnpassword@78.46.107.230:3486',
            stun: {
                ip: 'stun:stun.l.google.com',
                port: 19302
            }
        };
    };
};