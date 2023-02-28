#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "go-cobra-cli"
git push origin gh-pages