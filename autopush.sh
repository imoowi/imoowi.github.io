#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "Add package and configs"
git push origin gh-pages