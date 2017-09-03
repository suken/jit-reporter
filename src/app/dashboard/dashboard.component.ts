import {Component, OnInit} from '@angular/core';
import {JitService} from "../jit.service";
import {Summary} from "../models/summary";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private jitService: JitService) { }

  summary: Summary;

  ngOnInit() {
    this.jitService.status.subscribe((status: number) => {
      if (status === 100) {
        this.summary = this.jitService.getSummary();
      }
    });
  }

}
