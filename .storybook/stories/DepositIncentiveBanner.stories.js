import Vue from 'vue'
import DepositIncentiveBanner from '@/components/WwwFrame/PromotionalBanner/Banners/DepositIncentiveBanner.vue';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins);

export default {
	title: 'WwwFrame/Banners/DepositIncentiveBanner',
	component: DepositIncentiveBanner,
};

const provideMockedApollo = (mockedResult) => {
	return {
		readQuery() {
			return mockedResult;
		},
		query() {
			return Promise.resolve(mockedResult);
		},
		watchQuery() {
			return {
				subscribe() { },
			};
		},
	};
};

const userInfo = {
  my: {
		id: 1017469,
		depositIncentiveAmountToLend: 25,
  },
	 shop: {
		id: 1,
		basket: {
			id: 1,
			items: {
				values: [
					{
						id: 1,
						price: '15',
					},
				],
			},
		},
		__typename: 'Shop',
	}
}

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
  mixins: [cookieStoreStoryMixin()],
	components: {
		DepositIncentiveBanner
	},
  provide: {
		apollo: provideMockedApollo({}),
	},
	template: `
		<deposit-incentive-banner />
	`,
});

export const WithBalance = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
  mixins: [cookieStoreStoryMixin()],
	components: {
		DepositIncentiveBanner
	},
  provide: {
		apollo: provideMockedApollo(userInfo),
	},
	template: `
		<deposit-incentive-banner />
	`,
});
