import {Component, Input, OnInit} from '@angular/core';
import {Summary} from "../models/summary";

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.css']
})
export class SummaryViewComponent implements OnInit {

  @Input()
  summary: Summary;

  constructor() { }

  ngOnInit() {
  }

}
