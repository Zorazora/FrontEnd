import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router, Params, ActivatedRoute} from '@angular/router';
import {PeerManager} from '../peer-manager';

@Component({
  selector: 'app-punch',
  templateUrl: './punch.component.html',
  styleUrls: ['./punch.component.css']
})
export class PunchComponent implements OnInit {
  private roomInfo = {};
  private roomId;
  private client;

  constructor(private http: HttpClient, private router: Router, private routeInfo: ActivatedRoute) { }

  ngOnInit() {
    this.client = PeerManager.getInstance();
    if (sessionStorage.getItem('username') === null) {
      this.router.navigate(['login']);
    }
    this.routeInfo.params.subscribe((params: Params) => {
      this.roomId = params.roomId;
    });
    console.log(this.roomId);
    this.loadData();
  }

  loadData(): void {
    this.http.post('/api/room/', {roomId: this.roomId}).subscribe(data => {
      console.log(data);
      this.roomInfo = data;
      for ( const i of this.roomInfo.streamList) {
        this.client.peerInit(i.id);
      }
    }, error => {
      console.log(error);
    });
  }

  getCode(room): void {
    this.http.post('/api/room/roomCode', {roomId: room}).subscribe(data => {
      this.roomInfo.code = data.roomCode;
    }, error => {
      console.log(error);
    });
  }
}
