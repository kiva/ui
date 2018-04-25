import createMyModule from '@/store/modules/my';
import * as types from '@/store/mutation-types';

describe('my.js', () => {
	const myModule = createMyModule();

	describe('mutations', () => {
		it('RECEIVE_MY_KIVA_INFO should update the state', () => {
			const state = {
				userAccount: {},
				lender: {},
				isBorrower: false,
				mostRecentBorrowedLoan: {},
				trustee: {},
			};
			const updates = {
				userAccount: { id: 1234, balance: 25 },
				lender: { image: { url: 'http://www.kiva.org' } },
				isBorrower: true,
				borrowedLoan: { id: 5678 },
				trustee: { id: 280 }
			};
			myModule.mutations[types.RECEIVE_MY_KIVA_INFO](state, updates);
			expect(state.userAccount.id).toEqual(updates.userAccount.id);
			expect(state.userAccount.balance).toEqual(updates.userAccount.balance);
			expect(state.lender.image.url).toEqual(updates.lender.image.url);
			expect(state.isBorrower).toEqual(updates.isBorrower);
			expect(state.mostRecentBorrowedLoan.id).toEqual(updates.borrowedLoan.id);
			expect(state.trustee.id).toEqual(updates.trustee.id);
		});

		it('SIGN_OUT should reset to initial state', () => {
			const state = {};
			myModule.mutations[types.SIGN_OUT](state);
			expect(state.userAccount.id).toEqual(null);
			expect(state.userAccount.balance).toEqual(0);
			expect(state.lender.image.url).toEqual('');
			expect(state.favoritesCount).toEqual(0);
			expect(state.savedSearches).toEqual([]);
			expect(state.isBorrower).toEqual(false);
			expect(state.mostRecentBorrowedLoan.id).toEqual(null);
			expect(state.trustee.id).toEqual(null);
		});

		it('SET_MY_LENDING_STATS should update lending stats', () => {
			const state = {
				lendingStats: {
					countriesLentTo: [],
					countriesNotLentTo: [],
					totalCountries: 0,
					sectorsLentTo: [],
					sectorsNotLentTo: [],
					activitiesLentTo: [],
					activitiesNotLentTo: [],
				}
			};
			const updates = {
				countriesLentTo: [
					{ isoCode: 'BI', name: 'Burundi' },
					{ isoCode: 'TZ', name: 'Tanzania' },
				],
				allCountries: [
					{ isoCode: 'BJ', name: 'Benin' },
					{ isoCode: 'BI', name: 'Burundi' },
					{ isoCode: 'TZ', name: 'Tanzania' },
					{ isoCode: 'UG', name: 'Uganda' },
				],
				sectorsLentTo: [
					{ id: 1, name: 'Agriculture' },
					{ id: 3, name: 'Transportation' },
				],
				allSectors: [
					{ id: 1, name: 'Agriculture' },
					{ id: 3, name: 'Transportation' },
					{ id: 4, name: 'Services' },
					{ id: 5, name: 'Clothing' },
				],
				activitiesLentTo: [
					{ id: 15, name: 'Grocery Store' },
					{ id: 17, name: 'Musical Performance' },
				],
				allActivities: [
					{ id: 15, name: 'Grocery Store' },
					{ id: 17, name: 'Musical Performance' },
					{ id: 18, name: 'Water Distribution' },
					{ id: 19, name: 'Cosmetics Sales' },
				],
			};
			const expected = {
				lendingStats: {
					countriesLentTo: [
						{ isoCode: 'BI', name: 'Burundi' },
						{ isoCode: 'TZ', name: 'Tanzania' },
					],
					countriesNotLentTo: [
						{ isoCode: 'BJ', name: 'Benin' },
						{ isoCode: 'UG', name: 'Uganda' },
					],
					totalCountries: updates.allCountries.length,
					sectorsLentTo: [
						{ id: 1, name: 'Agriculture' },
						{ id: 3, name: 'Transportation' },
					],
					sectorsNotLentTo: [
						{ id: 4, name: 'Services' },
						{ id: 5, name: 'Clothing' },
					],
					activitiesLentTo: [
						{ id: 15, name: 'Grocery Store' },
						{ id: 17, name: 'Musical Performance' },
					],
					activitiesNotLentTo: [
						{ id: 18, name: 'Water Distribution' },
						{ id: 19, name: 'Cosmetics Sales' },
					],
				}
			};
			myModule.mutations[types.SET_MY_LENDING_STATS](state, updates);
			expect(state.lendingStats).toEqual(expected.lendingStats);
		});

		it('SET_PRIVATE_LEND_MENU_DATA should update favoritesCount and savedSearches', () => {
			const state = { favoritesCount: 0, savedSearches: [] };
			const updates = {
				count: 2,
				savedSearches: [1, 2, 3],
			};
			myModule.mutations[types.SET_PRIVATE_LEND_MENU_DATA](state, updates);
			expect(state.favoritesCount).toEqual(updates.count);
			expect(state.savedSearches).toEqual(updates.savedSearches);
		});

		it('RECEIVE_MY_KIVA_SECONDARY_MENU should update isBorrower and trustee', () => {
			const state = {
				isBorrower: false,
				trustee: {},
			};
			const updates = {
				isBorrower: true,
				trustee: { id: 280 }
			};
			myModule.mutations[types.RECEIVE_MY_KIVA_SECONDARY_MENU](state, updates);
			expect(state.isBorrower).toEqual(updates.isBorrower);
			expect(state.trustee.id).toEqual(updates.trustee.id);
		});

		it('RECEIVE_PORTFOLIO_TERTIARY_MENU should update userAccount with balance and publicId', () => {
			const state = {
				userAccount: {},
			};
			const updates = {
				userAccount: { publicId: 'sayMyName12345', balance: 25 },
			};
			myModule.mutations[types.RECEIVE_PORTFOLIO_TERTIARY_MENU](state, updates);
			expect(state.userAccount.balance).toEqual(updates.userAccount.balance);
			expect(state.userAccount.publicId).toEqual(updates.userAccount.publicId);
		});
	});
});
