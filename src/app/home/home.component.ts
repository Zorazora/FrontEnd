import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loading = false;
  private roomId;
  private roomInfo = {};

  constructor(public router: Router, private http: HttpClient, private routeInfo: ActivatedRoute) {}

  ngOnInit() {
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
    }, error => {
      console.log(error);
    });
  }

  routeToNav(stream): void {
    console.log('hi');
    sessionStorage.setItem(stream.id, JSON.stringify(stream));
    this.router.navigate(['/navigation/' + stream.id]);
  }

  getCode(room): void {
    this.http.post('/api/room/roomCode', {roomId: room}).subscribe(data => {
      this.roomInfo.code = data.roomCode;
    }, error => {
      console.log(error);
    });
  }
}
