const ACTIONS = {
    CONNECT: 'connection',
    DISCONNECT: 'disconnect',
    JOIN: 'registration',
    ROOM: 'createroom',
    MESSAGE: 'message',
    ALL_MESSAGES: 'message:get',
    ICE_CANDIDATE: 'iceCandidate',
    VIDEOCHAT_STATE: 'videoChat:state',
    VIDEOCHAT_ICE: 'videoChat:iceCandidate',
    OFFER: 'offer',
};

module.exports = ACTIONS;