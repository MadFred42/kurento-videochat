import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';

export const SignInForm = observer(() => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { authStore } = useContext(Context);
    const naviagte = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        authStore.registration(username, password);
        naviagte('/videochatRoom');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                marginTop: 7,
            }}
        >
                <Typography>
                   Sign in
                </Typography>
            </Box>
            <Box 
                component="form"
                onSubmit={handleSubmit}
            >
                <TextField
                    autoComplete="username"
                    autoFocus 
                    fullWidth
                    id="username"
                    label="Username"
                    margin="normal"
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    autoComplete="current-password"
                    autoFocus 
                    fullWidth
                    id="password"
                    label="Password"
                    margin="normal"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                    type="submit"
                    variant="contained"    
                >
                    Sign In
                </Button>
            </Box>
        </Container>
    );
});