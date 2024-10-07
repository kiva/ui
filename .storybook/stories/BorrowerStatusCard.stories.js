import BorrowerStatusCard from '#src/components/MyKiva/BorrowerStatusCard.vue';
import { mockLoansArray } from '../utils';
import apolloStoryMixin from "../mixins/apollo-story-mixin";
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

export default {
	title: 'MyKiva/BorrowerStatusCard',
	component: BorrowerStatusCard,
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
		components: { BorrowerStatusCard },
		mixins: [apolloStoryMixin({ queryResult }), cookieStoreStoryMixin()],
		setup() { return { args }; },
		provide: {
			$kvTrackEvent: () => Promise.resolve({
				fn: () => ({}),
			}),
		},
		template: `
			<borrower-status-card v-bind="args" />
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({ loan: mockLoans[0] });
export const Repaying = story({ loan: { ...mockLoans[0], status: 'payingBack' } });
