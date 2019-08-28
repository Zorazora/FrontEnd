import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';

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

  constructor(private router: Router, private http: HttpClient, private message: NzMessageService) { }

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
    console.log(roomInfo);
    this.http.post('/api/room/createRoom', roomInfo).subscribe(data => {
      console.log(data);
      this.visible = false;
      let this1;
      this1 = this;
      this1.loadData();
    }, error => {
      console.log(error);
    });
  }

  loadData(): void {
    this.http.post('/api/room/roomList', {username: sessionStorage.getItem('username')}).subscribe(data => {
      this.roomList = data.roomList;
      console.log(this.roomList);
    }, error => {
      console.log(error);
    });
  }

  deleteRoom(room): void {
    this.http.post('/api/room/roomList/delete/', {roomId: room}).subscribe(data => {
      if (data.message === 'SUCCESS') {
        this.message.create('success', 'Delete Successfully');
        this.loadData();
      } else {
        this.message.create('warning', 'Server wrong');
        this.loadData();
      }
    }, error => {
      console.log(error);
    });
  }

  enterRoom(roomId, roomType): void {
    if (roomType === 'monitor') {
      this.router.navigate(['/monitorRoom/' + roomId]);
    } else {
      this.router.navigate(['/punchRoom/' + roomId]);
    }
  }
}
