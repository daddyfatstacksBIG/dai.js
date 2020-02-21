#!/bin/bash

if [ "$(basename "$(dirname "$PWD")")" != "packages" ]; then
  echo "This script must be run from a directory under packages/."
fi

PACKAGE=$(basename "$PWD")
echo "Building $PACKAGE..."

rm -rf dist/*
../../node_modules/.bin/babel --no-babelrc -d dist src
