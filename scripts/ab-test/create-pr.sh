#!/bin/sh

# Get/Set all necessary variables
file_name="sub-ab-testing.vcl"
base_path_varnish=$1
base_path_fenrir=$2
branch_prefix=$3
branch="$branch_prefix-ab-test-vcl-script"

file_path_varnish="$base_path_varnish/fastly/shared/$file_name"
file_path_fenrir="$base_path_fenrir/scripts/ab-test/$file_name"

function getBranch() {
  echo $(git branch | sed -n -e 's/^\* \(.*\)/\1/p');
}

# Add the new file to Varnish
cd $base_path_varnish;
echo "\033[1;32mExport to Fastly >\033[0m cd $(pwd)"

# Get latest master
git checkout master > /dev/null 2>&1

branchCheck=$(getBranch)

if [ $branchCheck != "master" ]; then
  echo "\033[31mExport to Fastly > ERROR:\033[0m could not \033[1;33m'git checkout master'\033[0m, on branch \033[1;32m$branchCheck\033[0m"
  exit 1;
fi

echo "\033[1;32mExport to Fastly >\033[0m on branch master";

# TODO: Add condition and exit if response contains fatal
echo "\033[1;32mExport to Fastly >\033[0m pull latest";
git pull > /dev/null 2>&1

echo "\033[1;32mExport to Fastly >\033[0m delete existing remote branch";
git push origin --delete "$branch" > /dev/null 2>&1

# TODO: Add condition and only run if branch in list
echo "\033[1;32mExport to Fastly >\033[0m force delete existing local branch";
git branch -D "$branch" > /dev/null 2>&1

# Copy the file from Fenrir to Varnish
echo "\033[1;32mExport to Fastly >\033[0m copying new file to Varnish repo";
cp -f "$file_path_fenrir" "$file_path_varnish";

# Checkout a new branch to commit changes to
git checkout -b "$branch" > /dev/null 2>&1

branchCheck=$(getBranch)

if [ $branchCheck != $branch ]; then
  echo "\033[31mExport to Fastly > ERROR:\033[0m could not \033[1;33m'git checkout -b $branch'\033[0m, on branch \033[1;32m$branchCheck\033[0m"
  exit 1;
fi

echo "\033[1;32mExport to Fastly >\033[0m created new branch \033[1;33m$branchCheck\033[0m"

git add "fastly/shared/$file_name" > /dev/null 2>&1
echo "\033[1;32mExport to Fastly >\033[0m staged file \033[1;33m$file_name\033[0m"

git commit -m 'Update AB Test VCL' > /dev/null 2>&1
echo "\033[1;32mExport to Fastly >\033[0m committed changes"

# TODO: Add condition and exit if contains fatal
git push -u origin "$branch" > /dev/null 2>&1
echo "\033[1;32mExport to Fastly >\033[0m branch pushed to Varnish origin"