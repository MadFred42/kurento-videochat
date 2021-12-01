import $api from '../http';

export default class AuthService {
    static async registration(username, password) {
        return $api.post('/registration', { username, password });
    };
};