import LendCtaExp from '@/components/LoanCards/Buttons/LendCtaExp';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import { mockLoansArray } from '../utils';

const loan = mockLoansArray(1)[0];

const queryResult = {
	data: {
		lend: {
			loan
		},
	}
};

const queryResultLess25 = {
	data: {
		lend: {
			loan: {
                ...loan,
                unreservedAmount: 15
            }
		},
	}
};

const queryNon25Inc = {
	data: {
		lend: {
			loan: {
                ...loan,
                unreservedAmount: 30
            }
		},
	}
};

const queryFullyFunded = {
	data: {
		lend: {
			loan: {
                ...loan,
                unreservedAmount: 0
            }
		},
	}
};

export default {
    title: 'Components/Lend CTA Exp',
    component: LendCtaExp,
    args: { loanId: loan.id },
};

export const Default = (_args, { argTypes }) => ({
    props: Object.keys(argTypes),
	components: { LendCtaExp },
	mixins: [apolloStoryMixin({ queryResult }), cookieStoreStoryMixin()],
	template: `
			<lend-cta-exp
				:loan-id="loanId"
			/>
		`,
});

export const LessThan25 = (_args, { argTypes }) => ({
    props: Object.keys(argTypes),
	components: { LendCtaExp },
	mixins: [apolloStoryMixin({ queryResult: queryResultLess25 }), cookieStoreStoryMixin()],
	template: `
			<lend-cta-exp
				:loan-id="loanId"
			/>
		`,
});

export const Non25Increments = (_args, { argTypes }) => ({
    props: Object.keys(argTypes),
	components: { LendCtaExp },
	mixins: [apolloStoryMixin({ queryResult: queryNon25Inc }), cookieStoreStoryMixin()],
	template: `
			<lend-cta-exp
				:loan-id="loanId"
			/>
		`,
});

export const FullyFunded = (_args, { argTypes }) => ({
    props: Object.keys(argTypes),
	components: { LendCtaExp },
	mixins: [apolloStoryMixin({ queryResult: queryFullyFunded }), cookieStoreStoryMixin()],
	template: `
			<lend-cta-exp
				:loan-id="loanId"
			/>
		`,
});
