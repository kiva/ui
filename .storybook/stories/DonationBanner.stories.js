import DonationBanner from "#src/components/WwwFrame/PromotionalBanner/Banners/Donation/DonationBanner.vue";

const args = {
	isOpen: true,
	buttonAmounts: [20, 35, 50],
	headline: "Donate $50, get $25 to lend.",
	frequency: "monthly",
	bannerImageUrl:
		"//images.ctfassets.net/j0p9a6ql0rn7/46U7dagWY4pn1vaUPLYaYx/707ada55d0152f6d4b72aa74d894a22c/icon-heart.png",
};

export default {
	title: "WwwFrame/Banners/DonationBanner",
	component: DonationBanner,
	args,
};

export const Default = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		DonationBanner,
	},
	setup() { return args; },
	template: `
		<div>
			<donation-banner
				:button-amounts="buttonAmounts"
			  :headline="headline"
        :body="body"
        :disclaimer="hasDisclaimer"
        :banner-image-url="bannerImageUrl"
        :frequency="frequency"
        @close-banner="onCloseBanner"
			/>
		</div>
	`,
	methods: {
		onCloseBanner(bannerState) {
			console.log(bannerState);
			// set cookies here and isOpen state here
		},
	},
});
