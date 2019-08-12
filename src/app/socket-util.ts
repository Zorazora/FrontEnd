import * as io from 'socket.io-client';
export class SocketUtil {
  private url = 'http://localhost:3000';
  private socket;
  constructor() {
    this.socket = io(this.url);
  }

  getSocket() {
    return this.socket;
  }

  sendInfo(type, to, payload) {
    console.log('sending ' + type + ' to ' + to);

    this.socket.emit('message', {
      to,
      type,
      payload
    });
  }
}
