import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  private streamId: string;
  selectedPart = 'gps';

  constructor(private routeInfo: ActivatedRoute, public route: Router) { }

  ngOnInit() {
    this.streamId = this.routeInfo.snapshot.params.id;
    console.log(this.streamId);
  }

}
