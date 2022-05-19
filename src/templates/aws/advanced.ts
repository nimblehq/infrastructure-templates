import * as fs from 'fs';
import path = require('path');

export default class Advanced {
  static run():void {
    this.copyFileSync('skeleton/aws/main.tf', 'main.tf');
    this.copyFileSync('skeleton/aws/outputs.tf', 'outputs.tf');
    this.copyFileSync('skeleton/aws/variables.tf', 'variables.tf');
  }
  
  static copyFileSync(source: string, target: string): void {
    const skeletonPath = path.join(require('app-root-path').path, 'node_modules', 'nimble-infra', 'dist', source);
    
    fs.copyFileSync(skeletonPath, target);
  };
}
