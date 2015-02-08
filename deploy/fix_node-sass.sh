#!/usr/bin/env sh

cd node_modules/gulp-sass/node_modules &&
rm -rf node-sass &&

git clone --recursive https://github.com/sass/node-sass.git &&
cd node-sass &&

npm install
node-gyp rebuild &&
npm install &&

popd &&
popd
