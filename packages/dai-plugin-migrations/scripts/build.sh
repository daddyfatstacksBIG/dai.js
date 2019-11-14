#!/bin/bash

if [ "$(basename "$PWD")" != "dai-plugin-migrations" ]; then
  echo "This script must be run from the dai-plugin-migrations directory."
  exit
fi

rm -rf dist/*
cd ../..
./node_modules/.bin/babel --no-babelrc -d packages/dai-plugin-migrations/dist packages/dai-plugin-migrations/src
cd - >/dev/null
