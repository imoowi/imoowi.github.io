#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "添加手把手教你-Golang-基础"
git push origin gh-pages