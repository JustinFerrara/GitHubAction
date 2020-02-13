#!/usr/bin/env bash
echo "Hello world"

# echo $(git diff --name-only | sed -n -e 's/^\* \(.*\)/\1/p');
echo $(git diff --name-only);
