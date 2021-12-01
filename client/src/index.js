import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthStore from './stores/AuthStore';
import RoomStore from './stores/RoomStore';

const authStore = new AuthStore();
const roomStore = new RoomStore();
export const Context = createContext(null);

ReactDOM.render(
    <Context.Provider value={{ authStore, roomStore }}>
      <App />
    </Context.Provider>,
  document.getElementById('root')
);