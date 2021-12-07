import React, { useEffect, useState } from 'react';
import WebRtcController from '../../kurento/webRtcController';
import { v4 } from 'uuid';
import { ACTIONS } from '../../helpers/socketActions';
import socket from '../../socket';

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

    useEffect(() => {
        socket.on(ACTIONS.VIDEOCHAT_ICE, async data => await webRtcController.addIceCandidate({ candidate: data.candidate, callId: data.callId }));
    }, []);
    
    return (
        <div>
            VideoChatComponent
        </div>
    );
};
