#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "搭建私有docker镜像服务"
git push origin gh-pages