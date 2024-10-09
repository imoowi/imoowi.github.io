#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "新增 Golang-工具-deadcode（查找未使用的代码）"
git push origin gh-pages