import numeralFilter from '#src/plugins/numeral-filter';
import CookieStore from '#src/util/cookieStore';
import { MockKvAuth0 } from '#src/util/KvAuth0';

const mockRouter = {
	push: vi.fn()
};

const emptyComponent = {
	template: '<div></div>',
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
			readQuery: () => { },
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
	emptyComponent,
	globalOptions,
	getOperationName
};
