#!/bin/sh

cp package.json ./dist/package.json
cp electron/app.js ./dist/app.js
cp icon.icns ./dist/icon.icns

if [[ ! -d "./release" ]]; then
  mkdir ./release
fi
cp -r ./dist/ ./release

cd dist && npm i
electron-packager . Kaleido --platform=darwin --appVersion: "Copyright(C) 2019 Jrainlau" --icon=./icon.icns --overwrite
