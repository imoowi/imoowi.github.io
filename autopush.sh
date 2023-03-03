#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "Golang-Swagger(api文档生成器)"
git push origin gh-pages