import Vue from 'vue'

import kivaPlugins from '@/plugins';
import Vue2TouchEvents from 'vue2-touch-events';
Vue.use(kivaPlugins)
Vue.use(Vue2TouchEvents);

import StoryRouter from 'storybook-vue-router';
import MonthlyGoodHomepage from '@/pages/Homepage/MonthlyGoodHomepage';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';
import { mockLoansArray } from '../utils';
import mockedLoanChannelsData from '../mock-data/loan-channels-data-mock';

const mockedAPIResponse = {
	data: {
		general: {
			homepage_category_rows: {
				key: "ui.homepage_category_rows",
				value: "[{\"id\":52},{\"id\":96},{\"id\":93},{\"id\":89},{\"id\":87},{\"id\":4},{\"id\":102},{\"id\":25}]"
			}
		},
		lend: {
			loanChannelsById: mockedLoanChannelsData
		},
	}
}

export default {
	title: 'Pages/MonthlyGoodHomepage',
	component: MonthlyGoodHomepage,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		MonthlyGoodHomepage,
	},
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: {
			readQuery() {
				return mockedAPIResponse.data;
			},
			query(params) {
				if (params.variables && params.variables.ids && params.variables.numberOfLoans) {
					const mockedLoanChannel = mockedAPIResponse.data.lend.loanChannelsById.find(channel => channel.id === params.variables.ids[0]);
					mockedLoanChannel.loans = {
						values: mockLoansArray(params.variables.numberOfLoans),
					};
					return Promise.resolve({
						data: {
							lend: {
								loanChannelsById: [
									mockedLoanChannel
								]
							}
						}

					});
				}
				return Promise.resolve(mockedAPIResponse);
			},
		},
	},
	template: `
		<monthly-good-homepage style="margin: -2rem" />
	`,
});
