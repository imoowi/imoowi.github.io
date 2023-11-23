#!/bin/bash
git status

git checkout gh-pages
git pull 
git add .
git commit -m "用ElectronForge把单页面应用html打包成exe"
git push origin gh-pages