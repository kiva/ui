import Vue from 'vue'

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

import StoryRouter from 'storybook-vue-router';
import LendByCategoryHomepage from '@/pages/Homepage/LendByCategoryHomepage';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import { mockLoansArray } from '../utils';
import mockedLoanChannelsData from '../mock-data/loan-channels-data-mock';

const mockedAPIResponse = {
	data: {
		general: {
			homepage_category_rows: {
				key: "ui.homepage_category_rows",
				value: "[{\"id\":52},{\"id\":96},{\"id\":93},{\"id\":89},{\"id\":87}]",
			}
		},
		lend: {
			loanChannelsById: mockedLoanChannelsData
		},
	}
}
export default {
	title: 'Promos/LendByCategoryHomepage',
	component: LendByCategoryHomepage,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		'lend-by-category-homepage': LendByCategoryHomepage,
	},
	mixins: [apolloStoryMixin],
	provide: {
		apollo: {
			readQuery() {
				return mockedAPIResponse.data;
			},
			query(params) {
				if (params.variables && params.variables.ids && params.variables.numberOfLoans) {
					const mockedLoanChannel = mockedAPIResponse.data.lend.loanChannelsById.find(channel => channel.id === params.variables.ids[0]);
					mockedLoanChannel.loans = {
						values:  mockLoansArray(params.variables.numberOfLoans),
					};
					return Promise.resolve({
						data: {
							lend: {
								loanChannelsById:[
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
		<lend-by-category-homepage style="margin: -2rem" />
	`,
});
