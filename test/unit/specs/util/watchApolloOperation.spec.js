import watchApolloOperation from '#src/util/watchApolloOperation';

const query = { kind: 'Document', definitions: [{ name: { value: 'SpecOperation' } }] };

function makeClient() {
	const setVariables = vi.fn();
	const subscription = { unsubscribe: vi.fn() };
	const subscribe = vi.fn(() => subscription);
	const client = {
		watchQuery: vi.fn(() => ({ setVariables, subscribe })),
	};
	return {
		client,
		setVariables,
		subscribe,
		subscription,
	};
}

describe('watchApolloOperation', () => {
	it('creates the watch query with the merged variables', () => {
		const { client } = makeClient();
		const cookieStore = { get: name => (name === 'kvbskt' ? 'basket1' : null) };
		watchApolloOperation({
			client,
			operation: { query },
			commonVars: { cookieStore, route: null },
			getVariables: () => ({ id: 5 }),
			watchVariables: () => {},
			next: () => {},
		});
		expect(client.watchQuery).toHaveBeenCalledWith({
			query,
			variables: { basketId: 'basket1', id: 5 },
		});
	});

	it('honors the operation fetchPolicy', () => {
		const { client } = makeClient();
		watchApolloOperation({
			client,
			operation: { query, fetchPolicy: 'cache-and-network' },
			commonVars: {},
			getVariables: () => ({}),
			watchVariables: () => {},
			next: () => {},
		});
		expect(client.watchQuery).toHaveBeenCalledWith(
			expect.objectContaining({ fetchPolicy: 'cache-and-network' })
		);
	});

	it('omits fetchPolicy when the operation sets none', () => {
		const { client } = makeClient();
		watchApolloOperation({
			client,
			operation: { query },
			commonVars: {},
			getVariables: () => ({}),
			watchVariables: () => {},
			next: () => {},
		});
		expect(client.watchQuery).toHaveBeenCalledWith(
			expect.not.objectContaining({ fetchPolicy: expect.anything() })
		);
	});

	it('updates the watch query variables when the watched variables change', () => {
		const { client, setVariables } = makeClient();
		let onChange;
		watchApolloOperation({
			client,
			operation: { query },
			commonVars: {},
			getVariables: () => ({ id: 1 }),
			watchVariables: (getVariables, callback) => { onChange = callback; },
			next: () => {},
		});
		onChange({ id: 2 });
		expect(setVariables).toHaveBeenCalledWith({ id: 2 });
	});

	it('watches the variables through the given getter', () => {
		const { client } = makeClient();
		const getVariables = () => ({ id: 1 });
		const watchVariables = vi.fn();
		watchApolloOperation({
			client,
			operation: { query },
			commonVars: {},
			getVariables,
			watchVariables,
			next: () => {},
		});
		expect(watchVariables).toHaveBeenCalledWith(getVariables, expect.any(Function));
	});

	it('subscribes the next handler without an error handler by default', () => {
		const { client, subscribe } = makeClient();
		const next = () => {};
		watchApolloOperation({
			client,
			operation: { query },
			commonVars: {},
			getVariables: () => ({}),
			watchVariables: () => {},
			next,
		});
		expect(subscribe).toHaveBeenCalledWith({ next });
	});

	it('subscribes the error handler when one is provided', () => {
		const { client, subscribe } = makeClient();
		const next = () => {};
		const error = () => {};
		watchApolloOperation({
			client,
			operation: { query },
			commonVars: {},
			getVariables: () => ({}),
			watchVariables: () => {},
			next,
			error,
		});
		expect(subscribe).toHaveBeenCalledWith({ next, error });
	});

	it('returns the observer and the subscription', () => {
		const { client, subscription } = makeClient();
		const out = watchApolloOperation({
			client,
			operation: { query },
			commonVars: {},
			getVariables: () => ({}),
			watchVariables: () => {},
			next: () => {},
		});
		expect(out.observer).toBe(client.watchQuery.mock.results[0].value);
		expect(out.subscription).toBe(subscription);
	});
});
