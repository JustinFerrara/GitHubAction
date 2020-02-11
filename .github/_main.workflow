workflow "test-and-deploy" {
  on = "push"
  resolves = "deploy"
}

action "install" {
  uses = "docker://node:11.6.0"
  args = "npm install"
}

action "test" {
  uses = "docker://node:11.6.0"
  args = "npm run test:action"
  needs = ["install"]
}

action "lint" {
  uses = "./.github/actions/jshint"
  needs = ["install"]
}

action "branch-filter" {
  needs = ["test"]
  uses = "actions/bin/filter@master"
  args = "branch master"
  secrets = ["GITHUB_TOKEN"]
}

action "deploy" {
  needs = ["branch-filter"]
  uses = "actions/bin/sh@master"
  args = ["env"]
  secrets = ["GITHUB_TOKEN"]
  env = {
    PHONY_ENV = "foo"
  }
}