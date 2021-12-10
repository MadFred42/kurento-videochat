import React, { useEffect, useCallback, useState, useRef } from 'react';
import WebRtcController from '../../kurento/webRtcController';
import { v4 } from 'uuid';
import { ACTIONS } from '../../helpers/socketActions';
import socket from '../../socket';
import differenceWith from 'lodash/differenceWith'
import { UserVideo } from './userVideo/userVideo';
import { Grid } from '@mui/material';

export const VideoChatComponent = () => {
    const [videoStreams, setVideoStreams] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const webRtcController = new WebRtcController();
    const videoChatStateRef = useRef();
    let onGotLocalCandidate;

    useEffect(() => {
        publishStream();
    }, [videoChatStateRef]);

    useEffect(() => { 
        socket.on(ACTIONS.VIDEOCHAT_STATE, (data) => {
            videoChatStateRef.current = data.videos;
            porcessVideoChatState();
        });    
    }, []);

    const porcessVideoChatState =  useCallback(async () => {
        const videoChatState = videoChatStateRef.current;
        console.log(videoChatStateRef.current);
        let allStreamsToView = [];
        for (let i = 0; i < videoChatState.length; i++) {
            const videoChatMember = videoChatState[i];
            if (!videoChatMember) {
                return
            }

            if (currentUser === videoChatMember.id) {
                const publishConnection = webRtcController.getConnection(videoChatMember.id, "publish");
                if (!publishConnection) {
                    await publishStream(videoChatMember);
                }
                continue;
            }
            const currentStreams = videoChatMember.streams || [];
            const localViewStreams = webRtcController.getConnections(videoChatMember.id, "view");
            console.log(localViewStreams)
            const streamsToRemove = differenceWith(localViewStreams, currentStreams, (a, b) => {
                return a.callId === b.publushCallId
            });
            const streamsToView = differenceWith(currentStreams, localViewStreams, (a, b) => {
                return a.callId === b.publushCallId
            });

            for (let j = 0; j < streamsToRemove.length; j++) {
                await webRtcController.stopViewStreams(videoChatMember);
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
            onGotLocalStream: (stream) => onGotUserVideoStream(callId, stream),
            onGotCandidate: onGotLocalCandidate
        });
        
    }, []);

    const viewStream = useCallback(async (videoChatMember, stream) => {
        const callId = v4();
        await webRtcController.createViewConnection({
            callId,
            publishCallId: stream.callId,
            userId: videoChatMember.id,
            onGotRemoteStream: (stream) => onGotUserVideoStream(videoChatMember.id, stream)
        });
    }, []);

    const stopViewStreams = useCallback((videoChatMember) => {

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

        console.log(videoStreams)
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




