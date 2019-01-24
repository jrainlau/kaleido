#!/bin/sh

cd release && npm i
electron-packager . Kaleido --platform=darwin --icon=./icon.icns --overwrite
