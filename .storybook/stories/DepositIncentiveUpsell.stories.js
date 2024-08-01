import DepositIncentiveUpsell from '#src/components/Checkout/DepositIncentiveUpsell.vue';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import { mockLoansArray } from '../utils';

const mockLoans = mockLoansArray(4);

const queryResult = {
	data: {
		fundraisingLoans: {
			values: mockLoans,
		},
	},
};

const args = {
	goal: 50,
	progress: 25,
};

export default {
	title: 'Components/Checkout/DepositIncentiveUpsell',
	component: DepositIncentiveUpsell,
	args,
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { DepositIncentiveUpsell },
	mixins: [apolloStoryMixin({ queryResult })],
	setup() { return args; },
	template: '<deposit-incentive-upsell :goal="goal" :progress="progress" />',
});
