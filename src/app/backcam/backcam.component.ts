import {Component, Input, OnInit} from '@angular/core';
import {PeerManager} from '../peer-manager';

@Component({
  selector: 'app-backcam',
  templateUrl: './backcam.component.html',
  styleUrls: ['./backcam.component.css']
})
export class BackcamComponent implements OnInit {
  @Input() streamId: string;
  public client;

  constructor() { }

  ngOnInit() {
    this.client = PeerManager.getInstance();
    this.client.peerInit(this.streamId);
    let listening;
    listening = setInterval(() => {
      let state;
      let peer;
      peer = this.client.getPeer(this.streamId);
      state = peer.getChannelState();
      if (state === 'open') {
        setTimeout(() => {
          peer.addVideo();
          this.client.getBackCamera(this.streamId);
          clearInterval(listening);
        }, 1000);
      }
    }, 500);
  }

}
