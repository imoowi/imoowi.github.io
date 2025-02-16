#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "update home"
git push origin gh-pages