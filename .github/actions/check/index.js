const core = require('@actions/core');
// const github = require('@actions/github');

const createFile = require('../../../scripts/ab-test/create-file');

console.log('HERE WE ARE IN THE CHECK ACTION');

console.log('WHY');
// const token = core.getInput('github_token');
// console.log('token', token);

// console.log(core);
// console.log(github);

// const branch = core.getInput('branch');

// console.log(branch);

// console.log(github.context);
// console.log(github.context.repo);

const filePath = createFile();

console.log(filePath)