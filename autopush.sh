#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "手把手教你-golang"
git push origin gh-pages