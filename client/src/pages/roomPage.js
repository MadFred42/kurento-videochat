import React, { useContext, useEffect } from 'react'
import MessageForm from '../components/chatComponent/messageForm';
import MessageList from '../components/chatComponent/messageList';
import VideoChatComponent from '../components/videoChatComponent';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { Grid, Box, Container } from '@mui/material';

export const RoomPage = observer(() => {
    const { authStore, messageStore, roomStore } = useContext(Context);
    
    useEffect(() => {
        roomStore.createRoom();
    }, []);

    useEffect(() => {
        messageStore.getMessages();
    }, [messageStore.messages]);

    if (authStore.error.length > 1) {
        authStore.isAuth = false;
        alert(authStore.error);
        return <Navigate to='/' />
    }

    return (
        <Container
            direction="column"
            style={{ minHeight: '100vh' }}
        >
            <VideoChatComponent />
            <MessageList />
            <MessageForm />
        </Container>
    );
});