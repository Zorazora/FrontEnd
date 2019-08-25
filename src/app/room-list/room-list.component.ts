import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  public visible = false;
  public isOkLoading = false;
  public roomType;
  public roomList = [];

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    if (sessionStorage.getItem('username') === null) {
      this.router.navigate(['login']);
    }
    this.loadData();
  }

  createRoom(): void {
    let roomInfo;
    roomInfo = {};
    roomInfo.type = this.roomType;
    roomInfo.username = sessionStorage.getItem('username');
  }

  loadData(): void {
    this.http.get('/api/room/roomList', {username: sessionStorage.getItem('username')}).subscribe(data => {
      this.roomList = data.roomList;
      console.log(this.roomList);
      console.log(data.roomList);
    }, error => {
      console.log(error);
    });
  }

}
