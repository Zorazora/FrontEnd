import { Component, OnInit } from '@angular/core';
import {PeerManager} from '../peer-manager';

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.css']
})
export class GpsComponent implements OnInit {
  public mediaConfig = {
    audio: true,
    video: {
      mandatory: {},
      optional: []
    }
  };
  public client;

  constructor() {
    this.client = new PeerManager();
  }

  ngOnInit() {
  }

}
