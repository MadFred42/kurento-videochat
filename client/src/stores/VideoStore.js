import { makeAutoObservable, toJS } from 'mobx';

export default class VideoStore {

    constructor() {
        this._stream = '';

        makeAutoObservable(this);
    }

    set stream(stream) {
        this._stream = stream
    };

    get stream() {
        return toJS(this._stream);
    };

    setSream(stream) {
        this.stream = stream;
    };
};