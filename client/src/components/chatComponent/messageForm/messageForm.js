import React, { useContext, useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { Context } from '../../..';

export const MessageForm = () => {
    const [message, setMessage] = useState('');
    const { messageStore } = useContext(Context);

    const handleSubmit = (e) => {
        e.preventDefault();
        messageStore.sendMessage(message);
        setMessage('');
    };

    return (
        <Grid
            component="form"
            container={true}
            justifyContent="center"
            onSubmit={handleSubmit}
        >
                <TextField
                    id="message"
                    label="Write your message"
                    margin="normal"
                    name="message"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    sx={{ width: "70%" }}
                />
                <Button                    
                    sx={{ m: 3 }}
                    type="submit"
                    variant="contained"    
                >
                    Send message
                </Button>
        </Grid>
    );
};
