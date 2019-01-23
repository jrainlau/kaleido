#!/bin/sh
npm run build

cp package.json ./dist/package.json
cp electron/app.js ./dist/app.js
cp electron/autoUpdate.js ./dist/autoUpdate.js
cp icon.icns ./dist/icon.icns

rm -rf ./release &&  mkdir ./release
cp -r ./dist/ ./release
