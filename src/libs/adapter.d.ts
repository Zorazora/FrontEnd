declare module 'adapter';
declare var RTCPeerConnection: {
    new (configuration?: RTCConfiguration): RTCPeerConnection;
    prototype: RTCPeerConnection;
    generateCertificate(keygenAlgorithm: string | Algorithm): Promise<RTCCertificate>;
    getDefaultIceServers(): RTCIceServer[];
};
declare var getUserMedia: any;
declare var attachMediaStream: any;
declare var reattachMediaStream: any;
declare var webrtcDetectedBrowser: any;
declare var webrtcDetectedVersion: any;
declare function trace(text: any): void;
declare function requestUserMedia(constraints: any): any;
