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
	};
};

const userInfo = {
  my: {
		id: 1017469,
		depositIncentiveAmountToLend: 20,
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
