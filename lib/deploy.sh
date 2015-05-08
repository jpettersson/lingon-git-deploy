#!/bin/bash -e

CWD=$1
BRANCH=$2
REMOTE_URL=$3
REMOTE="deploy"

if [ ! -d "$CWD" ]; then
  echo "$CWD doesn't seem to exist. Make sure you run 'lingon build' before deploying"
  exit 1
fi

cd $CWD
rm -rf .git
git init .
git add .
git commit -m "Automated commit"

if [ $BRANCH != "master" ];
then
  git checkout -b $BRANCH
fi

git remote add deploy $REMOTE_URL
git push -f $REMOTE $BRANCH