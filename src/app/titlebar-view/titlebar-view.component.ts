import {Component, OnInit} from '@angular/core';
import {OverlayPanel} from "primeng/primeng";
import {JitService} from "../jit.service";

@Component({
  selector: 'app-titlebar-view',
  templateUrl: './titlebar-view.component.html',
  styleUrls: ['./titlebar-view.component.css']
})
export class TitlebarViewComponent implements OnInit {

  fileName: string;

  loading: boolean = false;

  constructor(private jitService: JitService) {
    this.jitService.status.subscribe((status: number) => {
      if (status === 100) {
        this.loading = false;
      }
    });
  }

  ngOnInit() {
  }

  uploadLogFile(event, op: OverlayPanel) {
    op.hide();
    this.loading = true;
    this.fileName = event.files[0].name;
    this.jitService.processFile(event.files[0]);
  }
}
