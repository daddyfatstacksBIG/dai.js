#!/bin/bash

if [ "$(basename "$PWD")" != "dai-plugin-migrations" ]; then
  echo "This script must be run from the dai-plugin-migrations directory."
  exit
fi

if [ ! SKIP_VERSION_UPDATE ]; then
  yarn config set version-tag-prefix "dai-plugin-migrations-v"
  yarn config set version-git-message "dai-plugin-migrations-v%s"
  yarn version
fi

./scripts/build.sh
