const core = require('@actions/core');
const github = require('@actions/github');

const check = require('scripts/check');

console.log('HERE WE ARE IN THE CHECK ACTION');

console.log(core);
console.log(github);

const branch = core.getInput('branch');

console.log(branch);

console.log(github.context);

check();