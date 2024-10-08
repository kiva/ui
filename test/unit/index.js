// import Vue from 'vue';

// Vue.config.productionTip = false;

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/);
testsContext.keys().forEach(testsContext);

// require all src files except anything in assets/ or graphql/ for coverage.
const srcContext = require.context('../../src', true, /^\.\/(?!(assets\/|graphql\/))/);
srcContext.keys().forEach(srcContext);
