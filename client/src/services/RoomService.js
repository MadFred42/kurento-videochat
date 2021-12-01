import $api from '../http';

export default class RoomService {
    static async createRoom() {
        return $api.post('/join');
    };
};