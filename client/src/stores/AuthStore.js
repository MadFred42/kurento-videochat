import { makeAutoObservable } from 'mobx';
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
        this._user = user;
    };

    set users(users) {
        this._users = users;
    };

    get isAuth() {
        return this._isAuth;
    };

    get user() {
        return this._user;
    };
    
    get users() {
        return this._users;
    };

    async registration(username, password) {
        try {
            const response = await AuthService.registration(username, password);
            this._isAuth = true;
        } catch (e) {
            
        }
    };
};