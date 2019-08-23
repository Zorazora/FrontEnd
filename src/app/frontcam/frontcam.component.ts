import { Component, Input, OnInit } from '@angular/core';
import {PeerManager} from '../peer-manager';

@Component({
  selector: 'app-frontcam',
  templateUrl: './frontcam.component.html',
  styleUrls: ['./frontcam.component.css']
})
export class FrontcamComponent implements OnInit {
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
        clearInterval(listening);
        setTimeout(() => {
          peer.addVideo('frontcamContainer');
          this.client.getFrontCamera(this.streamId);
        }, 1000);
      }
    }, 500);
  }

}
