#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "docker-搭建私有registry"
git push origin gh-pages