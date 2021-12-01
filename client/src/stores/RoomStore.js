import { makeAutoObservable, toJS } from 'mobx';
import AuthStore from './AuthStore';

export default class RoomStore {

    constructor() {
        this._room = 'Video chat';
        this._users = [];

        makeAutoObservable(this);
    };

  
};