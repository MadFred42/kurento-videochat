module.exports = class Room {

    constructor(data) {
        console.log(data)
        this.stream = data;
    }

    getVideoState() {
        const streams = [...this.stream];

        return streams;
    }
}