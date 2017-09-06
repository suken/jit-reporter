import {Component, Input, OnInit} from '@angular/core';
import {Summary} from "../models/summary";
import {JitService} from "../jit.service";
import {isUndefined} from "util";

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css']
})
export class GraphViewComponent implements OnInit {

  data: Summary;

  // chart data
  compilerSummary: any = {
    labels: ['Compilers'],
    datasets: [
      {
        label: 'C1',
        backgroundColor: '#FF6384',
        borderColor: '#FF6384',
        data: [0]
      },
      {
        label: 'C2',
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        data: [0]
      }
    ]
  };

  levelSummary: any = {
    labels: ['Levels'],
    datasets: [
      {
        label: 'Level 1',
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        data: [0]
      },
      {
        label: 'Level 2',
        backgroundColor: '#9CCC65',
        borderColor: '#7CB342',
        data: [0]
      },
      {
        label: 'Level 3',
        backgroundColor: '#ff9876',
        borderColor: '#ff8360',
        data: [0]
      },
      {
        label: 'Level 4',
        backgroundColor: '#9e6ccc',
        borderColor: '#7431cc',
        data: [0]
      }
    ]
  };

  constructor(private jitService: JitService) {
  }

  ngOnInit() {
    console.log('Init graph view..');
    this.data = this.jitService.getSummary();
    this.updateGraphData();
  }

  private updateGraphData() {
    if (isUndefined(this.data)) {
      return;
    }
    this.compilerSummary.datasets[0].data = [this.data.c1CompiledMethods];
    this.compilerSummary.datasets[1].data = [this.data.c2CompiledMethods];
    this.levelSummary.datasets[0].data = [this.data.level1Methods];
    this.levelSummary.datasets[1].data = [this.data.level2Methods];
    this.levelSummary.datasets[2].data = [this.data.level3Methods];
    this.levelSummary.datasets[3].data = [this.data.level4Methods];
  }

}
