import React, { useRef } from 'react'

export const UserVideo = ({streams}) => {
    const videoRef = useRef();
    console.log(streams);
    return (
        <div>
            <video
                ref={videoRef}
                autoPlay />
        </div>
    )
};