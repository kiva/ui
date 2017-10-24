// import find from 'lodash-es/find';
// var find = require('lodash-es/find');
import find from 'lodash/find';

import apollo from '@/api/apollo';
import myKivaInfoQuery from '@/graphql/query/myKivaInfo.gql';
import * as types from '../mutation-types';

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

const getters = {};

const actions = {
	getMyKivaInfo({ commit }) {
		apollo.query({ query: myKivaInfoQuery })
		.then((result) => {
			commit(types.RECEIVE_MY_KIVA_INFO, {
				userAccount: result.data.my.userAccount,
				lender: result.data.my.lender,
			});
		})
		.catch((error) => {
			if (find(error.graphQLErrors, { code: 'api.authenticationRequired' })) {
				commit(types.SIGN_OUT);
			}
		});
	},
};

/* eslint-disable no-param-reassign */
const mutations = {
	[types.RECEIVE_MY_KIVA_INFO](state, { userAccount, lender }) {
		Object.assign(state.userAccount, userAccount);
		Object.assign(state.lender, lender);
	},
	[types.SIGN_OUT](state) {
		Object.assign(state, initialState);
	},
};

export default {
	state: initialState,
	getters,
	actions,
	mutations,
};
