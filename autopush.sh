#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "react 最佳实践"
git push origin gh-pages