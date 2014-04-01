#!/bin/bash

CWD=$1
BRANCH=$2
REMOTE_URL=$3
REMOTE='deploy'

cd $CWD
rm -rf .git
git init .
git add .
git commit -m "Automated commit"
git checkout -b $BRANCH
git remote add deploy $REMOTE_URL
git push -f $REMOTE $BRANCH