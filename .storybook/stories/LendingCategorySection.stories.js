import LendingCategorySection from '#src/components/LoanFinding/LendingCategorySection.vue';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import loanData from '../mock-data/loan-data-mock';

const buildLoans = count => Array.from({ length: count }, (_unused, index) => ({
	...loanData[index % loanData.length],
	id: 3000 + index,
}));

const loans = buildLoans(6);

const queryResult = {
	data: {
		lend: {
			loan: loans[0],
		},
	},
};

export default {
	title: 'LoanFinding/LendingCategorySection',
	component: LendingCategorySection,
	parameters: {
		chromatic: { viewports: [414, 834, 1440] },
	},
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { LendingCategorySection },
		mixins: [
			apolloStoryMixin({ queryResult, fragmentResult: loans[0] }),
			cookieStoreStoryMixin(),
		],
		setup() { return { args }; },
		provide: {
			$kvTrackEvent: () => {},
		},
		template: `
			<lending-category-section v-bind="args" />
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({
	title: 'Recommended for you based on your lending history',
	loans,
});

export const ControlsTopRight = story({
	title: 'Recommended for you based on your lending history',
	loans,
	controlsTopRight: true,
});

export const WithSubtitle = story({
	title: 'Recommended for you',
	subtitle: 'Borrowers picked from the categories you lend to most',
	loans,
});

export const AllSlidesVisible = story({
	title: 'Recommended for you',
	loans: buildLoans(3),
});

export const LargeCards = story({
	title: 'Recommended for you',
	loans: buildLoans(4),
	perStep: 2,
});
