import Vue from 'vue'

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

import StoryRouter from 'storybook-vue-router';
import LendByCategoryHomepage from '@/pages/Homepage/LendByCategoryHomepage';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import { returnArrayOfLoans } from '../utils';

const mockedAPIResponse = {
	data: {
		general: {
			homepage_category_rows: {
				key: "ui.homepage_category_rows",
				value: "[{\"id\":52},{\"id\":96},{\"id\":93},{\"id\":89},{\"id\":87}]",
			}
		},
		lend: {
			loanChannelsById:[
				{
					"id": 52,
					"name": "Loans to women",
					"description": "Women around the world have less access to fair credit—while 46% of men have access to formal financial services, only 27% women do. Support women starting businesses, going to school, leading their communities and building strong families.",
					"url": "https://dev-vm-01.kiva.org/lend/loans-to-women",
					"__typename": "LoanChannel"
				},
				{
					"id": 96,
					"name": "Covid-19",
					"description": "People across the world are economically impacted by the COVID-19 Coronavirus pandemic. Funding these loans will provide a financial safety net during an uncertain time, in addition to leading borrowers on a path to recovery.",
					"url": "https://dev-vm-01.kiva.org/lend/covid-19",
					"__typename": "LoanChannel"
				},
				{
					"id": 93,
					"name": "Shelter loans",
					"description": "Help borrowers create safe and stable homes for their families.",
					"url": "https://dev-vm-01.kiva.org/lend/shelter-loans",
					"__typename": "LoanChannel"
				},
				{
					"id": 89,
					"name": "Arts loans",
					"description": "With your support, artisans can buy more materials, grow their businesses and preserve local traditions.",
					"url": "https://dev-vm-01.kiva.org/lend/arts-loans",
					"__typename": "LoanChannel"
				},
				{
					"id": 87,
					"name": "Agriculture loans",
					"description": "Farmers face many challenges like unpredictable weather and market prices, and are often forced to choose between investing in their crops and fulfilling basic needs for their families. Your support keeps their crops growing and their livelihoods stable.",
					"url": "https://dev-vm-01.kiva.org/lend/agriculture-loans",
					"__typename": "LoanChannel"
				}
			]
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
				console.log(params);
				if (params.variables && params.variables.ids) {
					const mockedLoanChannel = mockedAPIResponse.data.lend.loanChannelsById.find(channel => channel.id === params.variables.ids[0]);
					mockedLoanChannel.loans = {
						values:  returnArrayOfLoans(params.variables.numberOfLoans),
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
			watchQuery() {
				return {
					subscribe() {}
				}
			},
		},
	},
	template: `
		<lend-by-category-homepage style="margin: -2rem" />
	`,
});
