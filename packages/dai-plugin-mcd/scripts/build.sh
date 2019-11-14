#!/bin/bash

if [ "$(basename "$PWD")" != "dai-plugin-mcd" ]; then
  echo "This script must be run from the dai-plugin-mcd directory."
  exit
fi

rm -rf dist/*
cd ../..
./node_modules/.bin/babel --no-babelrc -d packages/dai-plugin-mcd/dist packages/dai-plugin-mcd/src
cd - >/dev/null
