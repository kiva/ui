import { ApolloClient, InMemoryCache } from '@apollo/client';
import { applyStateToCache, findIndexWithSameKeyField, mergeStateObjects } from '../../../../src/util/apolloCacheUtils';

describe('apolloCacheUtils', () => {
	describe('applyStateToCache (integration with ApolloClient)', () => {
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

			applyStateToCache(client, newData);

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
			applyStateToCache(client, {});

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
			applyStateToCache(client, newData);

			const data = cache.extract();
			expect(data.foo).toEqual({ bar: 1 });
		});
	});

	describe('findIndexWithSameKeyField', () => {
		it('finds index with same key field', () => {
			const target = [
				{ id: 1, __typename: 'TypeA' },
				{ id: 2, __typename: 'TypeB' },
			];
			const item = { id: 1, __typename: 'TypeA' };
			const index = findIndexWithSameKeyField(target, item);
			expect(index).toBe(0);
		});

		it('returns -1 if no matching key field found', () => {
			const target = [
				{ id: 1, __typename: 'TypeA' },
				{ id: 2, __typename: 'TypeB' },
			];
			const item = { id: 3, __typename: 'TypeC' };
			const index = findIndexWithSameKeyField(target, item);
			expect(index).toBe(-1);
		});

		it('uses custom key field for Country', () => {
			const target = [
				{ isoCode: 'US', __typename: 'Country' },
				{ isoCode: 'CA', __typename: 'Country' },
			];
			const item = { isoCode: 'CA', __typename: 'Country' };
			const index = findIndexWithSameKeyField(target, item);
			expect(index).toBe(1);
		});

		it('returns -1 if no key field is found', () => {
			const target = [
				{ foo: 1, __typename: 'TypeA' },
			];
			const item = { foo: 1, __typename: 'TypeA' };
			const index = findIndexWithSameKeyField(target, item);
			expect(index).toBe(-1);
		});
	});

	describe('mergeStateObjects', () => {
		it('merges two state objects with no conflicts', () => {
			const a = {
				'Manifest:AFl1CjEpiH-vT6aW7IEeKA==': {
					items: {
						values: [
							{ __ref: 'LoanReservation:2991705' },
							{ __ref: 'Donation:105213976' },
						]
					},
					totals: {
						bonusAvailableTotal: '0.00',
						creditAvailableTotal: '0.00',
						freeTrialAvailableTotal: '0.00',
					},
				},
			};
			const b = {
				'Manifest:AFl1CjEpiH-vT6aW7IEeKA==': {
					items: {
						values: [
							{ __ref: 'LoanReservation:2991705' },
							{ __ref: 'Donation:105213976' },
						]
					},
					totals: {
						bonusAvailableTotal: '0.00',
						creditAvailableTotal: '0.00',
						freeTrialAvailableTotal: '0.00',
						loanReservationTotal: '25.00',
						redemptionCodeAvailableTotal: '0.00',
						universalCodeAvailableTotal: '0.00',
					}
				},
				'Image:5956218': {
					id: 5956218,
					url: 'https://www.kiva.org/img/s100/4e245f4ed473f4c825ad5e4849d673c9.webp',
					__typename: 'Image',
				}
			};
			const result = mergeStateObjects(a, b);
			expect(result['Manifest:AFl1CjEpiH-vT6aW7IEeKA=='].items.values.length).toBe(2);
			expect(result['Manifest:AFl1CjEpiH-vT6aW7IEeKA=='].totals.loanReservationTotal).toBe('25.00');
			expect(result['Image:5956218'].id).toBe(5956218);
		});

		it('merges arrays with custom key field', () => {
			const a = {
				Country: [
					{ isoCode: 'US', name: 'United States', __typename: 'Country' },
					{ isoCode: 'CA', name: 'Canada', __typename: 'Country' },
				],
			};
			const b = {
				Country: [
					{ isoCode: 'CA', name: 'Canada Updated', __typename: 'Country' },
					{ isoCode: 'MX', name: 'Mexico', __typename: 'Country' },
				],
			};
			const result = mergeStateObjects(a, b);
			expect(result.Country.length).toBe(3);
			expect(result.Country.find(c => c.isoCode === 'CA').name).toBe('Canada Updated');
			expect(result.Country.find(c => c.isoCode === 'MX').name).toBe('Mexico');
		});

		it('does not add duplicate objects (deep equal)', () => {
			const a = {
				arr: [
					{ id: 1, __typename: 'TypeA', foo: 'bar' },
				],
			};
			const b = {
				arr: [
					{ id: 1, __typename: 'TypeA', foo: 'bar' },
				],
			};
			const result = mergeStateObjects(a, b);
			expect(result.arr.length).toBe(1);
		});

		it('merges arrays of primitives', () => {
			const a = { arr: [1, 2, 3] };
			const b = { arr: [3, 4, 5] };
			const result = mergeStateObjects(a, b);
			// Should merge and deduplicate by deep equality
			expect(result.arr).toEqual([1, 2, 3, 4, 5]);
		});
	});
});
