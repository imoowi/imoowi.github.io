#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "添加 Swarm集群管理"
git push origin gh-pages