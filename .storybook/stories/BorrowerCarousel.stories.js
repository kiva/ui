import BorrowerCarousel from '#src/components/MyKiva/BorrowerCarousel.vue';
import {
	FUNDED,
	FUNDRAISING,
	INACTIVE,
	PAYING_BACK,
} from '#src/api/fixtures/LoanStatusEnum';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import loanData from '../mock-data/loan-data-mock';

const activeStatuses = [FUNDRAISING, PAYING_BACK, FUNDED];

const buildLoans = (count, status) => Array.from({ length: count }, (_unused, index) => ({
	...loanData[index % loanData.length],
	id: 1000 + index,
	status: status ?? activeStatuses[index % activeStatuses.length],
}));

const mockLoans = buildLoans(3);

const queryResult = {
	data: {
		lend: {
			loan: mockLoans[0],
		},
	},
};

export default {
	title: 'MyKiva/BorrowerCarousel',
	component: BorrowerCarousel,
	parameters: {
		chromatic: { viewports: [414, 834, 1440] },
	},
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { BorrowerCarousel },
		mixins: [apolloStoryMixin({ queryResult }), cookieStoreStoryMixin()],
		setup() { return { args }; },
		provide: {
			$kvTrackEvent: () => {},
		},
		template: `
			<div style="max-width: 1200px;">
				<borrower-carousel v-bind="args" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({ loans: mockLoans, totalLoans: mockLoans.length });

export const OneLoan = story({ loans: buildLoans(1), totalLoans: 1 });

export const MoreThanLimit = story({ loans: buildLoans(10), totalLoans: 10 });

export const ControlsTopRight = story({
	loans: mockLoans,
	totalLoans: mockLoans.length,
	controlsTopRight: true,
});

export const WithSeeAllCard = story({ loans: mockLoans, totalLoans: 24 });

export const WithCarouselTabs = story({
	loans: buildLoans(6),
	totalLoans: 6,
	showCarouselTabs: true,
});

export const NoActiveLoans = story({ loans: buildLoans(3, INACTIVE), totalLoans: 0 });

export const Empty = story({ loans: [], totalLoans: 0 });
