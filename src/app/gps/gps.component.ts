import {Component, Input, OnInit} from '@angular/core';
import {PeerManager} from '../peer-manager';

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.css']
})
export class GpsComponent implements OnInit {
  @Input() streamId: string;
  public mediaConfig = {
    audio: true,
    video: {
      mandatory: {},
      optional: []
    }
  };
  public client;

  constructor() {
  }

  ngOnInit() {
    this.client = new PeerManager();
    this.client.peerInit(this.streamId);
    console.log(this.client.getGPS(this.streamId));
    let listening;
    listening = setInterval(() => {
      let coordinate;
      coordinate = this.client.getGPS(this.streamId);
      if (coordinate.longitude !== undefined) {
        console.log(coordinate);
        clearInterval(listening);
      }
    }, 500);
  }

}
