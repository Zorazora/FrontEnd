import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  createRoom(): void {
    let roomInfo;
    roomInfo = {};
    roomInfo.type = this.roomType;
  }

}
