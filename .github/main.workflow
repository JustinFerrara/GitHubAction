workflow "push" {
  on = "push"
  resolves = "test"
}

action "test" {
  uses = "./.github/actions/test"
}
