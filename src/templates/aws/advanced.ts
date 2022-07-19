import { AwsOptions } from '.';
import { applyAlb, applyBastion, applyCommon, applyEcr, applyEcs, applyLog, applyRds, applyRegion, applyS3, applySecurityGroup, applySsm, applyVpc } from './addons';

export default class Advanced {
  options: AwsOptions;

  constructor(options: AwsOptions) {
    this.options = options;
  }

  static run(options: AwsOptions): void {
    const advanced = new Advanced(options);
    advanced.applyTemplate();
  }

  private applyTemplate(): void {
    applyCommon(this.options);
    applyRegion(this.options);
    applyVpc(this.options);
    applySecurityGroup(this.options);
    applyEcr(this.options);
    applyLog(this.options);
    applyS3(this.options);
    applyAlb(this.options);
    applyRds(this.options);
    applyBastion(this.options);
    applySsm(this.options);
    applyEcs(this.options);
  }
}
