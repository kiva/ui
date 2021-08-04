import { mount } from '@vue/test-utils';
import * as flssUtils from '@/util/flssUtils';
import flssLoanQuery from '@/graphql/query/flssLoansQuery.graphql';
// import * as LendFilterAlpha from '@/pages/Lend/FilterAlpha/LendFilterAlpha';

// TODO
// What to test?
//
// 	Test the function uses the right query, that it's using the right query

// How to set up test?
//
// 	it okay just to check that i made the call the right endfpoint.
// make sure
// 	How do I mock up a test for a call to an api endpoint?
// 	How to use Jest?

describe('flssUtils.js', () => {
	describe('fetchData', () => {
		const apollo = jest.mock('apollo');
		const query = jest.fn();
		// const localVue = createLocalVue();
		const loanQueryFilters = { any: ['US'] };

		// const wrapper = mount(LendFilterAlpha, {
		// // const wrapper = shallowMount(LendFilterAlpha, {
		// 	flssUtils,
		// 	mocks: {
		// 		$apollo: {
		// 			query,
		// 		},
		// 	},
		// });

		const wrapper = mount(flssUtils, {
			// const wrapper = shallowMount(LendFilterAlpha, {
			// flssUtils,
			mocks: {
				$apollo: {
					query,
				},
			},
		});

		const apolloVariables = {
			query: flssLoanQuery,
			variables: {
				flssLoanQuery,
				filterObject: loanQueryFilters,
				limit: 20
			},
			fetchPolicy: 'network-only',
		};

		it('Queries for currently fundraising loans', () => {
			// expect(wrapper.LendFilterAlpha.runQuery).toBeCalled();

			expect(wrapper.flssUtils.fetchData(loanQueryFilters, apollo)).toHaveBeenCalledWith({ any: ['US'] }, apollo);
			expect(wrapper.$apollo.query).toHaveBeenCalledWith(apolloVariables);
		});
	});
});
