import { makeAutoObservable, toJS } from 'mobx';
import socket from '../socket';

export default class MessageStore {

    constructor() {
        this._messages = [];

        makeAutoObservable(this);
    };

    set messages(messages) {
        this._messages = messages;
    };

    get messages() {
        return toJS(this._messages);
    };

    async sendMessage(message) {
        socket.emit('message', { message }, (res) => {
            this.messages = res;
        });
    };

    async getMessages() {
        socket.emit('message:get', res => {
            this.messages = res;
        });
    }
};