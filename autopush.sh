#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "add Docker里安装gitlab和runner"
git push origin gh-pages