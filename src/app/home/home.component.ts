import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loading = false;
  data = [];

  constructor(public router: Router, private http: HttpClient) {}

  ngOnInit() {
    if (sessionStorage.getItem('userID') === null) {
      this.router.navigate(['login']);
    }
    this.loadData();
  }

  loadData(): void {
    const url = '/streams.json';
    let this1; this1 = this;
    this.http.get(url).subscribe(data => {
      console.log(data);
      this1.data = data;
    }, error => {
      console.log(error);
    });
  }

  routeToNav(stream): void {
    console.log('hi')
    sessionStorage.setItem(stream.id, JSON.stringify(stream));
    this.router.navigate(['/navigation/' + stream.id]);
  }
}
