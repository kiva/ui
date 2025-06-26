import BorrowerStatusCard from '#src/components/MyKiva/BorrowerStatusCard.vue';
import { mockLoansArray } from '../utils';
import apolloStoryMixin from "../mixins/apollo-story-mixin";
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import {
	PAYING_BACK,
	FUNDED,
	FUNDRAISING,
	RAISED,
	EXPIRED,
	REFUNDED,
	ENDED,
} from '#src/api/fixtures/LoanStatusEnum';

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
export const Repaying = story({ loan: { ...mockLoans[0], status: PAYING_BACK } });
export const Fundraising = story({ loan: { ...mockLoans[0], status: FUNDRAISING } });
export const Funded = story({ loan: { ...mockLoans[0], status: FUNDED } });
export const Raised = story({ loan: { ...mockLoans[0], status: RAISED } });
export const PayingBackDelinquent = story({ loan: { ...mockLoans[0], status: PAYING_BACK, delinquent: true } });
export const Expired = story({ loan: { ...mockLoans[0], status: EXPIRED } });
export const Refunded = story({ loan: { ...mockLoans[0], status: REFUNDED } });
export const Ended = story({ loan: { ...mockLoans[0], status: ENDED } });
