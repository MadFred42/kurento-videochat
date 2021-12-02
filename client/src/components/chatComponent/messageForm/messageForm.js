import React from 'react';
import { Button, Container, FormControl, Grid, Stack, TextField } from '@mui/material';

export const MessageForm = () => {
    return (
        <Grid 
            container={true}
            justifyContent="center"
        >
                <TextField
                    id="message"
                    label="Write your message"
                    margin="normal"
                    name="message"
                    onChange={(e) => console.log(e.target.value)}
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
