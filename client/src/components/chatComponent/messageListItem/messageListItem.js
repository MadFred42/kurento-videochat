import React from 'react';
import { ListItem } from '@mui/material';

export const MessageListItem = ({ message }) => {
    console.log(message);
    return ( 
        <ListItem>
            {message}
        </ListItem>
    );
};