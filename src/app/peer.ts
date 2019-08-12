import '../libs/adapter';
export class Peer {
  public remoteVideoEl;
  public remoteId;
  public pc;
  public dataChannel;
  public latitude;
  public longitude;
  constructor(pcConfig, pcConstraints, remoteId, socketUtil) {
    this.remoteVideoEl = document.createElement('video');
    this.remoteVideoEl.controls = true;
    this.remoteVideoEl.autoplay = true;
    this.remoteId = remoteId;
    this.pc = this.createPeerConnection(pcConfig, pcConstraints, socketUtil, remoteId, this.remoteVideoEl);
    this.dataChannel = this.createDataChannel();
  }

  createPeerConnection(pcConfig, pcConstraints, socketUtil, remoteId, remoteVideoEl) {
    let pc; pc = new RTCPeerConnection(pcConfig, pcConstraints);
    pc.onicecandidate = event => {
      if (event.candidate) {
        socketUtil.send('candidate', remoteId, {
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate
        });
      }
    };
    pc.onaddstream = event => {
      // stream 来自rtc.loadData
      attachMediaStream(remoteVideoEl, event.stream);
      // remoteVideosContainer.appendChild(remoteVideoEl);
    };
    pc.onremovestream = event => {
      remoteVideoEl.src = '';
      // remoteVideosContainer.removeChild(remoteVideoEl);
    };
    pc.oniceconnectionstatechange = event => {
      switch (
        (  event.srcElement // Chrome
          || event.target   ) // Firefox
          .iceConnectionState) {
        case 'disconnected':
          // remoteVideosContainer.removeChild(remoteVideoEl);
          break;
      }
    };

    return pc;
  }

  createDataChannel() {
    const dataChannelOptions = {
      ordered: false, // 不保证到达顺序
      maxRetransmitTime: 3000, // 最大重传时间
      // 添加了negotiated 和 id之后,虽然dataChannel可以open，但是无法传送数据
    };

    let dataChannel; dataChannel =  this.pc.createDataChannel('dataChannel.' + this.remoteId, dataChannelOptions);
    console.log('dataChannel has been initialized');

    dataChannel.onerror = error => {
      console.log('Data Channel Error:', error);
    };

    dataChannel.onmessage = this.onMessageHandler;  /*function (event) {

        };*/

    dataChannel.onopen = () => {
      console.log('open event ' + dataChannel.readyState);
      console.log('dataChannel has opened');
    };

    dataChannel.onclose = () => {
      console.log('close event ' + this.dataChannel.readyState);
    };

    return dataChannel;
  }

  onMessageHandler(event) {
    const DATA_GPS = 'GPS';
    const DATA_FAIL = 'FAIL';
    console.log('Got Data Channel Message:', event.data);
    let data; data = JSON.parse(event.data);
    if (data.type === DATA_GPS) {
      this.latitude = data.latitude;
      this.longitude = data.longitude;
    } else if (data['type' === DATA_FAIL]) {
      this.latitude = undefined;
      this.longitude = undefined;
    }
  }

  getChannelState() {
    if (typeof (this.dataChannel) === 'undefined') {
      this.createDataChannel();
    }
    return this.dataChannel.readyState;
  }

  sendDataByChannel(data) {
    console.log(typeof(this.dataChannel));
    if (typeof(this.dataChannel) === 'undefined') {
      this.createDataChannel();
    }

    this.dataChannel.send(data);
  }
}
