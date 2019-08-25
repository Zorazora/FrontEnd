import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
    if (sessionStorage.getItem('username') === null) {
      this.router.navigate(['login']);
    }
  }

  createRoom(): void {
    let roomInfo;
    roomInfo = {};
    roomInfo.type = this.roomType;
  }

}
