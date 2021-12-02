import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthStore from './stores/AuthStore';
import MessageStore from './stores/MessageStore';
import RoomStore from './stores/RoomStore';

const authStore = new AuthStore();
const roomStore = new RoomStore();
const messageStore = new MessageStore();
export const Context = createContext(null);

ReactDOM.render(
    <Context.Provider value={{ authStore, messageStore, roomStore }}>
      <App />
    </Context.Provider>,
  document.getElementById('root')
);