import { Component, OnInit } from '@angular/core';
import {JitService} from "../jit.service";

@Component({
  selector: 'app-package-view',
  templateUrl: './package-view.component.html',
  styleUrls: ['./package-view.component.css']
})
export class PackageViewComponent implements OnInit {

  packages: any[];

  constructor(private jitService: JitService) { }

  ngOnInit() {
    this.packages = this.jitService.getPackages();
  }

}
