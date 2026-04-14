import apolloPlugin from '#src/plugins/apollo-plugin';

function mockIntersectionObserver(ctx) {
	const instances = [];
	const MockObserver = vi.fn((callback, options) => {
		const instance = {
			callback,
			options,
			observe: vi.fn(),
			disconnect: vi.fn(),
		};
		instances.push(instance);
		return instance;
	});
	global.IntersectionObserver = MockObserver;
	global.IntersectionObserverEntry = { prototype: { intersectionRatio: 0 } };
	// Also set on window object for checkIntersectionObserverSupport
	if (typeof global.window === 'object' && global.window !== null) {
		global.window.IntersectionObserver = MockObserver;
		global.window.IntersectionObserverEntry = global.IntersectionObserverEntry;
	}
	return {
		get instances() { return instances; },
		trigger(intersectionRatio = 1) {
			instances.forEach(inst => {
				inst.callback([{ target: ctx.$el, intersectionRatio }]);
			});
		},
		restore() {
			delete global.IntersectionObserver;
			delete global.IntersectionObserverEntry;
		},
	};
}

describe('apollo-plugin', () => {
	let app;
	let mixin;

	function makeApp() {
		const mixins = [];
		return {
			mixin: fn => mixins.push(fn),
			getMixins: () => mixins,
		};
	}

	function makeCtx({
		apolloConfig = { query: 'Q', result: vi.fn() },
		cookieStoreGet = vi.fn(),
		readQuery = vi.fn(),
		watchQuery,
		$watch = vi.fn(),
		$el,
	} = {}) {
		const defaultWatchQuery = vi.fn(() => ({
			subscribe: vi.fn(),
			setVariables: vi.fn(),
		}));

		const c = {
			$options: {
				inject: { apollo: {}, cookieStore: {} },
				apollo: apolloConfig,
			},
			cookieStore: { get: cookieStoreGet },
			$route: { query: {} },
			apollo: {
				readQuery,
				watchQuery: watchQuery ?? defaultWatchQuery,
			},
			$watch,
			$el,
		};
		return c;
	}

	function runCreated(c) {
		mixin.created.call(c);
	}

	function runMounted(c) {
		mixin.mounted.call(c);
	}

	function setBrowser() {
		global.window = {};
	}

	beforeEach(() => {
		app = makeApp();
		apolloPlugin(app);
		[mixin] = app.getMixins();
	});

	afterEach(() => {
		global.window = undefined;
		delete global.IntersectionObserver;
		delete global.IntersectionObserverEntry;
	});

	it('registers a mixin with a created hook', () => {
		expect(typeof mixin.created).toBe('function');
	});

	it('does nothing if $options.apollo is not present', () => {
		const ctx = { $options: {}, apollo: { readQuery: vi.fn() } };
		expect(() => mixin.created.call(ctx)).not.toThrow();
		expect(ctx.apollo.readQuery).not.toHaveBeenCalled();
	});

	it('throws if required injections are missing', () => {
		const ctx = { $options: { apollo: {} } };
		expect(() => mixin.created.call(ctx)).toThrow('Missing required injections');
	});

	it('does not call result if shouldPreFetch returns false', () => {
		const result = vi.fn();
		const shouldPreFetch = vi.fn(() => false);
		const ctx = makeCtx({
			apolloConfig: {
				query: 'Q', preFetch: true, shouldPreFetch, result
			},
		});

		runCreated(ctx);

		expect(shouldPreFetch).toHaveBeenCalled();
		expect(ctx.apollo.readQuery).not.toHaveBeenCalled();
		expect(result).not.toHaveBeenCalled();
	});

	it('calls result with cache data if preFetched and data exists', () => {
		const data = { foo: 1 };
		const result = vi.fn();
		const ctx = makeCtx({
			apolloConfig: { query: 'Q', preFetch: true, result },
			readQuery: vi.fn(() => data),
		});

		runCreated(ctx);

		expect(ctx.apollo.readQuery).toHaveBeenCalled();
		expect(result).toHaveBeenCalledWith({ data });
	});

	it('skips result if cache returns null', () => {
		const result = vi.fn();
		const ctx = makeCtx({
			apolloConfig: { query: 'Q', preFetch: true, result },
			readQuery: vi.fn(() => null),
		});

		runCreated(ctx);

		expect(result).not.toHaveBeenCalled();
	});

	it('handles readQuery errors gracefully and continues with watchQuery', () => {
		const result = vi.fn();
		const ctx = makeCtx({
			apolloConfig: {
				query: { definitions: [{ name: { value: 'TestQuery' } }] },
				preFetch: true,
				result,
			},
			readQuery: vi.fn(() => { throw new Error('Cache read error'); }),
		});
		setBrowser();

		expect(() => runCreated(ctx)).not.toThrow();
		expect(ctx.apollo.watchQuery).toHaveBeenCalled();
	});

	it('sets up observer and $watch in browser', () => {
		const result = vi.fn();
		const subscribe = vi.fn(({ next }) => { next({ data: 123 }); });
		const ctx = makeCtx({
			apolloConfig: {
				query: 'Q', preFetch: false, variables: () => ({}), result
			},
			watchQuery: vi.fn(() => ({ subscribe, setVariables: vi.fn() })),
			$watch: vi.fn((fn, cb) => cb({})),
		});
		setBrowser();

		runCreated(ctx);

		expect(ctx.apollo.watchQuery).toHaveBeenCalled();
		expect(ctx.$watch).toHaveBeenCalled();
		expect(subscribe).toHaveBeenCalled();
		expect(result).toHaveBeenCalledWith({ data: 123 });
	});

	it('should handle array of apollo configs', () => {
		const result1 = vi.fn();
		const result2 = vi.fn();
		const ctx = makeCtx({
			apolloConfig: [
				{ query: 'Q1', preFetch: true, result: result1 },
				{
					query: 'Q2', preFetch: false, variables: () => ({}), result: result2
				},
			],
			readQuery: vi.fn(() => ({ foo: 'bar' })),
			watchQuery: vi.fn(() => ({
				subscribe: ({ next }) => next({ data: 456 }),
				setVariables: vi.fn(),
			})),
			$watch: (fn, cb) => cb({}),
		});
		setBrowser();

		runCreated(ctx);

		expect(result1).toHaveBeenCalledWith({ data: { foo: 'bar' } });
		expect(result2).toHaveBeenCalledWith({ data: 456 });
	});

	it('should skip observer setup when window is not defined', () => {
		const ctx = makeCtx({
			apolloConfig: {
				query: 'Q', preFetch: false, variables: () => ({}), result: vi.fn()
			},
		});

		runCreated(ctx);

		expect(ctx.apollo.watchQuery).not.toHaveBeenCalled();
		expect(ctx.$watch).not.toHaveBeenCalled();
	});

	it('should include basketId in preFetchVariables when present', () => {
		const preFetchVariables = vi.fn(() => ({ foo: 'bar' }));
		const ctx = makeCtx({
			apolloConfig: {
				query: 'Q', preFetch: true, preFetchVariables, result: vi.fn()
			},
			cookieStoreGet: vi.fn(() => 'basket123'),
			readQuery: vi.fn(() => ({ data: 'test' })),
		});

		runCreated(ctx);

		expect(ctx.apollo.readQuery).toHaveBeenCalledWith({
			query: 'Q',
			variables: { basketId: 'basket123', foo: 'bar' },
		});
	});

	it('should include basketId in watchQuery variables when present', () => {
		const ctx = makeCtx({
			apolloConfig: {
				query: 'Q', preFetch: false, variables: () => ({ foo: 'bar' }), result: vi.fn()
			},
			cookieStoreGet: vi.fn(() => 'basket456'),
		});
		setBrowser();

		runCreated(ctx);

		expect(ctx.apollo.watchQuery).toHaveBeenCalledWith({
			query: 'Q',
			variables: { basketId: 'basket456', foo: 'bar' },
		});
	});

	it('does not call watchQuery in created() when lazy is true', () => {
		const ctx = makeCtx({
			apolloConfig: {
				lazy: true, query: 'Q', variables: () => ({}), result: vi.fn()
			},
		});
		setBrowser();

		runCreated(ctx);

		expect(ctx.apollo.watchQuery).not.toHaveBeenCalled();
		expect(ctx.lazyOperations).toHaveLength(1);
	});

	it('ignores lazy when preFetch is true and shouldPreFetch passes', () => {
		const data = { foo: 1 };
		const result = vi.fn();
		const ctx = makeCtx({
			apolloConfig: {
				lazy: true, query: 'Q', preFetch: true, variables: () => ({}), result
			},
			readQuery: vi.fn(() => data),
			watchQuery: vi.fn(() => ({ subscribe: vi.fn(), setVariables: vi.fn() })),
			$watch: vi.fn(),
		});
		setBrowser();

		runCreated(ctx);

		expect(result).toHaveBeenCalledWith({ data });
		expect(ctx.apollo.watchQuery).toHaveBeenCalled();
		expect(ctx.lazyOperations).toHaveLength(0);
	});

	it('applies lazy when preFetch is true but shouldPreFetch returns false', () => {
		const ctx = makeCtx({
			apolloConfig: {
				lazy: true,
				query: 'Q',
				preFetch: true,
				shouldPreFetch: () => false,
				variables: () => ({}),
				result: vi.fn(),
			},
		});
		setBrowser();

		runCreated(ctx);

		expect(ctx.apollo.readQuery).not.toHaveBeenCalled();
		expect(ctx.apollo.watchQuery).not.toHaveBeenCalled();
		expect(ctx.lazyOperations).toHaveLength(1);
	});

	it('handles mixed lazy and non-lazy queries in array form', () => {
		const result1 = vi.fn();
		const result2 = vi.fn();
		const ctx = makeCtx({
			apolloConfig: [
				{
					lazy: true, query: 'Q1', variables: () => ({}), result: result1
				},
				{ query: 'Q2', variables: () => ({}), result: result2 },
			],
			watchQuery: vi.fn(() => ({
				subscribe: ({ next }) => next({ data: 'immediate' }),
				setVariables: vi.fn(),
			})),
			$watch: vi.fn((fn, cb) => cb({})),
		});
		setBrowser();

		runCreated(ctx);

		expect(ctx.lazyOperations).toHaveLength(1);
		expect(result1).not.toHaveBeenCalled();
		expect(result2).toHaveBeenCalledWith({ data: 'immediate' });
	});

	it('sets up watchQuery when IntersectionObserver fires', () => {
		setBrowser();
		const result = vi.fn();
		const ctx = makeCtx({
			apolloConfig: {
				lazy: true, query: 'Q', variables: () => ({ id: 1 }), result
			},
			watchQuery: vi.fn(() => ({
				subscribe: ({ next }) => next({ data: 'lazy-result' }),
				setVariables: vi.fn(),
			})),
			$watch: vi.fn((fn, cb) => cb({})),
			$el: document.createElement('div'),
		});
		const mock = mockIntersectionObserver(ctx);

		runCreated(ctx);
		expect(ctx.apollo.watchQuery).not.toHaveBeenCalled();

		runMounted(ctx);
		expect(mock.instances).toHaveLength(1);
		expect(mock.instances[0].options.rootMargin).toBe('500px');

		mock.trigger(1);
		expect(ctx.apollo.watchQuery).toHaveBeenCalled();
		expect(result).toHaveBeenCalledWith({ data: 'lazy-result' });
		expect(mock.instances[0].disconnect).toHaveBeenCalled();

		mock.restore();
	});

	it('falls back to immediate watchQuery when IntersectionObserver is unavailable', () => {
		delete global.IntersectionObserver;
		delete global.IntersectionObserverEntry;
		const result = vi.fn();
		const ctx = makeCtx({
			apolloConfig: {
				lazy: true, query: 'Q', variables: () => ({}), result
			},
			watchQuery: vi.fn(() => ({
				subscribe: ({ next }) => next({ data: 'fallback' }),
				setVariables: vi.fn(),
			})),
			$watch: vi.fn((fn, cb) => cb({})),
			$el: document.createElement('div'),
		});
		setBrowser();

		runCreated(ctx);
		runMounted(ctx);

		expect(ctx.apollo.watchQuery).toHaveBeenCalled();
		expect(result).toHaveBeenCalledWith({ data: 'fallback' });
	});

	it('uses custom rootMargin from lazy option object', () => {
		setBrowser();
		const ctx = makeCtx({
			apolloConfig: {
				lazy: { rootMargin: '200px' }, query: 'Q', variables: () => ({}), result: vi.fn()
			},
			$el: document.createElement('div'),
		});
		const mock = mockIntersectionObserver(ctx);

		runCreated(ctx);
		runMounted(ctx);

		expect(mock.instances[0].options.rootMargin).toBe('200px');
		mock.restore();
	});

	it('passes all IntersectionObserver options through from lazy config', () => {
		setBrowser();
		const ctx = makeCtx({
			apolloConfig: {
				lazy: { rootMargin: '100px', threshold: 0.5 },
				query: 'Q',
				variables: () => ({}),
				result: vi.fn(),
			},
			$el: document.createElement('div'),
		});
		const mock = mockIntersectionObserver(ctx);

		runCreated(ctx);
		runMounted(ctx);

		expect(mock.instances[0].options).toEqual({ rootMargin: '100px', threshold: 0.5 });
		mock.restore();
	});

	it('observes a custom target element via $refs when target is specified', () => {
		setBrowser();
		const customEl = document.createElement('section');
		const result = vi.fn();
		const ctx = makeCtx({
			apolloConfig: {
				lazy: { target: 'lazyRoot' },
				query: 'Q',
				variables: () => ({}),
				result,
			},
			watchQuery: vi.fn(() => ({
				subscribe: ({ next }) => next({ data: 'custom-target' }),
				setVariables: vi.fn(),
			})),
			$watch: vi.fn((fn, cb) => cb({})),
			$el: document.createElement('div'),
		});
		ctx.$refs = { lazyRoot: customEl };
		const mock = mockIntersectionObserver(ctx);

		runCreated(ctx);
		runMounted(ctx);

		expect(mock.instances[0].observe).toHaveBeenCalledWith(customEl);

		mock.trigger(1);
		expect(result).toHaveBeenCalledWith({ data: 'custom-target' });
		mock.restore();
	});

	it('disconnects lazy observers on beforeUnmount', () => {
		setBrowser();
		const ctx = makeCtx({
			apolloConfig: {
				lazy: true, query: 'Q', variables: () => ({}), result: vi.fn()
			},
			$el: document.createElement('div'),
		});
		const mock = mockIntersectionObserver(ctx);

		runCreated(ctx);
		runMounted(ctx);
		expect(mock.instances[0].disconnect).not.toHaveBeenCalled();

		mixin.beforeUnmount.call(ctx);
		expect(mock.instances[0].disconnect).toHaveBeenCalled();

		mock.restore();
	});

	it('mounted does nothing when there are no lazy operations', () => {
		const ctx = makeCtx({
			apolloConfig: { query: 'Q', variables: () => ({}), result: vi.fn() },
		});
		setBrowser();

		runCreated(ctx);

		expect(() => runMounted(ctx)).not.toThrow();
		expect(() => mixin.beforeUnmount.call(ctx)).not.toThrow();
	});

	it('passes fetchPolicy through to watchQuery for lazy queries', () => {
		setBrowser();
		const ctx = makeCtx({
			apolloConfig: {
				lazy: true, query: 'Q', fetchPolicy: 'network-only', variables: () => ({}), result: vi.fn()
			},
			$el: document.createElement('div'),
		});
		const mock = mockIntersectionObserver(ctx);

		runCreated(ctx);
		runMounted(ctx);
		mock.trigger(1);

		expect(ctx.apollo.watchQuery).toHaveBeenCalledWith(
			expect.objectContaining({ fetchPolicy: 'network-only' }),
		);
		mock.restore();
	});

	it('sets up $watch and calls setVariables after lazy query activates', () => {
		setBrowser();
		const setVariables = vi.fn();
		const watchCallbacks = [];
		const ctx = makeCtx({
			apolloConfig: {
				lazy: true, query: 'Q', variables: () => ({ id: 1 }), result: vi.fn()
			},
			watchQuery: vi.fn(() => ({ subscribe: vi.fn(), setVariables })),
			$watch: vi.fn((fn, cb) => watchCallbacks.push(cb)),
			$el: document.createElement('div'),
		});
		const mock = mockIntersectionObserver(ctx);

		runCreated(ctx);
		runMounted(ctx);
		mock.trigger(1);

		expect(ctx.$watch).toHaveBeenCalled();

		watchCallbacks[0]({ id: 2 });
		expect(setVariables).toHaveBeenCalledWith(expect.objectContaining({ id: 2 }));

		mock.restore();
	});
});
