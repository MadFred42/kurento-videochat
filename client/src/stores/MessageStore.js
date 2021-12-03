import { makeAutoObservable, toJS } from 'mobx';
import { ACTIONS } from '../helpers/socketActions';
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
        socket.emit(ACTIONS.MESSAGE, { message }, (res) => {
            this.messages = res;
        });
    };

    async getMessages() {
        socket.emit(ACTIONS.ALL_MESSAGES, res => {
            this.messages = res;
        });
    }
};