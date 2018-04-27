import _differenceBy from 'lodash/differenceBy';
import _find from 'lodash/find';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';

import helloQuery from '@/graphql/query/hello.graphql';
import myKivaInfoQuery from '@/graphql/query/myKivaInfo.graphql';
import myKivaSecondaryMenuQuery from '@/graphql/query/myKivaSecondaryMenu.graphql';
import myLendingStatsQuery from '@/graphql/query/myLendingStats.graphql';
import portfolioTertiaryMenu from '@/graphql/query/portfolioTertiaryMenu.graphql';
import lendMenuPrivateData from '@/graphql/query/lendMenuPrivateData.graphql';
import * as types from '@/store/mutation-types';

export default apollo => {
	const initialState = {
		userAccount: {
			id: null,
			balance: 0,
			publicId: null
		},
		lender: {
			image: {
				url: '',
			},
		},
		lendingStats: {
			countriesLentTo: [],
			countriesNotLentTo: [],
			totalCountries: 0,
			sectorsLentTo: [],
			sectorsNotLentTo: [],
			activitiesLentTo: [],
			activitiesNotLentTo: [],
			partnersLentTo: [],
			partnersNotLentTo: [],
			totalPartners: 0,
		},
		isBorrower: false,
		mostRecentBorrowedLoan: {
			id: null,
		},
		trustee: {
			id: null,
		},
		favoritesCount: 0,
		savedSearches: [],
	};

	return {
		state: initialState,
		getters: {
			isTrustee: state => state.trustee.id !== null
		},
		actions: {
			hello() {
				return apollo.query({ query: helloQuery });
			},
			getMyKivaInfo({ commit }) {
				return apollo.query({ query: myKivaInfoQuery })
					.then(result => result.data.my)
					.then(my => {
						commit(types.RECEIVE_MY_KIVA_INFO, {
							userAccount: my.userAccount,
							lender: my.lender,
							isBorrower: my.isBorrower,
							borrowedLoan: my.mostRecentBorrowedLoan,
							trustee: my.trustee,
						});
					})
					.catch(error => {
						if (_find(error.graphQLErrors, { code: 'api.authenticationRequired' })) {
							commit(types.SIGN_OUT);
						}
					});
			},
			getMyLendMenuInfo({ state, commit }) {
				if (state.userAccount.id) {
					return apollo.query({
						query: lendMenuPrivateData,
						variables: {
							userId: state.userAccount.id
						}
					})
						.then(result => result.data)
						.then(data => {
							commit(types.SET_PRIVATE_LEND_MENU_DATA, {
								count: data.loans.totalCount,
								savedSearches: data.my.savedSearches.values,
							});
						})
						.catch(error => {
							if (_find(error.graphQLErrors, { code: 'api.authenticationRequired' })) {
								commit(types.SET_PRIVATE_LEND_MENU_DATA, {
									count: 0,
									savedSearches: [],
								});
							}
						});
				}
				commit(types.SET_PRIVATE_LEND_MENU_DATA, {
					count: 0,
					savedSearches: [],
				});
			},
			getMyLendingStats({ commit }) {
				return apollo.query({ query: myLendingStatsQuery })
					.then(result => result.data)
					.then(data => {
						commit(types.SET_MY_LENDING_STATS, {
							allCountries: _sortBy(_map(data.countryFacets, 'country'), 'name'),
							countriesLentTo: _sortBy(data.my.lendingStats.countriesLentTo, 'name'),
							allSectors: _sortBy(data.kivaStats.sectors, 'name'),
							sectorsLentTo: _sortBy(data.my.lendingStats.sectorsLentTo, 'name'),
							allActivities: _sortBy(data.kivaStats.activities, 'name'),
							activitiesLentTo: _sortBy(data.my.lendingStats.activitiesLentTo, 'name'),
							allPartners: _sortBy(data.partners.values, 'name'),
							partnersLentTo: _sortBy(data.my.lendingStats.partnersLentTo, 'name'),
							totalPartners: data.partners.totalCount,
						});
					})
					.catch(error => {
						if (_find(error.graphQLErrors, { code: 'api.authenticationRequired' })) {
							// redirect to login
						}
					});
			},
			getMyKivaSecondaryMenu({ commit }) {
				return apollo.query({ query: myKivaSecondaryMenuQuery })
					.then(result => result.data.my)
					.then(my => {
						commit(types.RECEIVE_MY_KIVA_SECONDARY_MENU, {
							isBorrower: my.isBorrower,
							trustee: my.trustee,
						});
					})
					.catch(error => {
						if (_find(error.graphQLErrors, { code: 'api.authenticationRequired' })) {
							commit(types.SIGN_OUT);
						}
					});
			},
			getPortfolioTertiaryMenu({ commit }) {
				return apollo.query({ query: portfolioTertiaryMenu })
					.then(result => result.data.my)
					.then(my => {
						commit(types.RECEIVE_PORTFOLIO_TERTIARY_MENU, {
							userAccount: my.userAccount
						});
					})
					.catch(error => {
						if (_find(error.graphQLErrors, { code: 'api.authenticationRequired' })) {
							commit(types.SIGN_OUT);
						}
					});
			},
		},
		mutations: {
			[types.RECEIVE_MY_KIVA_INFO](state, data) {
				Object.assign(state.userAccount, data.userAccount);
				Object.assign(state.lender, data.lender);
				Object.assign(state.mostRecentBorrowedLoan, data.borrowedLoan);
				Object.assign(state.trustee, data.trustee);
				state.isBorrower = data.isBorrower;
			},
			[types.SIGN_OUT](state) {
				Object.assign(state, initialState);
			},
			[types.SET_PRIVATE_LEND_MENU_DATA](state, { count, savedSearches }) {
				state.favoritesCount = count;
				state.savedSearches = savedSearches;
			},
			[types.SET_MY_LENDING_STATS](state, {
				allCountries,
				countriesLentTo,
				allSectors,
				sectorsLentTo,
				allActivities,
				activitiesLentTo,
				allPartners,
				partnersLentTo,
				totalPartners,
			}) {
				Object.assign(state.lendingStats, {
					countriesLentTo,
					countriesNotLentTo: _differenceBy(allCountries, countriesLentTo, 'isoCode'),
					totalCountries: allCountries.length,
					sectorsLentTo,
					sectorsNotLentTo: _differenceBy(allSectors, sectorsLentTo, 'id'),
					activitiesLentTo,
					activitiesNotLentTo: _differenceBy(allActivities, activitiesLentTo, 'id'),
					partnersLentTo,
					partnersNotLentTo: _differenceBy(allPartners, partnersLentTo, 'id'),
					totalPartners,
				});
			},
			[types.RECEIVE_MY_KIVA_SECONDARY_MENU](state, data) {
				Object.assign(state.trustee, data.trustee);
				state.isBorrower = data.isBorrower;
			},
			[types.RECEIVE_PORTFOLIO_TERTIARY_MENU](state, data) {
				Object.assign(state.userAccount, data.userAccount);
			},
		},
	};
};
