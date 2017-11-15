// import find from 'lodash-es/find';
// var find = require('lodash-es/find');
import find from 'lodash/find';

import myKivaInfoQuery from '@/graphql/query/myKivaInfo.graphql';
import * as types from '../mutation-types';

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
	};

	return {
		state: initialState,
		getters: {},
		actions: {
			getMyKivaInfo({ commit }) {
				apollo.query({ query: myKivaInfoQuery })
				.then(result => {
					commit(types.RECEIVE_MY_KIVA_INFO, {
						userAccount: result.data.my.userAccount,
						lender: result.data.my.lender,
					});
				})
				.catch(error => {
					if (find(error.graphQLErrors, { code: 'api.authenticationRequired' })) {
						commit(types.SIGN_OUT);
					}
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
		},
	};
};
