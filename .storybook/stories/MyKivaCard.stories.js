import MyKivaCard from '#src/components/MyKiva/MyKivaCard.vue';
import { badgeFirstTierComplete } from '../mock-data/badge-journey-data-mock';

export default {
	title: 'MyKiva/MyKivaCard',
	component: MyKivaCard,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { MyKivaCard },
		setup() { return { args }; },
		template: `
			<div style="width: 330px;">
				<MyKivaCard v-bind="args" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({
	bgImage: "//images.ctfassets.net/j0p9a6ql0rn7/ribyKXIQHzSV1Z86Uhx82/fbbae279243ed552237b9f2be824a660/CLIMATE_-_New.jpg",
	hasGradient: true,
	isBgTopAligned: false,
	isBlackSubtitle: false,
	isFullWidthPrimaryCta: false,
	isTitleFontSans: false,
	primaryCtaText: "Lend to climate solutions",
	primaryCtaVariant: "secondary",
	secondaryCtaText: "",
	subtitle: "Keep lending to reach your next achievement",
	title: "Your progress: 2/3 loans",
	titleColor: ""	
});

export const MoreWays = story({
	bgImage: "//images.ctfassets.net/j0p9a6ql0rn7/1dn5cF9oS7uI5XrdA33YDp/8b3d74c2e352ef548f3ee52b056c7332/donate.png",
	hasGradient: false,
	isBgTopAligned: true,
	isBlackSubtitle: true,
	isFullWidthPrimaryCta: true,
	isTitleFontSans: true,
	primaryCtaText: "Donate to Kiva",
	primaryCtaVariant: "primary",
	secondaryCtaText: "",
	subtitle: "",
	title: "Support lasting change by donating to Kiva’s mission",
	titleColor: "tw-text-action-highlight"
});

export const Recommended = story({
	hasGradient: false,
	isBgTopAligned: true,
	isBlackSubtitle: true,
	isFullWidthPrimaryCta: true,
	isTitleFontSans: true,
	primaryCtaText: "Fund a Woman",
	primaryCtaVariant: "primary",
	secondaryCtaText: "",
	subtitle: "",
	title: "Give women an equal opportunity to succeed.",
	titleColor: "tw-text-action-highlight",
	imageUrl: "https://www.development.kiva.org/img/w600/a54fdc6d3be8a104d9e3f113728eedb6.jpg",
	tagText: "Recommended: Loans to Women",
	showCtaIcon: true,
});