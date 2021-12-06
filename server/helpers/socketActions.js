const ACTIONS = {
    CONNECT: 'connection',
    DISCONNECT: 'disconnect',
    JOIN: 'registration',
    ROOM: 'createroom',
    MESSAGE: 'message',
    ALL_MESSAGES: 'message:get',
    VIDEOCHAT_STATE: 'videoChat:state',
    ICE_CANDIDATE: 'OnIceCandidates',
    VIDEOCHAT_ICE: 'videoChat:iceCandidate'
};

module.exports = ACTIONS;