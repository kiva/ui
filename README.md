# Kiva UI

> a.k.a. Uue Lewis and the Views

[![Build Status](https://travis-ci.org/kiva/ui.svg?branch=master)](https://travis-ci.org/kiva/ui)
[![Coverage Status](https://coveralls.io/repos/github/kiva/ui/badge.svg?branch=master)](https://coveralls.io/github/kiva/ui?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/kiva/ui.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/kiva/ui/badge.svg)](https://snyk.io/test/github/kiva/ui)

## Build Setup for localhost (outside of a Kiva VM or Server)

``` bash
# DEV MODE

# install dependencies
$ npm install

# serve with hot reload at localhost:8888
$ npm run dev -- --config=local
# visit localhost:8888 for the home page
# visit localhost:8888/ui-site-map to explore our page index
# /styleguide, /lend-by-category, + /lend/filter are of great to explore

# COMPILED/PROD MODE

# build for production with minification
$ npm run build

# build for production and view the bundle analyzer report
$ npm run build --report

# start the server using compiled build
$ npm start -- --config=local
# visit localhost:8888/ui-site-map to explore some pages (/styleguide or /lend-by-category may be of interest)

# run unit tests
$ npm run unit

# run all tests
$ npm test
```

## Build Setup in Kiva VM or Environments

``` bash
# DEV MODE

# Note: Kiva server only tool
# script to get status / get log / restart server / start_local
# copy to user home directory for global use

$ ./ui-server.sh {status|log|restart|local|start_local}

# install dependencies
$ npm install

# serve with hot reload at localhost:8888
$ npm run dev
$ npm run dev -- --config=local (any context outside of kiva vm)
# visit localhost:8888/ui-site-map to explore some pages (/styleguide or /lend-by-category may be of interest)

# COMPILED/PROD MODE

# build for production with minification
$ npm run build

# build for production and view the bundle analyzer report
$ npm run build --report

# start the server using compiled build
$ npm start -- --config=local
# visit localhost:8888/ui-site-map to explore some pages (/styleguide or /lend-by-category may be of interest)

# run unit tests
$ npm run unit

# run all tests
$ npm test
```

For some more details, checkout the [template this is based on](http://vuejs-templates.github.io/webpack/) and the [docs for vue-loader](http://vuejs.github.io/vue-loader).

