import { h, ref } from 'vue';
import numeralFilter from '#src/plugins/numeral-filter';
import CookieStore from '#src/util/cookieStore';
import { MockKvAuth0 } from '#src/util/KvAuth0';

const mockRouter = {
	push: vi.fn()
};

const emptyComponent = {
	template: '<div></div>',
};

// Opt-in `<router-link>` stub for specs that mount a component in isolation
// without installing vue-router. Renders a literal `<router-link to="...">`
// element, matching what Vue emitted when the component was unresolved, so
// specs that query `router-link[to="..."]` keep working — the point is only to
// silence the resolve warning, not to change any DOM.
//
// Do NOT promote this to `config.global` in setup.js: it would also replace the
// real RouterLink in specs that install a router, where <router-link> is
// expected to render an anchor with role="link".
const routerLinkStub = {
	name: 'RouterLink',
	props: {
		to: { type: [String, Object], default: '' },
	},
	setup(props, { slots }) {
		return () => h('router-link', { to: props.to }, slots.default?.());
	},
};

// Opt-in stand-in for vue-router's injected router, for components that call
// `useRouter()` in setup(). Plain no-ops rather than spies so it stays
// stateless; a spec asserting navigation should provide its own. `currentRoute`
// is a Ref on the real router and components read `.currentRoute.value`
// without guarding it, so it has to be present.
//
// Provide it under vue-router's `routerKey`, imported by the spec rather than
// here: several specs `vi.mock('vue-router')` without re-exporting routerKey,
// and importing it in this shared module breaks their collection.
const mockRouterObject = {
	currentRoute: ref({
		path: '/',
		fullPath: '/',
		name: undefined,
		hash: '',
		query: {},
		params: {},
		meta: {},
	}),
	push: () => Promise.resolve(),
	replace: () => Promise.resolve(),
	go: () => {},
	back: () => {},
	forward: () => {},
	resolve: to => ({ href: typeof to === 'string' ? to : '' }),
};

// Extracts the operation name from a gql document, e.g. to assert which
// query/mutation a mocked apollo client call received.
const getOperationName = query => query?.definitions?.find(d => d.kind === 'OperationDefinition')?.name?.value;

const globalOptions = {
	directives: { kvTrackEvent: () => {} },
	provide: {
		apollo: {
			readFragment: () => { },
			query: () => Promise.resolve({}),
			readQuery: () => null,
			watchQuery: () => ({ subscribe: () => ({ unsubscribe: () => { } }) }),
			mutate: () => Promise.resolve({}),
		},
		cookieStore: new CookieStore(),
		kvAuth0: MockKvAuth0,
	},
	mocks: {
		$kvTrackEvent: () => {},
		$renderConfig: {},
		$router: mockRouter,
		$filters: {
			numeral: () => {
				return {
					numeralFilter,
				};
			}
		}
	}
};

export {
	mockRouter,
	mockRouterObject,
	routerLinkStub,
	emptyComponent,
	globalOptions,
	getOperationName
};
