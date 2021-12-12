import React, { useEffect, useCallback, useState, useRef } from 'react';
import WebRtcController from '../../kurento/webRtcController';
import { v4 } from 'uuid';
import { ACTIONS } from '../../helpers/socketActions';
import socket from '../../socket';
import differenceWith from 'lodash/differenceWith';
import { UserVideo } from './userVideo/userVideo';
import { Grid } from '@mui/material';

export const VideoChatComponent = () => {
    const [videoStreams, setVideoStreams] = useState([]);
    const webRtcController = new WebRtcController();
    const videoChatStateRef = useRef();
    let onGotLocalCandidate;

    useEffect(() => {
        publishStream(socket.id);
    }, []);

    useEffect(() => {
        console.log(videoStreams)
    }, [videoStreams]);

    useEffect(() => { 
        socket.on(ACTIONS.VIDEOCHAT_STATE, (data) => {
            videoChatStateRef.current = data.videos;
            porcessVideoChatState(socket.id);
        });    
    }, []);

    const porcessVideoChatState =  useCallback(async (currentUser) => {
        const videoChatState = videoChatStateRef.current;
        let allStreamsToView = [];

        for (let i = 0; i < videoChatState.length; i++) {
            const videoChatMember = videoChatState[i];
            // if (!videoChatMember) {
            //     return
            // }

            if (currentUser === videoChatMember.id) {
                const publishConnection = webRtcController.getConnection(videoChatMember.id, "publish");
                if (publishConnection.length < 1) {
                    await publishStream(videoChatMember);
                }
                continue;
            }
            const currentStreams = videoChatMember.streams || [];
            const localViewStreams = webRtcController.getConnections(videoChatMember.id, "view");
            const streamsToRemove = differenceWith(localViewStreams, currentStreams, (a, b) => {
                return a.publishCallId === b.callId
            });
            const streamsToView = differenceWith(currentStreams, localViewStreams, (a, b) => {
                return a.callId === b.publishCallId
            });

            for (let j = 0; j < streamsToRemove.length; j++) {
                stopViewStreams(videoChatMember);
            }

            allStreamsToView = [...allStreamsToView, { member: videoChatMember, streams: streamsToView }];
        }

        allStreamsToView = allStreamsToView.filter(stream => stream.streams.length);

        for (let i = 0; i < allStreamsToView.length; i ++) {
            for (let j = 0; j <allStreamsToView[i].streams.length; j++) {
                await viewStream(allStreamsToView[i].member, allStreamsToView[i].streams[j]);
            }
        }
    }, []);
  
    const publishStream = useCallback(async (videoChatMember) => {
        const callId = v4();
        await webRtcController.createPublishConnection({
            callId,
            userId: videoChatMember,
            onGotLocalStream: (stream) => onGotUserVideoStream(videoChatMember, stream),
            onGotCandidate: onGotLocalCandidate
        });
    }, []);

    const viewStream = useCallback(async (videoChatMember, stream) => {
        const callId = v4();
        await webRtcController.createViewConnection({
            callId,
            userId: videoChatMember.id,
            publishCallId: stream.callId,
            onGotRemoteStream: (stream) => onGotUserVideoStream(videoChatMember.id, stream)
        });
    }, []);

    const stopViewStreams = useCallback(async (videoChatMember) => {
        setVideoStreams(prevStreams => (
            
                prevStreams.filter(stream => stream.id !== videoChatMember.id)
            
        ));

        await webRtcController.stopViewStreams(videoChatMember.id);
    }, []);

    const onGotUserVideoStream = useCallback((id ,stream) => {
        setVideoStreams(prevStreams => (
            ([
                ...prevStreams.filter(s => s.id !==id), 
                {
                    id: id,
                    localStream: stream,
                }
            ])
        ));
    }, []);
    
    return (
        <Grid 
            container
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            spacing={1}
        >
            {videoStreams.map((stream, i) => (
                <UserVideo
                    key={i}
                    stream={stream.localStream} />
            ))}
        </Grid>
    );
};




