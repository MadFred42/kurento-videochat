import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthStore from './stores/AuthStore';
import MessageStore from './stores/MessageStore';
import RoomStore from './stores/RoomStore';
import VideoStore from './stores/VideoStore';

const authStore = new AuthStore();
const roomStore = new RoomStore();
const messageStore = new MessageStore();
const videoStore = new VideoStore();
export const Context = createContext(null);

ReactDOM.render(
    <Context.Provider value={{ authStore, messageStore, roomStore, videoStore }}>
      <App />
    </Context.Provider>,
  document.getElementById('root')
);