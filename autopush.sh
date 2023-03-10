#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "Golang-goRESTApiGen(RESTFUL API 生成器)"
git push origin gh-pages