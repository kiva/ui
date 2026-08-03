// @vitest-environment node
import { getAttachedOperations } from '#src/util/composableOperations';

describe('composableOperations', () => {
	describe('getAttachedOperations', () => {
		it('collects attached operations and applies the prefetch default', () => {
			const opA = { query: { kind: 'Document' } };
			const opB = { query: {} };
			const components = [{ preFetchOperations: [opA] }, { preFetchOperations: [opB] }];
			expect(getAttachedOperations(components)).toEqual([
				{ preFetch: true, query: opA.query },
				{ preFetch: true, query: opB.query },
			]);
		});

		it('dedupes an operation shared by several definitions by identity', () => {
			const op = { query: {} };
			const components = [{ preFetchOperations: [op] }, { preFetchOperations: [op] }];
			expect(getAttachedOperations(components)).toHaveLength(1);
		});

		it('lets an explicit authored preFetch flag win over the default', () => {
			const op = { query: {}, preFetch: false };
			expect(getAttachedOperations([{ preFetchOperations: [op] }])[0].preFetch).toBe(false);
		});

		it('ignores definitions without attached operations', () => {
			expect(getAttachedOperations([{}, { apollo: [] }, null])).toEqual([]);
		});

		it('returns an empty array for missing input', () => {
			expect(getAttachedOperations(undefined)).toEqual([]);
		});
	});
});
