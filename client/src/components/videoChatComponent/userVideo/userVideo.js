import React, { useRef, useEffect } from 'react'

export const UserVideo = ({ stream }) => {
    const videoRef = useRef();

    useEffect(() => {
        console.log(stream)
        if (!videoRef.current) {
            return;
        }

        videoRef.current.srcObject = stream.localStream;
        videoRef.current.play();
        
    }, [videoRef]);


    return (
        <div>
            <video
                autoPlay
                playsInline
                preload="none"
                ref={videoRef} />
        </div>
    )
};