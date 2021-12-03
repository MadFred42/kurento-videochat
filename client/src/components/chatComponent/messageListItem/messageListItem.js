import React from 'react';
import { ListItem } from '@mui/material';

export const MessageListItem = ({ message }) => {
    
    return ( 
        <ListItem>
            {message}
        </ListItem>
    );
};