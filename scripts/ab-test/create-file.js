/* eslint no-console: 0 */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const abTests = require('./tests');

const VARIABLE_RANDOM_INTEGER = 'var.random_integer';
const showOutput = process.env.OUTPUT || false;

// Iterate a set of variants for each test
const createVariants = test => {
  if (!test.variant || Object.keys(test.variant).length < 2) throw Error(`Invalid variant configuration ${JSON.stringify(test)}`);

  return Object.keys(test.variant).reduce((acc, variant, index, sourceVariants) => {
    const variantPercent = test.variant[variant];
    acc.percent += variantPercent;

    const isLast = index === sourceVariants.length - 1;
    let condition = '';
    let expression = ` (${VARIABLE_RANDOM_INTEGER} <= ${acc.percent})`;

    if (index === 0) {
      condition = 'if';
    } else if (!isLast) {
      condition = 'elseif';
    } else {
      condition = 'else';
      expression = '';
    }

    acc.string += `
        ${condition}${expression} {
          set req.http.X-ABTest-${test.id} = "${variant}";
        }`;

    return acc;
  }, { string: '', percent: 0 }).string;
};

// Iterate a set of tests for a site
const siteTests = tests => tests.reduce((acc, test) => {
  if (!test.id) throw new Error(`Missing test id ${JSON.stringify(test)}`);
  return `${acc}\n
    if (!req.http.X-ABTest-${test.id}) {
      set ${VARIABLE_RANDOM_INTEGER} = randomint(1, 100);

      if (!req.http.Cookie:_ABTest_${test.id}) {
        ${createVariants(test)}
      }
      else {
        set req.http.X-ABTest-${test.id} = req.http.Cookie:_ABTest_${test.id};
      }
    }\n`;
}, '');

const createFile = () => {
  // Attempt to build the script
  try {
    const script = `// RECV
sub req_ab_test_segment_user {
  declare local ${VARIABLE_RANDOM_INTEGER} INTEGER;

  if (req.http.host ~ ".businessinsider.com") {${siteTests(abTests.bi)}
  }
  elseif (req.http.host ~ ".insider.com") {${siteTests(abTests.ins)}
  }
  ${siteTests(abTests.both)}
}`;

    console.log(chalk.green.bold(`Export to Fastly > ${chalk.reset('Generated VCL Script')}`));

    const directory = path.resolve(__dirname, '../../../fastly/shared'); 
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    const filepath = path.resolve(__dirname, '../../../fastly/shared/sub-ab-testing.vcl');
    fs.writeFileSync(filepath, script);

    console.log(chalk.green.bold(`Export to Fastly > ${chalk.reset('created file')} ${chalk.yellow.bold(filepath)}`));

    if (showOutput) console.log(script);

    return filepath;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = createFile;
