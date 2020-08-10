import Vue from 'vue'
import { object } from '@storybook/addon-knobs';
import StoryRouter from 'storybook-vue-router';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';

import TheHeader from '@/components/WwwFrame/TheHeader';

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins);

const mockedApolloResponse = {
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

export default {
	title: 'WwwFrame/TheHeader',
	component: TheHeader,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		TheHeader
	},
	mixins: [apolloStoryMixin, kvAuth0StoryMixin],
	template: `
		<the-header />
	`,
});

export const MinimalHeader = () => ({
	components: {
		TheHeader
	},
	mixins: [apolloStoryMixin, kvAuth0StoryMixin],
	template: `
		<the-header :minimal="true" />
	`,
});

export const LoggedInWithCart = () => ({
	components: {
		TheHeader
	},
	mixins: [kvAuth0StoryMixin],
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
	},
	template: `
		<the-header />
	`,
});

export const HideSearchInHeader = () => ({
	components: {
		TheHeader
	},
	mixins: [apolloStoryMixin, kvAuth0StoryMixin],
	template: `
		<the-header :hide-search-in-header="true" />
	`,
});

export const Themed = () => ({
	components: {
		TheHeader
	},
	mixins: [apolloStoryMixin, kvAuth0StoryMixin],
	props: {
		theme: {
			type: Object,
			default() {
				return object('theme', {
					backgroundColor: '#060f9f',
					textColor: 'orangered',
					logoColor: 'cyan',
					linkColor: 'yellow',
					linkHoverColor: 'pink',
					separatorColor: 'hsl(178, 97%, 35%)'
				});
			}
		}
	},
	template: `
		<the-header :theme="theme" />
	`,
});

