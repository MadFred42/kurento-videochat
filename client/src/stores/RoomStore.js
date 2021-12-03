import { makeAutoObservable, toJS } from 'mobx';
import { ACTIONS } from '../helpers/socketActions';
import socket from '../socket';

export default class RoomStore {

    constructor() {
        this._room = {};
        this._users = [];

        makeAutoObservable(this);
    };

    set room(room) {
        this._room = room;
    };

    get room() {
        return toJS(this._room);
    };

    async createRoom() {
        socket.emit(ACTIONS.ROOM, res => {
           this.room = res;
        });
    };
};