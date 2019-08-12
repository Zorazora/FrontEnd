// declare var PeerManager {
//   localId: any;
//   config: any;
//   peerMap: any;
//   localStream: any;
//   socketUtil: any;
//   socket: any;
//   getGPS: (remoteId) => any;
//
//   getId(): string;
//   setLocalStream(stream): void;
//   toggleLocalStream(remoteId): void;
//   peerInit(remoteId): void;
//   peerRenegociate(remoteId): void;
//   send(type, payload): void;
//   sendData(data, remoteId): void;
//   getPeer(remoteId): any;
//   getScreen(remoteId): void;
//   getFrontCamera(remoteId): void;
//   getBackCamera(remoteId): void;
//   test(text): void;
// }
declare var PeerManager: () => {
  getId: () => any;
  setLocalStream: (stream: any) => void;
  toggleLocalStream: (remoteId: any) => void;
  peerInit: (remoteId: any) => void;
  peerRenegociate: (remoteId: any) => void;
  send: (type: any, payload: any) => void;
  sendData: (data: any, remoteId: any) => void;
  getGPS: (remoteId: any) => {
    'longitude': any;
    'latitude': any;
  };
  getPeer: (remoteId: any) => any;
  getScreen: (remoteId: any) => void;
  getFrontCamera: (remoteId: any) => void;
  getBackCamera: (remoteId: any) => void;
  test: (text: string) => void;
};
