import { makeAutoObservable, toJS } from 'mobx';
import RoomService from '../services/RoomService';
import AuthStore from './AuthStore';

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
        const response = await RoomService.createRoom();
        // this.room = response.data;
        console.log(response);
    };
};