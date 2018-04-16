import _find from 'lodash/find';

import helloQuery from '@/graphql/query/hello.graphql';
import myKivaInfoQuery from '@/graphql/query/myKivaInfo.graphql';
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
		favoritesCount: 0,
		savedSearches: [],
	};

	return {
		state: initialState,
		getters: {},
		actions: {
			hello() {
				return apollo.query({ query: helloQuery });
			},
			getMyKivaInfo({ commit }) {
				return apollo.query({ query: myKivaInfoQuery })
					.then(result => {
						commit(types.RECEIVE_MY_KIVA_INFO, {
							userAccount: result.data.my.userAccount,
							lender: result.data.my.lender,
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
		mutations: {
			[types.RECEIVE_MY_KIVA_INFO](state, { userAccount, lender }) {
				Object.assign(state.userAccount, userAccount);
				Object.assign(state.lender, lender);
			},
			[types.SIGN_OUT](state) {
				Object.assign(state, initialState);
			},
			[types.SET_PRIVATE_LEND_MENU_DATA](state, { count, savedSearches }) {
				state.favoritesCount = count;
				state.savedSearches = savedSearches;
			},
		},
	};
};
