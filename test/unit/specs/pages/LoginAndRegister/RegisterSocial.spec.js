import routes from '../../../../../src/router/routes';

const beforeEnterGuard = routes.find(route => route.path === '/register/social').beforeEnter;

// Test that RegisterSocial.beforeRouteEnter redirects to the error page for route object `to`
const testRedirectToError = to => {
	const next = vi.fn();
	beforeEnterGuard(to, {}, next);
	expect(next.mock.calls.length).toBe(1);
	expect(next.mock.calls[0][0]).toBe('/error');
};

// Test that RegisterSocial.beforeRouteEnter does not redirect for route object `to`
const testNoRedirect = to => {
	const next = vi.fn();
	beforeEnterGuard(to, {}, next);
	expect(next.mock.calls.length).toBe(1);
	expect(next.mock.calls[0][0]).not.toBeDefined();
};

describe('RegisterSocial page', () => {
	it('redirects to error page if query params are missing', () => {
		testRedirectToError({});
		testRedirectToError({ query: {} });
		testRedirectToError({ query: { names: 1 } });
		testRedirectToError({ query: { terms: 1 } });
		testRedirectToError({ query: { names: 1, terms: 1 } });

		testNoRedirect({ query: { state: 'abc' } });
		testNoRedirect({ query: { state: 'abc', names: 1 } });
		testNoRedirect({ query: { state: 'abc', terms: 1 } });
		testNoRedirect({ query: { state: 'abc', names: 1, terms: 1 } });
	});
});
