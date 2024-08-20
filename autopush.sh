#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "添加 Gitlab.CI.创建发布包"
git push origin gh-pages