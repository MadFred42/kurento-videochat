import socket from "../socket";

export default function socketEmit(action, data) {
    socket.emit(action, data, cb => {
        
        if (cb) return cb;
    });
};