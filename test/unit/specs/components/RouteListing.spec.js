import { render } from '@testing-library/vue';
import RouteListing from '../../../../src/pages/UiSiteMap/RouteListing';
import routes from '../../../../src/router/routes';
import { createRouter, createWebHistory } from 'vue-router';
import byTextContent from '../../helpers/byTextContent';

const router = createRouter({
	history: createWebHistory(),
	routes
});
// Async components in route causes some issues with components that use
// require.context. Lets remove the component from the route since we are
// just testing the number of routes
const routesWithOutComponents = routes.map(route => ({
	...route,
	component: undefined,
}));

// Get the label a route will be displayed with, e.g. "auto-deposit" or "(homepage)"
function getRouteLabel(route) {
	const trimmedPath = route.path.replace('/', '');
	const name = route.name ? `(${route.name})` : '';
	const spacing = trimmedPath && name ? ' ' : '';
	return `${trimmedPath}${spacing}${name}`;
}

describe('RouteListing.vue', () => {
	it('should render a link for each route', () => {
		const { getByText } = render(RouteListing, {
			global: {
				routes: routesWithOutComponents,
				plugins: [router],
			}
		});

		routes.forEach(route => {
			const label = getRouteLabel(route);
			getByText(byTextContent(label)); // Will throw an error if the route label is not found
		});
	});

	it('should handle routes with params', () => {
		const customRouter = createRouter({
			history: createWebHistory(),
			routes: [
				{
					name: 'user-profile',
					path: '/user/:userId/posts/:postId',
					component: { template: '<div>User Profile</div>' }
				}
			]
		});

		const { container } = render(RouteListing, {
			global: {
				plugins: [customRouter],
			}
		});

		// Should render input fields for route params (lines 18, 39)
		const inputs = container.querySelectorAll('input[type="text"]');
		expect(inputs.length).toBeGreaterThan(0);
		expect(inputs[0].placeholder).toBe('set :userId');
		expect(inputs[1].placeholder).toBe('set :postId');
	});

	it('should handle routes without names', () => {
		const customRouter = createRouter({
			history: createWebHistory(),
			routes: [
				{
					path: '/no-name-route',
					component: { template: '<div>No Name</div>' }
				}
			]
		});

		const { container } = render(RouteListing, {
			global: {
				plugins: [customRouter],
			}
		});

		// Should not display name span when route has no name (line 32 branch)
		const text = container.textContent;
		expect(text).toContain('no-name-route');
		expect(text).not.toContain('(no-name)');
	});

	it('should handle redirect routes', () => {
		const customRouter = createRouter({
			history: createWebHistory(),
			routes: [
				{
					name: 'old-path',
					path: '/old',
					redirect: '/new'
				}
			]
		});

		const { getByText } = render(RouteListing, {
			global: {
				plugins: [customRouter],
			}
		});

		// Should display redirect arrow and target
		getByText('/new');
	});

	it('should handle dev routes', () => {
		const customRouter = createRouter({
			history: createWebHistory(),
			routes: [
				{
					name: 'dev-route',
					path: '/dev-only',
					status: 'dev',
					component: { template: '<div>Dev</div>' }
				}
			]
		});

		const { getByText } = render(RouteListing, {
			global: {
				plugins: [customRouter],
			},
			provide: {
				$appConfig: {
					host: 'dev.kiva.org'
				}
			}
		});

		// Should show dev routes when not on prod
		getByText('Dev Routes');
	});
});
