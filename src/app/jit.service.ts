import {Injectable} from '@angular/core';
import * as xml2js from 'xml2js';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Summary} from "./models/summary";
import {Nmethod} from "./models/nmethod";
import {isUndefined} from "util";
import {CompilerInfo} from "./models/compiler-info";

@Injectable()
export class JitService {

  constructor() { }

  private progress: Subject<number> = new Subject<number>();
  private summary: Summary;
  private methods: Nmethod[];
  private tasks: any[];
  private popularPackages;

  status: Observable<number> = this.progress.asObservable();

  processFile(file: File) {
    this.summary = null;
    this.methods = [];
    this.tasks = [];
    this.popularPackages = null;

    let reader = new FileReader();
    let self = this;
    reader.onload = () => {
      // this 'text' is the content of the file
      xml2js.parseString(reader.result, function (err, result) {
        self.processSummary(result);
        self.progress.next(100);
      });
    };
    reader.readAsText(file);
  }

  private processSummary(data: any) {
    let nmethods: any[] = data.hotspot_log.tty[0].nmethod;
    this.summary = new Summary();
    this.summary.totalCompiledMethods = nmethods.length;
    this.summary.c1CompiledMethods = 0;
    this.summary.c2CompiledMethods = 0;
    this.summary.level1Methods = 0;
    this.summary.level2Methods = 0;
    this.summary.level3Methods = 0;
    this.summary.level4Methods = 0;
    this.popularPackages = [];

    let packagesMap = new Map<string, number>();
    let methodsMap = new Map<string, Nmethod>();

    nmethods.forEach(
      nm => {
        let nmethod = nm.$;

        this.updateCompilerSummary(nmethod);

        let methodName: string = nmethod.method;
        let method = methodsMap.get(methodName);

        if (isUndefined(method)) {
          method = new Nmethod();
          method.name = methodName;
          methodsMap.set(methodName, method);

          let splits: string[] = methodName.split(" ");
          method.method = splits[1];
          if (splits[2]) {
            nmethod.name += ' ' + splits[2];
          }

          let classSplits = splits[0].split("/");
          let length = classSplits.length;
          method.clazz = classSplits[length - 1];
          method.package = this.extractPackageName(classSplits);
        }

        // update the package map
        let packages: string[] = method.package.split(".");
        let key = method.package;
        if (packages.length > 2) {
          key = packages[0] + '.' + packages[1];
        }
        (packagesMap.has(key)) ? packagesMap.set(key, packagesMap.get(key) + 1) : packagesMap.set(key, 1);

        // get compiler info
        if (isUndefined(method.compilerData)) {
          method.compilerData = [];
        }
        let info: CompilerInfo = new CompilerInfo();
        info.id = nmethod.compile_id;
        info.compiler = nmethod.compiler;
        info.level = nmethod.level;
        info.count = nmethod.count;
        info.iicount = nmethod.iicount;
        info.size = nmethod.size;
        method.compilerData.push(info);
      });

    packagesMap.forEach((value, key) => this.popularPackages.push({name: key, methods: value}));
    this.popularPackages = this.popularPackages.sort(function(a, b) {return b.methods - a.methods;});
    this.summary.popularPackages = this.popularPackages.slice(0, 5);

    methodsMap.forEach((value, key) => this.methods.push(value));

    this.extractCompilationTaskData(data);

    data = null;
  }

  private extractCompilationTaskData(data: any) {
    let compilationThreads: any[] = data.hotspot_log.compilation_log;
    compilationThreads.forEach(compilationThread => {
      let compilation_tasks: any[] = compilationThread.task;
      compilation_tasks.forEach(task => {
        this.tasks.push({
          id: Number.parseInt(task.$.compile_id),
          data: JSON.stringify(task, null, 2)
        });
      });
    });
    console.log("total tasks = " + this.tasks.length);

    // sort tasks for faster lookups
    this.tasks.sort(function(a, b) {return a.id - b.id;});
  }

  private updateCompilerSummary(nmethod: any) {
    if (nmethod.compiler === 'C1') {
      this.summary.c1CompiledMethods++;
    }
    else if (nmethod.compiler === 'C2') {
      this.summary.c2CompiledMethods++;
    }

    if (nmethod.level === "1") {
      this.summary.level1Methods++;
    }
    else if (nmethod.level === "2") {
      this.summary.level2Methods++;
    }
    else if (nmethod.level === "3") {
      this.summary.level3Methods++;
    }
    else if (nmethod.level === "4") {
      this.summary.level4Methods++;
    }
  }

  private extractPackageName(packageStr: string[]):string {
    let packageName: string = '';
    let length = packageStr.length;
    if (length > 1) {
      packageStr.slice(0, length - 2).forEach(value => packageName += value + '.');
      packageName = packageName.slice(0, packageName.length -  1);
    }
    return packageName;
  }

  getSummary(): Summary {
    return this.summary;
  }

  search(query: string): string[] {
    return this.methods.filter(method => method.name.toLowerCase().indexOf(query) > -1).map(m => m.name);
  }

  getMethod(value: string): Nmethod {
    return this.methods.find(m => m.name === value);
  }

  getCompileTask(id: string): string {
    console.log("Searching for task = " + id);
    return this.tasks[Number.parseInt(id)].data;
  }

  getPackages(): any[]  {
    return this.popularPackages;
  }
}
