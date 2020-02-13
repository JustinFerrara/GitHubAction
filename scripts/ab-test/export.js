/* eslint no-console: 0 */
const { exec } = require('child_process');
const chalk = require('chalk');
const config = require('./config');
const createFile = require('./create-file');

const filePath = createFile();

try {
  if (!filePath) {
    // Exit here
    throw new Error('File not created');
  }

  if (
    !config
    || !config.basePathVarnish
    || !config.basePathFenrir
    || !config.branchPrefix
  ) {
    throw new Error(`Invalid GIT configuration ${JSON.stringify(config)}`);
  }

  const padZero = dt => (parseInt(dt, 10) < 10 ? `0${dt}` : dt);

  const datetime = new Date();
  const date = `${datetime.getFullYear()}${padZero(datetime.getMonth() + 1)}${padZero(datetime.getDate())}`;

  const params = `${config.basePathVarnish} ${config.basePathFenrir} ${date}_${config.branchPrefix}`;
  exec(`sh scripts/ab-test/create-pr.sh ${params}`,
    (error, stdout, stderr) => {
      if (stderr) {
        throw new Error(error);
      }
      if (error !== null) {
        throw new Error(error);
      }
      console.log(stdout);
      console.log(chalk.green.bold('Export to Fastly > SUCCESS'));
    });
} catch (error) {
  console.log(chalk.red.bold(`Export to Fastly > FAILED - ${chalk.white.reset(error)}`));
}
