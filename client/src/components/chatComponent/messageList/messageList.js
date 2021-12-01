import { List } from '@mui/material';
import React from 'react'
import { MessageListItem } from '../messageListItem/messageListItem';

export const MessageList = () => {
    return (
        <List>
            <MessageListItem />
        </List>
    );
};