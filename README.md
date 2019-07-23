# Kiva UI

> a.k.a. Uue Lewis and the Views

[![Build Status](https://travis-ci.org/kiva/ui.svg?branch=master)](https://travis-ci.org/kiva/ui)
[![Coverage Status](https://coveralls.io/repos/github/kiva/ui/badge.svg?branch=master)](https://coveralls.io/github/kiva/ui?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/kiva/ui.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/kiva/ui/badge.svg)](https://snyk.io/test/github/kiva/ui)

## Build Setup


``` bash
# Note: Kiva server only tool
# script to get status / get log / restart server / start_local
# copy to user home directory for global use

$ ./ui-server.sh {status|log|restart|local|start_local}

# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm run dev
$ npm run dev -- --config=local (any context outside of kiva vm)

# build for production with minification
$ npm run build

# build for production and view the bundle analyzer report
$ npm run build --report

# run unit tests
$ npm run unit

# run all tests
$ npm test
```

For some more details, checkout the [template this is based on](http://vuejs-templates.github.io/webpack/) and the [docs for vue-loader](http://vuejs.github.io/vue-loader).

