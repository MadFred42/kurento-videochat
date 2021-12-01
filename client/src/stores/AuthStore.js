import { makeAutoObservable, toJS } from 'mobx';
import AuthService from '../services/AuthService';

export default class AuthStore {

    constructor() {
        this._isAuth = false;
        this._user = {};
        this._users = [];

        makeAutoObservable(this);
    };

    set isAuth(boolean) {
        this._isAuth = boolean;
    };

    set user(user) {
        console.log(user)
        this._user = user;
    };

    set users(users) {
        this._users = users;
    };

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
            const response = await AuthService.registration(username, password);
            this.isAuth = true;
            console.log(response)
            this.user = response.data;
        } catch (e) {
            console.log(e)
        }
    };
};