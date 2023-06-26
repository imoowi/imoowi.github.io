#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "add start_local_jekyll_sere.sh"
git push origin gh-pages