import React, { useRef, useEffect } from 'react';
import { Grid } from '@mui/material';

export const UserVideo = ({ stream, isMyStream }) => {
    const videoRef = useRef();

    useEffect(() => {
        if (!videoRef.current) {
            return;
        }
        videoRef.current.srcObject = stream.localStream;
        videoRef.current.muted = isMyStream;
        // videoRef.current.play();      
    }, [videoRef, stream, isMyStream]);


    return (
        <Grid 
            item 
            xs={6}
        >
            <video
                autoPlay
                muted
                playsInline
                preload="none"
                ref={videoRef}
                style={{ alignSelf: 'center', border: '1px solid black', borderRadius: '10px', width: '100%' }} />
        </Grid>
    )
};