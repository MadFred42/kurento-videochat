import React, { useContext, useEffect } from 'react'
import MessageForm from '../components/chatComponent/messageForm';
import MessageList from '../components/chatComponent/messageList';
import VideoChatComponent from '../components/videoChatComponent';
import socket from '../socket';
import { useLocalStorage } from 'react-use';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { Grid } from '@mui/material';

export const RoomPage = observer(() => {
    const { authStore } = useContext(Context);
    const [username] = useLocalStorage('username');
    
    if (authStore.error.length > 1) {
        authStore.isAuth = false;
        alert(authStore.error);
        return <Navigate to='/' />
    }

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >
            <VideoChatComponent />
            <MessageList />
            <MessageForm />
        </Grid>
    );
});