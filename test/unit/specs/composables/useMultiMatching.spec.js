/* eslint-disable import/no-extraneous-dependencies -- devDependency used only in tests */
import { createApp } from 'vue';
import { flushPromises } from '@vue/test-utils';
import useMultiMatching from '#src/composables/useMultiMatching';

vi.mock('#src/util/logReadQueryError', () => ({
	default: vi.fn(),
}));

vi.mock('#src/graphql/query/multiMatchingEnabled.graphql', () => ({
	default: 'multiMatchingEnabledQuery',
}));

describe('useMultiMatching', () => {
	let mockApollo;

	const mountComposable = (apolloClient = mockApollo) => {
		let result;
		const TestComponent = {
			setup() {
				result = useMultiMatching();
				return {};
			},
			template: '<div></div>',
		};
		const app = createApp(TestComponent);
		if (apolloClient) {
			app.provide('apollo', apolloClient);
		}
		app.mount(document.createElement('div'));
		return result;
	};

	beforeEach(() => {
		mockApollo = { query: vi.fn() };
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should default enableMultiMatching to false', () => {
		mockApollo.query.mockResolvedValue({ data: {} });
		const { enableMultiMatching } = mountComposable();
		expect(enableMultiMatching.value).toBe(false);
	});

	it('should set enableMultiMatching to true when flag is enabled', async () => {
		mockApollo.query.mockResolvedValue({
			data: {
				general: {
					multiMatchingEnabled: { key: 'create_multi_match_reservations.enabled', value: 'true' },
				},
			},
		});
		const { enableMultiMatching } = mountComposable();
		await flushPromises();
		expect(enableMultiMatching.value).toBe(true);
	});

	it('should leave enableMultiMatching false when flag is disabled', async () => {
		mockApollo.query.mockResolvedValue({
			data: {
				general: {
					multiMatchingEnabled: { key: 'create_multi_match_reservations.enabled', value: 'false' },
				},
			},
		});
		const { enableMultiMatching } = mountComposable();
		await flushPromises();
		expect(enableMultiMatching.value).toBe(false);
	});

	it('should call logReadQueryError and leave flag false when query fails', async () => {
		const error = new Error('Network error');
		const logReadQueryError = (await import('#src/util/logReadQueryError')).default;
		mockApollo.query.mockRejectedValue(error);
		const { enableMultiMatching } = mountComposable();
		await flushPromises();
		expect(logReadQueryError).toHaveBeenCalledWith(error, 'useMultiMatching multiMatchingEnabled');
		expect(enableMultiMatching.value).toBe(false);
	});

	it('should not query when apollo is not provided', () => {
		const { enableMultiMatching } = mountComposable(null);
		expect(mockApollo.query).not.toHaveBeenCalled();
		expect(enableMultiMatching.value).toBe(false);
	});
});
