import { Component, Input, OnInit } from '@angular/core';
import {PeerManager} from '../peer-manager';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
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
          peer.addVideo('remoteVideosContainer');
          this.client.getScreen(this.streamId);
        }, 1000);
      }
    }, 500);
  }

  captureImage(): void {
    let video;
    video = document.getElementById('remoteVideosContainerVideo');
    if (video !== null) {
      let canvas;
      canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      let image;
      image = document.createElement('img');
      image.src = canvas.toDataURL('image/jpeg');
      let a; a = document.createElement('a');
      let event; event = new MouseEvent('click');
      let date; date = new Date();
      let name; name = date.getFullYear().toString() + (date.getMonth() + 1).toString() + (date.getDate()).toString();
      a.download = name;
      a.href = canvas.toDataURL('image/jpeg');
      a.dispatchEvent(event);
    }
  }

}
