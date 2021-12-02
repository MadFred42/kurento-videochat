import React from 'react';
import { Button, Container, FormControl, TextField } from '@mui/material';

export const MessageForm = () => {
    return (
        <Container>
            <FormControl sx={{ display: "flex" }}>
                <TextField
                    id="message"
                    label="Write your message"
                    margin="normal"
                    name="message"
                    onChange={(e) => console.log(e.target.value)}
                />
                <Button                    
                    sx={{ mt: 3, mb: 2 }}
                    type="submit"
                    variant="contained"    
                >
                    Send message
                </Button>
            </FormControl>
        </Container>
    );
};
