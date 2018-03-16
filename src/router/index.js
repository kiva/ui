import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';

Vue.use(Router);

export default function createRouter() {
	return new Router({
		mode: 'history',
		routes,
	});
}
