import {Component, Input, OnInit} from '@angular/core';
import {Nmethod} from "../models/nmethod";
import {CompilerInfo} from "../models/compiler-info";
import {JitService} from "../jit.service";
import * as hljs from "highlight.js";

@Component({
  selector: 'app-method-info',
  templateUrl: './method-info.component.html',
  styleUrls: ['./method-info.component.css'],
})
export class MethodInfoComponent implements OnInit {

  searchResults: string[];
  method: Nmethod;
  compilerData: string;
  links = [];
  nodes = [];

  constructor(private jitService: JitService) {
  }

  ngOnInit() {
  }

  search(event) {
    this.searchResults = [];
    let query: string = event.query.toString().toLowerCase().replace(/\./g, '/');
    let results = this.jitService.search(query);
    results.forEach(value => this.searchResults.push(value.replace(/\//g, '.')));
  }

  selectMethod(value) {
    this.method = this.jitService.getMethod(value.replace(/\./g, '/'));
    this.links = [];
    this.nodes = [];
    this.updateFlowDiagram();
  }

  updateFlowDiagram() {
    let linkXCoordinates = [120, 240, 420, 600, 780];
    let nodeXCoordinates = [270, 450, 630, 810];
    let colors = ['#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c'];
    console.log(JSON.stringify(this.method));
    let nodeFrom: number = 0;
    for (let index = 0; index < this.method.compilerData.length; index++) {
      let value = this.method.compilerData[index];
      let level = Number.parseInt(value.level);
      this.nodes.push({
        color: colors[nodeFrom],
        x: nodeXCoordinates[nodeFrom],
        title: level,
      });

      let x1 = linkXCoordinates[nodeFrom];
      let x2 = linkXCoordinates[nodeFrom + 1];
      this.links.push({x1: x1, x2: x2});
      nodeFrom += 1;
    }

    console.log("Nodes = " + JSON.stringify(this.nodes));
    console.log("Links = " + JSON.stringify(this.links));
  }

  hasCompilerData(level: number): CompilerInfo {
    return this.method.compilerData.find(value => Number.parseInt(value.level) === level);
  }

  selectLevel(level: number) {
    this.compilerData = hljs.highlightAuto(this.jitService.getCompileTask(this.hasCompilerData(level).id)).value;
    console.log(this.compilerData);
  }
}
