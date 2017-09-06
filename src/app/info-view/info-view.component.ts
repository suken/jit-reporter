import { Component, OnInit } from '@angular/core';
import {JitService} from "../jit.service";
import {VmInfo} from "../models/vm-info";
import * as hljs from "highlight.js";

@Component({
  selector: 'app-info-view',
  templateUrl: './info-view.component.html',
  styleUrls: ['./info-view.component.css']
})
export class InfoViewComponent implements OnInit {


  private vmInfo: VmInfo;
  info: string;

  constructor(private jitService: JitService) { }

  ngOnInit() {
    this.vmInfo = this.jitService.getVmInfo();
    if (this.vmInfo) {
      this.info = hljs.highlightAuto(JSON.stringify(this.vmInfo, null, 2)).value;
    }
  }

}
