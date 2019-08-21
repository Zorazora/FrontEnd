import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-frontcam',
  templateUrl: './frontcam.component.html',
  styleUrls: ['./frontcam.component.css']
})
export class FrontcamComponent implements OnInit {
  @Input() streamId: string;

  constructor() { }

  ngOnInit() {
  }

}
