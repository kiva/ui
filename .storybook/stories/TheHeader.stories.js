import Vue from 'vue'
import { object } from '@storybook/addon-knobs';
import StoryRouter from 'storybook-vue-router';
import { MockKvAuth0 } from '@/util/KvAuth0';

import TheHeader from '@/components/WwwFrame/TheHeader';

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins);

const mockedApolloResponse = {
	data: {
		shop: {
			nonTrivialItemCount: 1,
		},
		my: {
			userAccount: {
				id: 1017469,
				balance: "0.00",
				promoBalance: "0.00",
			},
			lender: {
				image: {
					id: 726677,
					url: "https://www-dev-kiva-org.freetls.fastly.net/img/s140/726677.jpg",
				},
			},
			isBorrower: false,
			mostRecentBorrowedLoan: null,
			trustee: null,
		}
	}
}

export default {
	title: 'WwwFrame/TheHeader',
	component: TheHeader,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		TheHeader
	},
	provide: {
		apollo: {
			readQuery() {
				return mockedApolloResponse;
			},
			query() {
				return mockedApolloResponse;
			},
			watchQuery() {
				return {
					subscribe() { }
				}
			},
		},
		kvAuth0: MockKvAuth0
	},
	template: `
		<the-header />
	`,
});

export const HideSearchInHeader = () => ({
	components: {
		TheHeader
	},
	provide: {
		apollo: {
			readQuery() {
				return Promise.resolve(mockedApolloResponse);
			},
			query() {
				return Promise.resolve(mockedApolloResponse);
			},
			watchQuery() {
				return {
					subscribe() { }
				}
			},
		},
		kvAuth0: MockKvAuth0
	},
	template: `
		<the-header :hide-search-in-header="true" />
	`,
});

export const Themed = () => ({
	components: {
		TheHeader
	},
	provide: {
		apollo: {
			readQuery() {
				return Promise.resolve(mockedApolloResponse);
			},
			query() {
				return Promise.resolve(mockedApolloResponse);
			},
			watchQuery() {
				return {
					subscribe() { }
				}
			},
		},
		kvAuth0: MockKvAuth0
	},
	props: {
		theme: {
			type: Object,
			default() {
				return object('theme', {
					backgroundColor: '#060f9f',
					foregroundColor: 'yellow',
					accentColor: 'hsl(178, 97%, 35%)'
				});
			}
		}
	},
	template: `
		<the-header :theme="theme" />
	`,
});

