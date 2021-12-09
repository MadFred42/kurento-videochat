import React, { useEffect, useCallback, useState, useRef } from 'react';
import WebRtcController from '../../kurento/webRtcController';
import { v4 } from 'uuid';
import { ACTIONS } from '../../helpers/socketActions';
import socket from '../../socket';
import differenceWith from 'lodash/differenceWith'
import { UserVideo } from './userVideo/userVideo';

export const VideoChatComponent = () => {
    const [videoStreams, setVideoStreams] = useState({});
    const [currentUser, setCurrentUser] = useState('')
    const webRtcController = new WebRtcController();
    const videoRef = useRef();
    const publishCallidRef = useRef();

    useEffect(() => {
        publishStream();
    }, []);

    useEffect(() => {
        socket.on(ACTIONS.VIDEOCHAT_ICE, async data =>  {
            await webRtcController.addIceCandidate({ candidate: data.candidate, callId: data.callId });
        });
    }, []);
    
    useEffect(() => {
        viewStream(currentUser);
    }, [currentUser]);

    useEffect(() => {
        console.log(socket);
    }, []);  
  
    const publishStream = useCallback(async () => {
        const callId = v4();
        await webRtcController.createPublishConnection({
            callId,
            onGotLocalStream: (stream) => onGotUserVideoStream(stream)
            // userId: videoChatMember.id,
        });
    }, []);
    
    const viewStream = useCallback(async (publishCallId) => {
        const callId = v4();
        await webRtcController.createViewConnection({
            callId,
            publishCallId
        });
    }, []);

    const onGotUserVideoStream = useCallback((stream) => {
        setVideoStreams((stream) => ([
            ...stream,
            {
                localStream: stream
            }
        ]));
    }, []);
    
    return (
        <div>
            <UserVideo streams={videoStreams} />
        </div>
    );
};



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
