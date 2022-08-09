import Vue from 'vue'
import AppealBannerCircular from '@/components/WwwFrame/PromotionalBanner/Banners/AppealBanner/AppealBannerCircular.vue';

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

export default {
	title: 'WwwFrame/Banners/AppealBannerCircular',
	component: AppealBannerCircular,
	args: {
		targetAmount: 450000,
		amountRaised: 300000,
		buttonAmounts: [20, 35, 50],
		headline: 'Donate $50, get $25 to lend.',
		body: '<p>Your support has been essential this year. Donate today to keep Kiva possible.</p>',
		isOpen: true,
		imageUrl: '//images.ctfassets.net/j0p9a6ql0rn7/6ymAUx6RA4sVnBgQ2lkJ7H/1fcebdc57efc014ab1726c572ea04530/Frame__export_this__.svg',
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		AppealBannerCircular,
	},
	template: `
		<div>
			<appeal-banner-circular
				:target-amount="targetAmount"
				:amount-raised="amountRaised"
				:button-amounts="buttonAmounts"
				:headline="headline"
				:body="body"
				:is-open="isOpen"
				:image-url="imageUrl"
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
	},
});
