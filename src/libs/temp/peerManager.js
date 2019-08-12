var PeerManager = (function () {

    var localId,
        config = {
            peerConnectionConfig: {
                iceServers: [
                    {"url": "stun:23.21.150.121"},
                    {"url": "stun:stun.l.google.com:19302"}
                ]
            },
            peerConnectionConstraints: {
                optional: [
                    {"DtlsSrtpKeyAgreement": true}
                ]
            }
        },
        peerMap = {},
        localStream,
        socketUtil = new SocketUtil(),
        socket = socketUtil.getSocket();
        /*remoteVideosContainer = null;*/



    socket.on('message', handleMessage);
    socket.on('id', function(id) {
        localId = id;
    });

    function addPeer(remoteId) {
        console.log("addPeer");
        var peer = new Peer(config.peerConnectionConfig, config.peerConnectionConstraints, remoteId, socketUtil);
        peerMap[remoteId] = peer;
        return peer;
    }
    function answer(remoteId) {
        var pc = peerMap[remoteId].pc;
        pc.createAnswer(
            function(sessionDescription) {
                pc.setLocalDescription(sessionDescription);
                socketUtil.send('answer', remoteId, sessionDescription);
            },
            error
        );
    }
    function offer(remoteId) {
        var pc = peerMap[remoteId].pc;
        pc.createOffer(
            function(sessionDescription) {
                pc.setLocalDescription(sessionDescription);
                socketUtil.send('offer', remoteId, sessionDescription);
            },
            error
        );
    }
    function handleMessage(message) {
        var type = message.type,
            from = message.from,
            pc = (peerMap[from] || addPeer(from)).pc;

        console.log('received ' + type + ' from ' + from);

        switch (type) {
            case 'init':
                toggleLocalStream(pc);
                offer(from);
                break;
            case 'offer':
                pc.setRemoteDescription(new RTCSessionDescription(message.payload), function(){}, error);
                answer(from);
                break;
            case 'answer':
                pc.setRemoteDescription(new RTCSessionDescription(message.payload), function(){}, error);
                break;
            case 'candidate':
                if(pc.remoteDescription) {
                    pc.addIceCandidate(new RTCIceCandidate({
                        sdpMLineIndex: message.payload.label,
                        sdpMid: message.payload.id,
                        candidate: message.payload.candidate
                    }), function(){}, error);
                }
                break;
        }
    }

    function toggleLocalStream(pc) {
        if(localStream) {
            (!!pc.getLocalStreams().length) ? pc.removeStream(localStream) : pc.addStream(localStream);
        }
    }
    function error(err){
        console.log(err);
    }

    function sendDataByChannel(data, remoteId) {
        let peer = peerMap[remoteId];
        if (peer.getChannelState() != "open"){
            console.log("dataChannel:" + peer.getChannelState());
            return;
        }

        peer.sendDataByChannel(data);
    }

    return {
        getId: function() {
            return localId;
        },

        setLocalStream: function(stream) {

            // if local cam has been stopped, remove it from all outgoing streams.
            if(!stream) {
                for(id in peerMap) {
                    pc = peerMap[id].pc;
                    if(!!pc.getLocalStreams().length) {
                        pc.removeStream(localStream);
                        offer(id);
                    }
                }
            }

            localStream = stream;
        },

        toggleLocalStream: function(remoteId) {
            peer = peerMap[remoteId] || addPeer(remoteId);
            toggleLocalStream(peer.pc);
        },

        peerInit: function(remoteId) {
            console.log("peerInit",remoteId);
            peer = peerMap[remoteId] || addPeer(remoteId);
            socketUtil.send('init', remoteId, null);
        },

        peerRenegociate: function(remoteId) {
            offer(remoteId);
        },

        send: function(type, payload) {
            socket.emit(type, payload);
        },

        sendData: function (data, remoteId) {
            sendDataByChannel(data, remoteId);
        },

        getGPS: function (remoteId) {
            sendDataByChannel("GPS", remoteId);
            let peer = this.getPeer(remoteId);
            let position = {"longitude":peer.dataChannel.longitude, "latitude":peer.dataChannel.latitude};
            return position;
            },

        getPeer: function (remoteId) {
            return peerMap[remoteId];
        },

      /*  setContainer: function (container) {
              remoteVideosContainer = container;
        },*/

        getScreen: function (remoteId) {
            sendDataByChannel("screen", remoteId);
        },

        getFrontCamera: function (remoteId) {
            sendDataByChannel("front", remoteId);
        },

        getBackCamera: function (remoteId) {
            sendDataByChannel("back", remoteId);
        },

        test: function (text) {
          console.log(text);
        }

    };

});

