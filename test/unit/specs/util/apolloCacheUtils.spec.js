import { ApolloClient, InMemoryCache } from '@apollo/client';
import { mergeApolloCacheData } from '#src/util/apolloCacheUtils';

describe('mergeApolloCacheData (integration with ApolloClient)', () => {
	it('merges new data into the Apollo cache and retains extraRootIds', () => {
		const cache = new InMemoryCache();
		const client = new ApolloClient({
			cache,
			uri: '/graphql',
			defaultOptions: {},
		});

		// Set initial data
		cache.restore({
			ROOT_QUERY: { a: 1, b: 2 },
			foo: { bar: 1 },
		});

		const newData = {
			foo: { bar: 42 },
			baz: { qux: 99 },
			__META: { extraRootIds: ['baz'] },
		};

		mergeApolloCacheData(client, newData);

		const data = cache.extract();
		expect(data.foo).toEqual({ bar: 42 });
		expect(data.baz).toEqual({ qux: 99 });
		// ROOT_QUERY should remain unchanged
		expect(data.ROOT_QUERY).toEqual({ a: 1, b: 2 });
	});

	it('handles empty newData', () => {
		const cache = new InMemoryCache();
		const client = new ApolloClient({
			cache,
			uri: '/graphql',
			defaultOptions: {},
		});

		// Set initial data and merge empty newData
		cache.restore({ foo: { bar: 1 } });
		mergeApolloCacheData(client, {});

		const data = cache.extract();
		expect(data.foo).toEqual({ bar: 1 });
	});

	it('handles newData with only __META', () => {
		const cache = new InMemoryCache();
		const client = new ApolloClient({
			cache,
			uri: '/graphql',
			defaultOptions: {},
		});

		// Set initial data and merge newData with only __META
		cache.restore({ foo: { bar: 1 } });
		const newData = { __META: { extraRootIds: ['foo'] } };
		mergeApolloCacheData(client, newData);

		const data = cache.extract();
		expect(data.foo).toEqual({ bar: 1 });
	});
});
