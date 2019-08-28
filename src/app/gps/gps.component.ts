import {Component, Input, OnInit} from '@angular/core';
import {PeerManager} from '../peer-manager';

declare var BMap: any;

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.css']
})
export class GpsComponent implements OnInit {
  @Input() streamId: string;
  private mediaConfig = {
    audio: true,
    video: {
      mandatory: {},
      optional: []
    }
  };
  private client;
  private loading = true;

  constructor() {
  }

  ngOnInit() {
    this.client = PeerManager.getInstance();
    this.client.peerInit(this.streamId);
    let listening;
    listening = setInterval(() => {
      let coordinate;
      coordinate = this.client.getGPS(this.streamId);
      if (coordinate.longitude !== undefined) {
        let map; map = new BMap.Map('map');
        let longitude; longitude = coordinate.longitude;
        let latitude; latitude = coordinate.latitude;
        console.log(longitude, latitude);
        let point; point = new BMap.Point(longitude, latitude);
        map.centerAndZoom(point, 15);
        map.addControl(new BMap.NavigationControl());
        let convertor; convertor = new BMap.Convertor();
        let pointArr; pointArr = [];
        pointArr.push(point);
        function translateCallback(data) {
          if (data.status === 0) {
            let marker; marker = new BMap.Marker(data.points[0]);
            map.addOverlay(marker);
            map.setCenter(data.points[0]);
          }
        }
        convertor.translate(pointArr, 1, 5, translateCallback);
        this.loading = false;
        clearInterval(listening);
      }
    }, 500);
  }

}
