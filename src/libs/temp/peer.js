class Peer{
    constructor(pcConfig, pcConstraints, remoteId, socketUtil){
        console.log("peer_liu constructor");
        this.remoteVideoEl = document.createElement('video');
        this.remoteVideoEl.controls = true;
        this.remoteVideoEl.autoplay = true;
        this.remoteId = remoteId;
        this.pc = this.createPeerConnection(pcConfig,pcConstraints, socketUtil, remoteId, this.remoteVideoEl);
        this.dataChannel = this.createDataChannel();

    }

    createPeerConnection(pcConfig, pcConstraints, socketUtil, remoteId, remoteVideoEl){
        console.log("createPeerConnection");
        var pc = new RTCPeerConnection(pcConfig, pcConstraints);
        pc.onicecandidate = function(event) {
            if (event.candidate) {
                socketUtil.send('candidate', remoteId, {
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate
                });
            }
        };
        pc.onaddstream = function(event) {
            //stream 来自rtc.loadData
            attachMediaStream(remoteVideoEl, event.stream);
           remoteVideosContainer.appendChild(remoteVideoEl);
        };
        pc.onremovestream = function(event) {
            remoteVideoEl.src = '';
            remoteVideosContainer.removeChild(remoteVideoEl);
        };
        pc.oniceconnectionstatechange = function(event) {
            switch(
                (  event.srcElement // Chrome
                    || event.target   ) // Firefox
                    .iceConnectionState) {
                case 'disconnected':
                    remoteVideosContainer.removeChild(remoteVideoEl);
                    break;
            }
        };

        return pc;
    }

    createDataChannel() {
        var dataChannelOptions = {
            ordered: false, //不保证到达顺序
            maxRetransmitTime: 3000, //最大重传时间
            //添加了negotiated 和 id之后,虽然dataChannel可以open，但是无法传送数据
        };

        var dataChannel =  this.pc.createDataChannel("dataChannel."+ this.remoteId, dataChannelOptions);
        console.log("dataChannel has been initialized");

        dataChannel.onerror = function (error) {
            console.log("Data Channel Error:", error);
        };

        dataChannel.onmessage = this.onMessageHandler;  /*function (event) {

        };*/

        dataChannel.onopen = function () {
            console.log("open event "+ dataChannel.readyState);
            console.log("dataChannel has opened");
        };

        dataChannel.onclose = function () {
            console.log("close event "+ this.dataChannel.readyState);
        };

        return dataChannel;
    }

    onMessageHandler(event){
        const DATA_GPS = "GPS";
        const DATA_FAIL = "FAIL";
        console.log("Got Data Channel Message:", event.data);
        var data = JSON.parse(event.data);
        if (data['type'] == DATA_GPS){
            this.latitude = data['latitude'];
            this.longitude = data['longitude'];
        }else if (data['type' == DATA_FAIL]){
            this.latitude = undefined;
            this.longitude = undefined;
        }
    }

    getChannelState() {
        if (typeof (this.dataChannel) == "undefined")
            this.createDataChannel();
        return this.dataChannel.readyState;
    }

    sendDataByChannel(data){
        console.log(typeof(this.dataChannel));
        if (typeof(this.dataChannel) == "undefined")
            this.createDataChannel();

        this.dataChannel.send(data);
    }
}
