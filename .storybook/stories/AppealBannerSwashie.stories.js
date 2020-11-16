import Vue from 'vue'
import StoryRouter from 'storybook-vue-router';
import AppealBannerSwashie from '@/components/WwwFrame/PromotionalBanner/Banners/AppealBanner/AppealBannerSwashie.vue';

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

export default {
	title: 'WwwFrame/Banners/AppealBannerSwashie',
	component: AppealBannerSwashie,
	decorators: [StoryRouter()],
	args: {
		targetAmount: 10000,
		amountRaised: 2000,
		buttonAmounts: [20, 35, 50],
		headline: 'Donate $50, get $25 to lend.',
		body: '<p>Your support has been essential this year. Donate today to keep Kiva possible.</p>',
		isOpen: true,
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		AppealBannerSwashie,
	},
	template: `
		<div>
			<appeal-banner-swashie
				:target-amount="targetAmount"
				:amount-raised="amountRaised"
				:button-amounts="buttonAmounts"
				:headline="headline"
				:body="body"
				:is-open="isOpen"
				@toggle-banner="onToggleBanner"
				@amount-selected="onAmountSelected"
			/>
		</div>
	`,
	methods: {
		onAmountSelected(amount) {
			console.log(amount)
			// update apollo and redirect to cart here
		},
		onToggleBanner(bannerState) {
			console.log(bannerState);
			// set cookies here and isOpen state here
		}
	}
});
