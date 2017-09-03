import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AutoCompleteModule, ChartModule, DataGridModule, FileUploadModule, OverlayPanelModule, PanelModule} from "primeng/primeng";
import {JitService} from "./jit.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MethodInfoComponent} from './method-info/method-info.component';
import {PackageViewComponent} from './package-view/package-view.component';
import {SummaryViewComponent} from './summary-view/summary-view.component';
import {RouterModule, Routes} from "@angular/router";
import { GraphViewComponent } from './graph-view/graph-view.component';
import { TitlebarViewComponent } from './titlebar-view/titlebar-view.component';
import { InfoViewComponent } from './info-view/info-view.component';

const appRoutes: Routes = [
  {path: 'methods', component: MethodInfoComponent, outlet: 'views'},
  {path: 'packages', component: PackageViewComponent, outlet: 'views'},
  {path: 'graphs', component: GraphViewComponent, outlet: 'views'},
  {path: 'info', component: InfoViewComponent, outlet: 'views'},
];

export const routing = RouterModule.forRoot(appRoutes, { enableTracing: true });

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MethodInfoComponent,
    PackageViewComponent,
    SummaryViewComponent,
    GraphViewComponent,
    TitlebarViewComponent,
    InfoViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FileUploadModule,
    PanelModule,
    ChartModule,
    AutoCompleteModule,
    OverlayPanelModule,
    DataGridModule,
    RouterModule,
    routing
  ],
  providers: [JitService],
  bootstrap: [AppComponent]
})
export class AppModule { }
