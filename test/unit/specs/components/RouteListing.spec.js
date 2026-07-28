import { render, fireEvent } from '@testing-library/vue';
import RouteListing from '#src/pages/UiSiteMap/RouteListing';
import routes from '#src/router/routes';
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

// Find the <li> in the Redirects list for a given route path
function redirectRowFor(container, path) {
	const heading = [...container.querySelectorAll('h2')]
		.find(h2 => h2.textContent.trim() === 'Redirects');
	return [...heading.nextElementSibling.querySelectorAll('li')]
		.find(li => li.textContent.includes(path));
}

const hrefsIn = row => [...row.querySelectorAll('a')].map(a => a.getAttribute('href'));

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

	it('should link string redirect targets', () => {
		const { container } = render(RouteListing, {
			global: {
				routes: routesWithOutComponents,
				plugins: [router],
			}
		});

		const stringRedirect = routes.find(route => typeof route.redirect === 'string');
		const link = container.querySelector(`a[href="${stringRedirect.redirect}"]`);
		expect(link).toBeTruthy();
		expect(link.textContent.trim()).toBe(stringRedirect.redirect);
	});

	// vue-router allows `redirect` to be a function, which is not a valid `to`
	// value. Binding it warned about an invalid prop and rendered the function's
	// source as the link text. The target is now read out of the function source
	// and linked with a plain anchor, since it can point outside the app's routes.
	it('should resolve a function redirect target and link it', () => {
		const { getByText } = render(RouteListing, {
			global: {
				routes: routesWithOutComponents,
				plugins: [router],
			}
		});

		expect(routes.some(route => typeof route.redirect === 'function')).toBe(true);

		const link = getByText('/lend-by-category/:category');
		expect(link.tagName).toBe('A');
		expect(link.getAttribute('href')).toBe('/lend-by-category/:category');
	});

	// The label is derived from the function's source, so anything it can't read
	// has to degrade to a neutral label rather than guess.
	it('should fall back to a neutral label when a function redirect is unreadable', () => {
		const opaqueRouter = createRouter({
			history: createWebHistory(),
			routes: [
				// A '/' route so the initial location resolves without a router warning
				{ path: '/', component: { name: 'Home', template: '<div></div>' } },
				// No path-like literal in the source for the label to be read from
				{ path: '/opaque', redirect: to => to.params.id },
			],
		});

		const { getByText } = render(RouteListing, {
			global: { plugins: [opaqueRouter] }
		});

		expect(getByText('(dynamic redirect)').tagName).toBe('SMALL');
	});

	it('should substitute a typed param into both a redirect route and its target', async () => {
		const { container } = render(RouteListing, {
			global: {
				routes: routesWithOutComponents,
				plugins: [router],
			}
		});

		const row = redirectRowFor(container, 'lend-beta/:id');
		await fireEvent.update(row.querySelector('input'), '2468');

		expect(hrefsIn(row)).toEqual(['/lend-beta/2468', '/lend/2468']);
	});

	// A typed param should flow into the resolved function target too, so the row
	// shows the real URL the redirect will produce.
	it('should substitute a typed param into a function redirect target', async () => {
		const { container } = render(RouteListing, {
			global: {
				routes: routesWithOutComponents,
				plugins: [router],
			}
		});

		const row = redirectRowFor(container, 'lend/:category');
		await fireEvent.update(row.querySelector('input'), 'agriculture');

		// Both sides are followable: the route via the router, the resolved
		// external target via a plain anchor.
		expect(hrefsIn(row)).toEqual(['/lend/agriculture', '/lend-by-category/agriculture']);
	});
});
