#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "update Golang-6、Comer"
git push origin gh-pages