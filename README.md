# Kiva UI

> a.k.a. Uue Lewis and the Views

[![Build Status](https://github.com/kiva/ui/workflows/Ui%20Tests/badge.svg?branch=main)](https://github.com/kiva/ui/actions)
[![Coverage Status](https://coveralls.io/repos/github/kiva/ui/badge.svg?branch=main)](https://coveralls.io/github/kiva/ui?branch=main)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=kiva/ui)](https://dependabot.com)
[![Known Vulnerabilities](https://snyk.io/test/github/kiva/ui/badge.svg)](https://snyk.io/test/github/kiva/ui)

## Contribution Guidelines
The Kiva UI project is bound by a [Code of Conduct](code_of_conduct.md).

Kiva welcomes outside contributions to our UI repository. If you have any ideas for a feature or improvement, create an issue and we can discuss whether it makes sense to create a pull request. Thanks for the help!

# Local Development Setup with Caddy

> IMPORTANT NOTE: Turn off Docker if it's running! We have a perpetually running network related to Tilt that will prevent Caddy from starting. I did consider using Tilt and docker-compose but it would require rewriting a lot of the Monolith TiltVM setup so this just bypasses it all.

### Required Dependencies

1. Add `127.0.0.1 kiva-ui.local` to your `/etc/hosts` file on your mac
	- Auth0 configs are already in place to support this domain in the dev tenant

2. Install Caddy

	 `brew install caddy`

3. Start Caddy from the root of the ui repo

	`caddy start` to run in the background or `caddy run` keep the terminal live for additional monitoring

4. Add config/env file -> create `.config.env` in repo root locally
	```bash
	# Search for values in Slack history or reach out to another engineer
	UI_SESSION_SECRET=X
	UI_AUTH0_CLIENT_SECRET=X
	```

5. In a separate terminal at the root of the ui repo
	``` bash
	# Use/install the required Node version using nvm
	$ nvm i

	# Install dependencies
	$ npm ci

	# Install husky git hooks (NOTE: This step only needs to be done once on first setup and powers pre-commit linting)
	$ npx husky install

	$ npm run dev -- --config=dev-custom-host

	# The local dev URL is now: https://kiva-ui.local/, but make sure to access a page actually run by UI, for example https://kiva-ui.local/lend-by-category/women

	```

5. To stop Caddy when you're done

	`caddy stop`


## Build Setup for localhost develoment (outside of a Tilt or Server environments)

``` bash
# DEV MODE

# use/install the required Node version using nvm
$ nvm i

# install dependencies
$ npm ci

# install husky git hooks (powers pre-commit linting)
$ npx husky install

# serve with hot reload at localhost:8888
$ npm run dev -- --config=local
# visit localhost:8888 for the home page
# visit localhost:8888/ui-site-map to explore our page index
# /styleguide, /lend-by-category, + /lend/filter are great to explore

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

# use/install the required Node version using nvm
$ nvm i

# install dependencies
$ npm ci

# optionally install husky git hooks
$ npx husky install

# serve with hot reload at localhost:8888
$ npm run dev
$ npm run dev -- --config=local (any context outside of kiva vm)
# visit localhost:8888/ui-site-map to explore some pages (/styleguide or /lend-by-category may be of interest)

# Alternate configs:
# use `dev-local` to run localhost mode against development Environments
# use `dev-vm-mac` to run ui on your mac against the kiva vm

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
