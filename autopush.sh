#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "Golang-微服务实战"
git push origin gh-pages