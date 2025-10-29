import myResolverFactory from '../../../../../src/api/localResolvers/my';
import CookieStore from '../../../../../src/util/cookieStore';
import { MockKvAuth0 } from '../../../../../src/util/KvAuth0';
import clearDocumentCookies from '../../../setup/clearDocumentCookies';

describe('my.js', () => {
	describe('myResolverFactory', () => {
		it('should return empty object when cookieStore is not provided', () => {
			const result = myResolverFactory({ cookieStore: null, kvAuth0: MockKvAuth0 });
			expect(result).toEqual({});
		});

		it('should return empty object when kvAuth0 is not provided', () => {
			const cookieStore = new CookieStore({});
			const result = myResolverFactory({ cookieStore, kvAuth0: null });
			expect(result).toEqual({});
		});
	});

	describe('Query.hasEverLoggedIn', () => {
		function testHasEverLoggedIn(expected, {
			context = {},
			cookies = {},
			kvAuth0 = MockKvAuth0,
		} = {}) {
			const cookieStore = new CookieStore(cookies);
			const { resolvers } = myResolverFactory({ cookieStore, kvAuth0 });

			const result = resolvers.Query.hasEverLoggedIn(null, {}, context);
			expect(result).toBe(expected);
		}

		afterEach(() => {
			clearDocumentCookies();
		});

		it('Returns true if the user is currently logged in', () => {
			const kvAuth0 = {
				getKivaId: vi.fn().mockReturnValue('123456')
			};
			testHasEverLoggedIn(true, { kvAuth0 });
			expect(kvAuth0.getKivaId.mock.calls.length).toBe(1);
		});
		it('Returns true if the user has a kvu cookie', () => {
			const cookies = {
				kvu: '123456',
			};
			testHasEverLoggedIn(true, { cookies });
		});
		it('Returns true if the cached value for this field is true', () => {
			const context = {
				cache: {
					readQuery: vi.fn().mockReturnValue({
						hasEverLoggedIn: true,
					}),
				},
			};
			testHasEverLoggedIn(true, { context });
			expect(context.cache.readQuery.mock.calls.length).toBe(1);
		});
		it('Returns false by default in all other cases', () => {
			testHasEverLoggedIn(false);
		});
	});

	describe('My.lastLoginTimestamp', () => {
		it('should return last login timestamp from kvAuth0', () => {
			const mockTimestamp = 1234567890;
			const kvAuth0 = {
				getLastLogin: vi.fn().mockReturnValue(mockTimestamp)
			};
			const cookieStore = { get: vi.fn() };
			const { resolvers } = myResolverFactory({ cookieStore, kvAuth0 });

			const result = resolvers.My.lastLoginTimestamp();

			expect(result).toBe(mockTimestamp);
			expect(kvAuth0.getLastLogin).toHaveBeenCalledTimes(1);
		});
	});
});
