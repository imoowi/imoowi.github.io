#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "Golang-搭建私有proxy"
git push origin gh-pages