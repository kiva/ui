import Vue from 'vue';
import Router from 'vue-router';

// Import our routes
const routeObject = require('./routes.js');

Vue.use(Router);

export default function createRouter() {
	return new Router({
		mode: 'history',
		routes: routeObject,
	});
}
