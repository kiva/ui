import _find from 'lodash/find';

import helloQuery from '@/graphql/query/hello.graphql';
import myKivaInfoQuery from '@/graphql/query/myKivaInfo.graphql';
import myKivaSecondaryMenuQuery from '@/graphql/query/myKivaSecondaryMenu.graphql';
import lendMenuPrivateData from '@/graphql/query/lendMenuPrivateData.graphql';
import * as types from '@/store/mutation-types';

export default apollo => {
	const initialState = {
		userAccount: {
			id: null,
			balance: 0,
		},
		lender: {
			image: {
				url: '',
			},
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
			[types.RECEIVE_MY_KIVA_SECONDARY_MENU](state, data) {
				Object.assign(state.trustee, data.trustee);
				state.isBorrower = data.isBorrower;
			},
		},
	};
};
