import BorrowerCarousel from '#src/components/MyKiva/BorrowerCarousel.vue';
import { mockLoansArray } from '../utils';
import apolloStoryMixin from "../mixins/apollo-story-mixin";
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

export default {
	title: 'MyKiva/BorrowerCarousel',
	component: BorrowerCarousel,
};

const mockLoans = mockLoansArray(3);

const queryResult = {
	data: {
		lend: {
			loan: mockLoans[0]
		}
	}
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { BorrowerCarousel },
		mixins: [apolloStoryMixin({ queryResult }), cookieStoreStoryMixin()],
		setup() { return { args }; },
		template: `
			<borrower-carousel v-bind="args" />
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({ loans: [mockLoans[0], mockLoans[1], mockLoans[2]] });
export const OneLoan = story({ loans: [mockLoans[0]] });
export const MoreThanLimit = story({ loans: [...mockLoans, mockLoans[0]] });
export const NoActiveLoans = story({ loans: [mockLoans[0], mockLoans[1], mockLoans[2]], hasActiveLoans: false });
export const Empty = story({ loans: [] });
