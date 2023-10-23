## Base stage with system dependencies and working directory
FROM node:16.15.0-alpine as base
RUN apk add --no-cache git
RUN apk add --no-cache bash
RUN apk add --no-cache tini
RUN apk add --no-cache make gcc g++ python2 pkgconfig pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev
# Change working directory
RUN mkdir /ui
WORKDIR /ui
# Use Tini for entrypoint, available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "--"]


## Dev stage with all node modules installed
FROM base as dev-dependencies
# Copy only package files so that changes to other files don't cause this step to be repeated
COPY package.json package-lock.json /ui/
# Install all dependencies
RUN HUSKY=0 npm ci


## Unit test stage
FROM dev-dependencies as unit-test
# Copy only files needed for unit testing
COPY babel.config.js /ui/
COPY __mocks__ /ui/__mocks__
COPY config /ui/config
COPY test/unit /ui/test/unit
COPY server /ui/server
COPY src /ui/src
# Run unit tests
RUN npm run unit


## Build stage
FROM dev-dependencies as build
# Copy only files needed for building
COPY babel.config.js tailwind.config.js tailwind.purge.safelist.txt /ui/
COPY build /ui/build
COPY config /ui/config
# Copy source files from the unit-test step to ensure the unit tests pass before building
COPY --from=unit-test /ui/src /ui/src
# Copy git directory because the build process needs to know the current git revision
COPY .git /ui/.git
# Build app
RUN npm run build
# Remove development dependencies
RUN npm prune --production && rm -rf node_modules/.cache


## Static assets for kiva origins export stage
FROM scratch as export-kiva-origins
COPY --from=build /ui/dist/static/binary ./static/binary
COPY --from=build /ui/dist/static/css ./static/css
COPY --from=build /ui/dist/static/img ./static/img
COPY --from=build /ui/dist/static/js ./static/js
COPY --from=build /ui/dist/static/manifest ./static/manifest
COPY --from=build /ui/dist/static/media ./static/media
COPY --from=build /ui/dist/static/wasm ./static/wasm
COPY --from=build /ui/dist/static/icons.*.svg ./static/

## Static assets for all origins export stage
FROM scratch as export-all-origins
COPY --from=build /ui/dist/static/fonts ./static/fonts


## End-to-end test stage based on cypress pre-built image
# For updates to the base image, look at https://github.com/cypress-io/cypress-docker-images/tree/master/included
FROM cypress/included:10.11.0 as e2e-test
# Only use basic text for reporting to stdout
ENV NO_COLOR=1
# Base image has npm 6, so for project dependencies to run correctly we need to manually upgrade to npm 7
RUN npm install -g npm@7
# Create directory for test code
RUN mkdir /e2e
WORKDIR /e2e
# Copy project dependencies
COPY --from=dev-dependencies /ui/ /e2e/
# Copy test code into the image
COPY cypress.config.js reporter-config.json /e2e/
COPY test/e2e /e2e/test/e2e


## Performance test stage
FROM dev-dependencies as performance-test
# Install chromium
RUN apk add --no-cache chromium
# Install lighthouse ci cli
RUN npm install -g @lhci/cli@0.9.x
# Copy git directory because the upload process needs to know the current git revision
COPY .git /ui/.git
# Copy server code into the image
COPY lighthouserc-dev.js /ui/
COPY config /ui/config
COPY server /ui/server
COPY src /ui/src
COPY --from=build /ui/dist /ui/dist


## Release stage
FROM base as release
# Copy app files
COPY config /ui/config
COPY server /ui/server
COPY src /ui/src
COPY --from=build /ui/node_modules /ui/node_modules
COPY --from=build /ui/dist /ui/dist
# TODO: replace line above with line below to eliminate static assets from final image
# COPY --from=build /ui/dist/vue-ssr-server-bundle.json /ui/dist/vue-ssr-client-manifest.json /ui/dist/
# Expose server port to the outside
EXPOSE 8888
# Launch application using tini
# NOTE: Uses default Production config and is overridden when starting K8s pods
CMD [ "npm", "start-k8s" ]
