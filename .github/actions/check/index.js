const core = require('@actions/core');
const github = require('@actions/github');

console.log('HERE WE ARE IN THE CHECK ACTION');

console.log(core);
console.log(github);

const branch = core.getInput('branch');

console.log(branch);