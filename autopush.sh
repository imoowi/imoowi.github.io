#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "PostgreSQL 转换工具 pgloader"
git push origin gh-pages