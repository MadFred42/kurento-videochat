import React, { useEffect } from 'react'
import MessageForm from '../components/chatComponent/messageForm';
import MessageList from '../components/chatComponent/messageList';
import VideoChatComponent from '../components/videoChatComponent';
import socket from '../socket';

export const RoomPage = () => {

    useEffect(() => {
        console.log(socket);
    }, []);
    
    return (
        <div>
            <VideoChatComponent />
            <MessageList />
            <MessageForm />
        </div>
    );
};