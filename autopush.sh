#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "更新 Git操作命令"
git push origin gh-pages