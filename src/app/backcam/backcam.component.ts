import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-backcam',
  templateUrl: './backcam.component.html',
  styleUrls: ['./backcam.component.css']
})
export class BackcamComponent implements OnInit {
  @Input() streamId: string;

  constructor() { }

  ngOnInit() {
  }

}
