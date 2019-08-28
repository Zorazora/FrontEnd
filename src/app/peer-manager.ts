import {SocketUtil} from './socket-util';
import {Peer} from './peer';

export class PeerManager {
  public static peerManager: PeerManager;
  public localId: string;
  public config = {
    peerConnectionConfig: {
      iceServers: [
        {url: 'stun:23.21.150.121'},
        {url: 'stun:stun.l.google.com:19302'}
      ]
    },
    peerConnectionConstraints: {
      optional: [
        {DtlsSrtpKeyAgreement: true}
      ]
    }
  };
  public peerMap = {};
  public localStream;
  public socketUtil = new SocketUtil();
  public socket = this.socketUtil.getSocket();

  constructor() {
    let this1; this1 = this;
    this.socket.on('message', message => {
      const type = message.type;
      const from = message.from;
      console.log(this.peerMap)
      let pc; pc = (this1.peerMap[from] || this1.addPeer(from)).pc;
      console.log('received ' + type + ' from ' + from);
      switch (type) {
        case 'init':
          this.toggleLocalStream(pc);
          this.offer(from);
          break;
        case 'offer':
          pc.setRemoteDescription(new RTCSessionDescription(message.payload), () => {}, this1.error);
          this.answer(from);
          break;
        case 'answer':
          pc.setRemoteDescription(new RTCSessionDescription(message.payload), () => {}, this1.error);
          break;
        case 'candidate':
          if (pc.remoteDescription) {
            pc.addIceCandidate(new RTCIceCandidate({
              sdpMLineIndex: message.payload.label,
              sdpMid: message.payload.id,
              candidate: message.payload.candidate
            }), () => {}, this1.error);
          }
          break;
      }
    });
    this.socket.on('id', id => {
      this.localId = id;
    });
  }

  public static getInstance() {
    if (PeerManager.peerManager == null) {
      PeerManager.peerManager = new PeerManager();
    }

    return PeerManager.peerManager;
  }

  addPeer(remoteId) {
    let peer; peer = new Peer(this.config.peerConnectionConfig, this.config.peerConnectionConstraints, remoteId, this.socketUtil);
    this.peerMap[remoteId] = peer;
    return peer;
  }

  answer(remoteId) {
    let pc; pc = this.peerMap[remoteId].pc;
    pc.createAnswer(
      sessionDescription => {
        pc.setLocalDescription(sessionDescription);
        this.socketUtil.sendInfo('answer', remoteId, sessionDescription);
      },
      this.error
    );
  }

  offer(remoteId) {
    let pc; pc = this.peerMap[remoteId].pc;
    pc.createOffer(
      sessionDescription => {
        pc.setLocalDescription(sessionDescription);
        this.socketUtil.sendInfo('offer', remoteId, sessionDescription);
      },
      this.error
    );
  }

  handleMessage(message) {
    const type = message.type;
    const from = message.from;
    console.log(this.peerMap)
    let pc; pc = (this.peerMap[from] || this.addPeer(from)).pc;
    console.log('received ' + type + ' from ' + from);
    switch (type) {
      case 'init':
        this.toggleLocalStream(pc);
        this.offer(from);
        break;
      case 'offer':
        pc.setRemoteDescription(new RTCSessionDescription(message.payload), () => {}, this.error);
        this.answer(from);
        break;
      case 'answer':
        pc.setRemoteDescription(new RTCSessionDescription(message.payload), () => {}, this.error);
        break;
      case 'candidate':
        if (pc.remoteDescription) {
          pc.addIceCandidate(new RTCIceCandidate({
            sdpMLineIndex: message.payload.label,
            sdpMid: message.payload.id,
            candidate: message.payload.candidate
          }), () => {}, this.error);
        }
        break;
    }
  }

  toggleLocalStream(remoteId) {
    let peer; peer = this.peerMap[remoteId] || this.addPeer(remoteId);
    if (this.localStream) {
      (!!peer.pc.getLocalStreams().length) ? peer.pc.removeStream(this.localStream) : peer.pc.addStream(this.localStream);
    }
  }

  error(err) {
    console.error(err);
  }

  sendDataByChannel(data, remoteId) {
    let peer; peer = this.peerMap[remoteId];
    if (peer.getChannelState() !== 'open') {
      console.log('dataChannel:' + peer.getChannelState());
      return;
    }
    peer.sendDataByChannel(data);
  }

  getId() {
    return this.localId;
  }

  setLocalStream(stream) {
    if (!stream) {
      for ( const id of this.peerMap) {
        let pc; pc = this.peerMap[id].pc;
        if (!!pc.getLocalStreams().length) {
          pc.removeStream(this.localStream);
          this.offer(id);
        }
      }
    }

    this.localStream = stream;
  }

  peerInit(remoteId) {
    console.log('peerInit', remoteId);
    let peer; peer = this.peerMap[remoteId] || this.addPeer(remoteId);
    console.log(this.peerMap);
    this.socketUtil.sendInfo('init', remoteId, null);
  }

  peerRenegociate(remoteId) {
    this.offer(remoteId);
  }

  send(type, payload) {
    this.socket.emit(type, payload);
  }

  sendData(data, remoteId) {
    this.sendDataByChannel(data, remoteId);
  }

  getGPS(remoteId) {
    this.sendDataByChannel('GPS', remoteId);
    const peer = this.getPeer(remoteId);
    const position = {longitude: peer.longitude, latitude: peer.latitude};
    return position;
  }

  getPeer(remoteId) {
    return this.peerMap[remoteId];
  }

  getScreen(remoteId) {
    this.sendDataByChannel('screen', remoteId);
  }

  getFrontCamera(remoteId) {
    this.sendDataByChannel('front', remoteId);
  }

  getBackCamera(remoteId) {
    this.sendDataByChannel('back', remoteId);
  }
}
