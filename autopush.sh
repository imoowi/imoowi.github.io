#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "添加 高级操作记录"
git push origin gh-pages