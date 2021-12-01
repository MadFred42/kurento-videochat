import React, { useContext, useEffect } from 'react'
import MessageForm from '../components/chatComponent/messageForm';
import MessageList from '../components/chatComponent/messageList';
import VideoChatComponent from '../components/videoChatComponent';
import socket from '../socket';
import { useLocalStorage } from 'react-use';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

export const RoomPage = observer(() => {
    const { authStore } = useContext(Context);
    const [username] = useLocalStorage('username');
    const navigate = useNavigate();
    
    if (authStore.error.length > 1) {
        navigate('/');
        alert(authStore.error);
        authStore.isAuth = false;
    }

    return (
        <div>
            <VideoChatComponent />
            <MessageList />
            <MessageForm />
        </div>
    );
});