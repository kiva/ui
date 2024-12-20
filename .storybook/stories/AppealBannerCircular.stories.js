import AppealBannerCircular from '#src/components/WwwFrame/PromotionalBanner/Banners/AppealBanner/AppealBannerCircular.vue';

const args = {
	targetAmount: 450000,
	amountRaised: 300000,
	buttonAmounts: [20, 35, 50],
	headline: 'Donate $50, get $25 to lend.',
	body: '<p>Your support has been essential this year. Donate today to keep Kiva possible.</p>',
	isOpen: true,
	imageUrl: '//images.ctfassets.net/j0p9a6ql0rn7/6ymAUx6RA4sVnBgQ2lkJ7H/1fcebdc57efc014ab1726c572ea04530/Frame__export_this__.svg',
};

export default {
	title: 'WwwFrame/Banners/AppealBannerCircular',
	component: AppealBannerCircular,
	args,
};

const story = (storyArgs = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: {
			AppealBannerCircular,
		},
		setup() { return { ...args, ...storyArgs }; },
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
	template.args = args;
	return template;
};

export const Default = story();

export const MillionGoal = story({ targetAmount: 4550000 });
