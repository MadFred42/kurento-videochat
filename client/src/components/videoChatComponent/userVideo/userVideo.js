import React, { useRef, useEffect } from 'react';
import { Grid } from '@mui/material';

export const UserVideo = ({ stream }) => {
    const videoRef = useRef();

    useEffect(() => {
        console.log(stream)
        if (!videoRef.current) {
            return;
        }

        videoRef.current.srcObject = stream.localStream;
        videoRef.current.play();
        
    }, [videoRef, stream]);


    return (
        <Grid item xs={6}>
            <video
                autoPlay
                muted
                playsInline
                preload="none"
                ref={videoRef} />
        </Grid>
    )
};