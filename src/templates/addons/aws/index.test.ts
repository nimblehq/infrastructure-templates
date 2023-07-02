import { prompt } from 'inquirer';

import { GeneralOptions } from '@/commands/generate';
import { remove } from '@/helpers/file';

import { generateAwsTemplate } from '.';
import { applyAdvancedTemplate } from './advanced';
import {
  applyTerraformAWS,
  applyRegion,
  applySecurityGroup,
  applyVpc,
} from './modules';

jest.mock('./advanced');
jest.mock('./modules');
jest.mock('inquirer');

describe('AWS template', () => {
  describe('generateAwsTemplate', () => {
    const projectDir = 'aws-advanced-test';
    const region = 'ap-southeast-1';
    const infrastructureType = 'advanced';
    const options: GeneralOptions = {
      projectName: projectDir,
      provider: 'aws',
    };

    const awsOptions = {
      ...options,
      infrastructureType: infrastructureType,
      awsRegion: region,
    };

    describe('given infrastructureType is advanced', () => {
      beforeAll(async () => {
        (prompt as unknown as jest.Mock).mockResolvedValue({
          infrastructureType: infrastructureType,
          awsRegion: region,
        });

        await generateAwsTemplate(options);
      });

      afterAll(() => {
        jest.clearAllMocks();
        remove('/', projectDir);
      });

      it('applies common add-on', () => {
        expect(applyTerraformAWS).toHaveBeenCalledWith(awsOptions);
      });

      it('applies region add-on', () => {
        expect(applyRegion).toHaveBeenCalledWith(awsOptions);
      });

      it('applies VPC add-on', () => {
        expect(applyVpc).toHaveBeenCalledWith(awsOptions);
      });

      it('applies security group add-on', () => {
        expect(applySecurityGroup).toHaveBeenCalledWith(awsOptions);
      });

      it('applies advanced add-ons', async () => {
        await generateAwsTemplate(options);

        expect(applyAdvancedTemplate).toHaveBeenCalled();
      });
    });
  });
});
