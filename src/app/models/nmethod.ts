import {CompilerInfo} from "./compiler-info";

export class Nmethod {
  name: string;
  method: string;
  clazz: string;
  package: string;
  compilerData: CompilerInfo[];
}
