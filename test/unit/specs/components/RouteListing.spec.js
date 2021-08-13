import { render } from '@testing-library/vue';
import RouteListing from '@/pages/UiSiteMap/RouteListing';
import routes from '@/router/routes';
import byTextContent from '../../helpers/byTextContent';

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
		const { getByText } = render(RouteListing, { routes: routesWithOutComponents });

		routes.forEach(route => {
			const label = getRouteLabel(route);
			getByText(byTextContent(label)); // Will throw an error if the route label is not found
		});
	});
});
