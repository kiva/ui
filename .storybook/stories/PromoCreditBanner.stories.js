import Vue from 'vue'
import StoryRouter from 'storybook-vue-router';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';

import PromoCreditBanner from '@/components/WwwFrame/PromotionalBanner/PromoCreditBanner.vue';

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
				promoBalance: "10.00",
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
};

export default {
	title: 'WwwFrame/Banners/PromoCreditBanner',
	component: PromoCreditBanner,
	decorators: [StoryRouter()],

};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		PromoCreditBanner
	},
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin()],
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
		<promo-credit-banner />
	`,
});
