#!/usr/bin/env sh

pushd $(pwd) &&

cd node_modules/gulp-sass/node_modules &&

if [ ! -d node-sass/.git ]
then
  rm -rf node-sass &&

  git clone --recursive https://github.com/sass/node-sass.git &&
  cd node-sass &&

  npm install
  node-gyp rebuild &&
  npm install
fi

popd
