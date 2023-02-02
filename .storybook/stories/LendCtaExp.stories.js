import LendCtaExp from '@/components/LoanCards/Buttons/LendCtaExp';
import { mockLoansArray } from '../utils';

const loan = mockLoansArray(1)[0];


export default {
    title: 'Components/Lend CTA Exp',
    component: LendCtaExp,
    args: { loan: loan },
};

export const Default = (_args, { argTypes }) => ({
    props: Object.keys(argTypes),
	components: { LendCtaExp },
	template: `
			<lend-cta-exp
				:loan="loan"
				:is-loading="false"
			/>
		`,
});

export const LessThan25 = Default.bind({});
LessThan25.args = {
	loan: {
		...loan,
		unreservedAmount: 15
	},
};

export const Non25Increments = Default.bind({});
Non25Increments.args = {
	loan: {
		...loan,
		unreservedAmount: 30
	},
};

export const FullyFunded = Default.bind({});
FullyFunded.args = {
	loan: {
		...loan,
		unreservedAmount: 0
	},
};

export const AddingToBasket = (_args, { argTypes }) => ({
    props: Object.keys(argTypes),
	components: { LendCtaExp },
	template: `
			<lend-cta-exp
				:loan="loan"
				:is-loading="false"
				:is-adding="true"
			/>
		`,
});
