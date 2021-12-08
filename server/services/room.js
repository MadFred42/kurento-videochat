module.exports = class Room {

    constructor() {
        this.users = [];
    }

    getVideoState(callId) {
        this.users.push(...this.users, callId);
        console.log(this.users);
        return this.users;
    };
}