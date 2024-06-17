#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "添加 InfluxDB2"
git push origin gh-pages