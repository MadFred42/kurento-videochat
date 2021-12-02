import { makeAutoObservable, toJS } from 'mobx';
import socket from '../socket';

export default class AuthStore {

    constructor() {
        this._isAuth = false;
        this._user = {};
        this._users = [];
        this._error = '';

        makeAutoObservable(this);
    };

    set error(error) {
        this._error = error;
    };

    set isAuth(boolean) {
        this._isAuth = boolean;
    };

    set user(user) {
        this._user = user;
    };

    set users(users) {
        this._users = users;
    };

    get error() {
        return toJS(this._error);
    }

    get isAuth() {
        return this._isAuth;
    };

    get user() {
        return toJS(this._user);
    };
    
    get users() {
        return this._users;
    };

    async registration(username, password) {
        try {
            socket.emit('registration', { username, password }, (res) => {
                console.log(res);
                if (typeof(res) === 'string') {
                    return this.error = res;
                }

                this.user = res;
            });
            this.isAuth = true;
        } catch (e) {
            console.log(e)
        }
    };
};