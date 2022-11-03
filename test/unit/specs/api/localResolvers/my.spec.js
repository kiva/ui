import myResolverFactory from '@/api/localResolvers/my';
import CookieStore from '@/util/cookieStore';
import { MockKvAuth0 } from '@/util/KvAuth0';
import clearDocumentCookies from '../../../setup/clearDocumentCookies';

describe('my.js', () => {
	describe('Query.hasEverLoggedIn', () => {
		function testHasEverLoggedIn(expected, {
			context = {},
			cookies = {},
			kvAuth0 = MockKvAuth0,
		} = {}) {
			const cookieStore = new CookieStore(cookies);
			const { typePolicies } = myResolverFactory({ cookieStore, kvAuth0 });

			const result = typePolicies.Query.hasEverLoggedIn(null, {}, context);
			expect(result).toBe(expected);
		}

		afterEach(() => {
			clearDocumentCookies();
		});

		it('Returns true if the user is currently logged in', () => {
			const kvAuth0 = {
				getKivaId: jest.fn().mockReturnValue('123456')
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
					readQuery: jest.fn().mockReturnValue({
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
});
