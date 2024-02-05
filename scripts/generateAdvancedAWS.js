const {
  applyTerraformCore
} = require('../dist/generators/terraform/index.js');
const {
  applyTerraformAwsProvider,
  applyAwsIamUserAndGroup,
  applyAwsRegion,
  applyAwsSecurityGroup,
  applyAwsVpc,
} = require('../dist/generators/addons/aws/modules/index.js');
const { applyAdvancedTemplate } = require('../dist/generators/addons/aws/advanced.js');

(async () => {
    const options = { projectName: 'aws-advanced-test'}

    await applyTerraformCore(options);
    await applyTerraformAwsProvider(options);
    await applyAwsRegion(options);
    await applyAwsVpc(options);
    await applyAwsSecurityGroup(options);
    await applyAwsIamUserAndGroup(options);
    await applyAdvancedTemplate(options);
})();
