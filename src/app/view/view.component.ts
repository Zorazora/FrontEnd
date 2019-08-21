import { Component, Input, OnInit } from '@angular/core';
import {PeerManager} from '../peer-manager';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  @Input() streamId: string;
  public loading = true;
  public client;

  constructor() { }

  ngOnInit() {
    this.client = new PeerManager();
    this.client.peerInit(this.streamId);
    let listening;
    listening = setInterval(() => {
      let state;
      state = this.client.getPeer(this.streamId).getChannelState();
      if (state === 'open') {
        setTimeout(() => {
          this.client.getScreen(this.streamId);
          clearInterval(listening);
        }, 1000);
      }
    }, 500);
  }

}
