#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "添加 Go语言学习大纲"
git push origin gh-pages