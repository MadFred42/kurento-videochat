import React, { useEffect, useState } from 'react';
import WebRtcController from '../../kurento/webRtcController';
import { v4 } from 'uuid';

export const VideoChatComponent = () => {
    const webRtcController = new WebRtcController();
    const callId = v4();
    useEffect(() => {
        webRtcController.createPublishConnection({
            callId,
        });

        webRtcController.createViewConnection({
            callId
        })
    }, []);

    return (
        <div>
            VideoChatComponent
        </div>
    );
};
