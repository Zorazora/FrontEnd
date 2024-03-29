import * as adapter from '../libs/adapter';
export class Peer {
  public remoteVideoEl;
  public remoteId;
  public pc;
  public dataChannel;
  public latitude;
  public longitude;
  public remoteVideosContainer;
  constructor(pcConfig, pcConstraints, remoteId, socketUtil) {
    this.remoteVideoEl = document.createElement('video');
    this.remoteVideoEl.controls = true;
    this.remoteVideoEl.autoplay = true;
    this.remoteId = remoteId;
    this.pc = this.createPeerConnection(pcConfig, pcConstraints, socketUtil, remoteId, this.remoteVideoEl);
    this.remoteVideosContainer = document.getElementById('remoteVideosContainer');
    this.dataChannel = this.createDataChannel();
  }

  createPeerConnection(pcConfig, pcConstraints, socketUtil, remoteId, remoteVideoEl) {
    let pc; pc = new adapter.RTCPeerConnection(pcConfig, pcConstraints);
    pc.onicecandidate = event => {
      if (event.candidate) {
        socketUtil.sendInfo('candidate', remoteId, {
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate
        });
      }
    };
    pc.onaddstream = event => {
      // stream 来自rtc.loadData
      pc.addStream(event.stream);
      // attachMediaStream(remoteVideoEl, event.stream);
      // this.remoteVideosContainer.appendChild(remoteVideoEl);
    };
    pc.onremovestream = event => {
      remoteVideoEl.src = '';
      // this.remoteVideosContainer.removeChild(remoteVideoEl);
    };
    pc.oniceconnectionstatechange = event => {
      switch (
        (  event.srcElement // Chrome
          || event.target   ) // Firefox
          .iceConnectionState) {
        case 'disconnected':
          // this.remoteVideosContainer.removeChild(remoteVideoEl);
          break;
      }
    };

    return pc;
  }

  createDataChannel() {
    const dataChannelOptions = {
      ordered: false, // 不保证到达顺序
      // maxRetransmitTime: 3000, // 最大重传时间
      maxPacketTime: 3000,
      // 添加了negotiated 和 id之后,虽然dataChannel可以open，但是无法传送数据
    };

    let dataChannel; dataChannel =  this.pc.createDataChannel('dataChannel.' + this.remoteId, dataChannelOptions);
    console.log('dataChannel has been initialized');

    dataChannel.onerror = error => {
      console.log('Data Channel Error:', error);
    };
    dataChannel.onmessage = this.onMessageHandler.bind(this);  /*function (event) {

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
    } else if (data.type === DATA_FAIL) {
      this.latitude = undefined;
      this.longitude = undefined;
    } else if (data.type === 'PUNCH') {
      console.log(this.remoteId);
      let container;
      container = document.getElementById(this.remoteId);
      container.style.visibility = 'visible';
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

  getStream(id) {
    let streams; streams = this.pc.getRemoteStreams();
    return streams[0];
  }

  addVideo(container) {
    let remoteVideosContainer;
    remoteVideosContainer = document.getElementById(container);
    let remoteStream;
    remoteStream = this.getStream('ARDAMS');
    let num;
    num = remoteVideosContainer.children.length;
    if (num === 0) {
      let remoteVideoEL;
      remoteVideoEL = document.createElement('video');
      remoteVideoEL.id = container + 'Video';
      remoteVideoEL.autoplay = true;
      remoteVideoEL.controls = true;
      attachMediaStream(remoteVideoEL, remoteStream);
      remoteVideosContainer.appendChild(remoteVideoEL);
    }
  }
}
