import React, { useEffect, useCallback, useState, useRef } from 'react';
import WebRtcController from '../../kurento/webRtcController';
import { v4 } from 'uuid';
import { ACTIONS } from '../../helpers/socketActions';
import socket from '../../socket';
import differenceWith from 'lodash/differenceWith'

export const VideoChatComponent = () => {
    const [stream, setStream] = useState([]);
    const [currentUser, setCurrentUser] = useState('')
    const webRtcController = new WebRtcController();
    const videoRef = useRef();

    useEffect(() => {
        console.log('publish')
        publishStream();
    }, []);

    useEffect(() => {
        socket.on(ACTIONS.VIDEOCHAT_ICE, async data =>  {
            setCurrentUser(data.callId)
            await webRtcController.addIceCandidate({ candidate: data.candidate, callId: data.callId });
        });
        socket.on('stream:client', data => setStream(data.stream));
    }, []);
    
    useEffect(() => {
        viewStream(currentUser);
    }, []);

    useEffect(() => {
        console.log(stream)
        videoRef.current.srcObject = stream; 
    }, [stream]);
    
    // const porcessVideoChatState =  async () => {
    //     let allStreamsToView = [];
    //     console.log(videoChatState);
    //     for (let i = 0; i < videoChatState.length; i++) {
    //         const videoChatMember = videoChatState[i];

    //         if (currentUser === videoChatMember.id) {
    //             const publishConnection = webRtcController.getConnection(videoChatMember.id, "publish");
    //             if (!publishConnection) {
    //                 await publishStream(videoChatMember);
    //             }
    //             continue;
    //         }
    //         console.log(videoChatMember)
    //         const currentStreams = videoChatMember.streams || [];
    //         const localViewStreams = webRtcController.getConnection(videoChatMember.id, "view");
    //         const streamsToRemove = differenceWith(localViewStreams, currentStreams, (a, b) => a.callId === b.publushCallId);
    //         const streamsToView = differenceWith(currentStreams, localViewStreams, (a, b) => a.callId === b.publushCallId);

    //         for (let j = 0; j < streamsToRemove.length; j++) {
    //             // await stopViewStreams(videoChatMember) 
    //         }

    //         allStreamsToView = [...allStreamsToView, { member: videoChatMember, streams: streamsToView }];
    //     }

    //     allStreamsToView = allStreamsToView.filter(stream => stream.streams.length);

    //     for (let i = 0; i < allStreamsToView.length; i ++) {
    //         for (let j = 0; j <allStreamsToView[i].streams.length; j++) {
    //             await viewStream(allStreamsToView[i].member, allStreamsToView[i].streams[j]);
    //         }
    //     }
    // };

    const publishStream = useCallback(async () => {
        console.log('go publish')
        const callId = v4();
        await webRtcController.createPublishConnection({
            callId,
            // userId: videoChatMember.id,
        });
    }, []);
    
    const viewStream = useCallback(async (publishCallId) => {
        console.log(publishCallId)
        const callId = v4();
        await webRtcController.createViewConnection({
            callId,
            publishCallId
        });
    }, []);
    
    return (
        <div>
            <video 
                ref={videoRef}
                autoPlay
            >

            </video>
        </div>
    );
};
