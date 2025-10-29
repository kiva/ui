import apolloPlugin from '../../../../src/plugins/apollo-plugin';

describe('apollo-plugin', () => {
	let app;
	let mixin;
	let ctx;

	function makeApp() {
		const mixins = [];
		return {
			mixin: fn => mixins.push(fn),
			getMixins: () => mixins,
		};
	}

	beforeEach(() => {
		app = makeApp();
		apolloPlugin(app);
		[mixin] = app.getMixins();
		ctx = {};
	});

	it('registers a mixin with a created hook', () => {
		expect(typeof mixin.created).toBe('function');
	});

	it('does nothing if $options.apollo is not present', () => {
		ctx.$options = {};
		ctx.apollo = { readQuery: vi.fn() };
		expect(() => mixin.created.call(ctx)).not.toThrow();
		expect(ctx.apollo.readQuery).not.toHaveBeenCalled();
	});

	it('throws if required injections are missing', () => {
		ctx.$options = { apollo: {} };
		expect(() => mixin.created.call(ctx)).toThrow('Missing required injections');
	});

	it('does not call result if shouldPreFetch returns false', () => {
		const result = vi.fn();
		const shouldPreFetch = vi.fn(() => false);
		ctx.$options = {
			inject: { apollo: {}, cookieStore: {} },
			apollo: {
				query: 'Q',
				preFetch: true,
				shouldPreFetch,
				result
			}
		};
		ctx.$watch = vi.fn();
		ctx.cookieStore = { get: vi.fn() };
		ctx.$route = { query: {} };
		ctx.apollo = { readQuery: vi.fn(), watchQuery: vi.fn(() => ({ subscribe: vi.fn() })) };
		mixin.created.call(ctx);
		expect(shouldPreFetch).toHaveBeenCalled();
		expect(ctx.apollo.readQuery).not.toHaveBeenCalled();
		expect(result).not.toHaveBeenCalled();
	});

	it('calls result with cache data if preFetched and data exists', () => {
		const data = { foo: 1 };
		const result = vi.fn();
		ctx.$options = {
			inject: { apollo: {}, cookieStore: {} },
			apollo: {
				query: 'Q',
				preFetch: true,
				result
			}
		};
		ctx.$watch = vi.fn();
		ctx.cookieStore = { get: vi.fn() };
		ctx.$route = { query: {} };
		ctx.apollo = { readQuery: vi.fn(() => data), watchQuery: vi.fn(() => ({ subscribe: vi.fn() })) };
		mixin.created.call(ctx);
		expect(ctx.apollo.readQuery).toHaveBeenCalled();
		expect(result).toHaveBeenCalledWith({ data });
	});

	it('skips result if cache returns null', () => {
		const result = vi.fn();
		ctx.$options = {
			inject: { apollo: {}, cookieStore: {} },
			apollo: {
				query: 'Q',
				preFetch: true,
				result
			}
		};
		ctx.$watch = vi.fn();
		ctx.cookieStore = { get: vi.fn() };
		ctx.$route = { query: {} };
		ctx.apollo = { readQuery: vi.fn(() => null), watchQuery: vi.fn(() => ({ subscribe: vi.fn() })) };
		mixin.created.call(ctx);
		expect(result).not.toHaveBeenCalled();
	});

	it('handles readQuery errors gracefully and continues with watchQuery', () => {
		const result = vi.fn();
		const error = new Error('Cache read error');
		ctx.$options = {
			inject: { apollo: {}, cookieStore: {} },
			apollo: {
				query: { definitions: [{ name: { value: 'TestQuery' } }] },
				preFetch: true,
				result
			}
		};
		ctx.$watch = vi.fn();
		ctx.cookieStore = { get: vi.fn() };
		ctx.$route = { query: {} };
		ctx.apollo = {
			readQuery: vi.fn(() => { throw error; }),
			watchQuery: vi.fn(() => ({ subscribe: vi.fn() }))
		};
		global.window = {};

		// Should not throw despite readQuery error
		expect(() => mixin.created.call(ctx)).not.toThrow();

		// Should still set up watchQuery despite cache error
		expect(ctx.apollo.watchQuery).toHaveBeenCalled();
	});

	it('sets up observer and $watch in browser', () => {
		const result = vi.fn();
		ctx.$options = {
			inject: { apollo: {}, cookieStore: {} },
			apollo: {
				query: 'Q',
				preFetch: false,
				variables: () => ({}),
				result
			}
		};
		ctx.cookieStore = { get: vi.fn() };
		ctx.$route = { query: {} };
		const subscribe = vi.fn(({ next }) => {
			next({ data: 123 });
		});
		ctx.apollo = {
			readQuery: vi.fn(),
			watchQuery: vi.fn(() => ({
				subscribe,
				setVariables: vi.fn(),
			}))
		};
		ctx.$watch = vi.fn((fn, cb) => cb({}));
		global.window = {};
		mixin.created.call(ctx);
		expect(ctx.apollo.watchQuery).toHaveBeenCalled();
		expect(ctx.$watch).toHaveBeenCalled();
		expect(subscribe).toHaveBeenCalled();
		expect(result).toHaveBeenCalledWith({ data: 123 });
	});

	it('should handle array of apollo configs', () => {
		const result1 = vi.fn();
		const result2 = vi.fn();
		ctx.$options = {
			inject: { apollo: {}, cookieStore: {} },
			apollo: [
				{
					query: 'Q1',
					preFetch: true,
					result: result1
				},
				{
					query: 'Q2',
					preFetch: false,
					variables: () => ({}),
					result: result2
				}
			]
		};
		ctx.cookieStore = { get: vi.fn() };
		ctx.$route = { query: {} };
		ctx.apollo = {
			readQuery: vi.fn(() => ({ foo: 'bar' })),
			watchQuery: vi.fn(() => ({
				subscribe: ({ next }) => next({ data: 456 }),
				setVariables: vi.fn()
			}))
		};
		ctx.$watch = (fn, cb) => cb({});
		global.window = {};
		mixin.created.call(ctx);
		expect(result1).toHaveBeenCalledWith({ data: { foo: 'bar' } });
		expect(result2).toHaveBeenCalledWith({ data: 456 });
	});

	it('should skip observer setup when window is not defined', () => {
		const result = vi.fn();
		ctx.$options = {
			inject: { apollo: {}, cookieStore: {} },
			apollo: {
				query: 'Q',
				preFetch: false,
				variables: () => ({}),
				result
			}
		};
		ctx.cookieStore = { get: vi.fn() };
		ctx.$route = { query: {} };
		ctx.apollo = {
			readQuery: vi.fn(),
			watchQuery: vi.fn()
		};
		ctx.$watch = vi.fn();
		global.window = undefined;

		mixin.created.call(ctx);

		expect(ctx.apollo.watchQuery).not.toHaveBeenCalled();
		expect(ctx.$watch).not.toHaveBeenCalled();
	});

	it('should include basketId in preFetchVariables when present', () => {
		const result = vi.fn();
		const preFetchVariables = vi.fn(() => ({ foo: 'bar' }));
		ctx.$options = {
			inject: { apollo: {}, cookieStore: {} },
			apollo: {
				query: 'Q',
				preFetch: true,
				preFetchVariables,
				result
			}
		};
		ctx.$watch = vi.fn();
		ctx.cookieStore = { get: vi.fn(() => 'basket123') };
		ctx.$route = { query: {} };
		ctx.apollo = {
			readQuery: vi.fn(() => ({ data: 'test' })),
			watchQuery: vi.fn(() => ({ subscribe: vi.fn() }))
		};
		mixin.created.call(ctx);
		expect(ctx.apollo.readQuery).toHaveBeenCalledWith({
			query: 'Q',
			variables: { basketId: 'basket123', foo: 'bar' }
		});
	});

	it('should include basketId in watchQuery variables when present', () => {
		const result = vi.fn();
		ctx.$options = {
			inject: { apollo: {}, cookieStore: {} },
			apollo: {
				query: 'Q',
				preFetch: false,
				variables: () => ({ foo: 'bar' }),
				result
			}
		};
		ctx.cookieStore = { get: vi.fn(() => 'basket456') };
		ctx.$route = { query: {} };
		const subscribe = vi.fn();
		ctx.apollo = {
			readQuery: vi.fn(),
			watchQuery: vi.fn(() => ({
				subscribe,
				setVariables: vi.fn()
			}))
		};
		ctx.$watch = vi.fn();
		global.window = {};
		mixin.created.call(ctx);
		expect(ctx.apollo.watchQuery).toHaveBeenCalledWith({
			query: 'Q',
			variables: { basketId: 'basket456', foo: 'bar' }
		});
	});
});
