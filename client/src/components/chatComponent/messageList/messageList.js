import React, { useContext } from 'react';
import { Context } from '../../../';
import { observer } from 'mobx-react-lite';
import { List } from '@mui/material';
import { MessageListItem } from '../messageListItem/messageListItem';

export const MessageList = observer(() => {
    const { messageStore } = useContext(Context);
    const messages = messageStore.messages;
    
    return (
        <List style={{border: '1px solid black', borderRadius: '10px'}}>
            {messages.map(message => (
                <MessageListItem key={message._id} message={message.text}/>
            ))}
        </List>
    );
});