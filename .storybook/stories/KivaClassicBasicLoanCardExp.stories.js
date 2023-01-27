import KivaClassicBasicLoanCardExp from '@/components/LoanCards/KivaClassicBasicLoanCardExp';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import { mockLoansArray } from '../utils';

export default {
	title: 'Loan Cards/Kiva Classic Basic Loan Card Exp',
	component: KivaClassicBasicLoanCardExp,
};

const loan = mockLoansArray(1)[0];

const queryResult = {
	data: {
		lend: {
			loan,
		},
	}
};

const story = (args = {}, isLoading = false, extraLoanProps = {}, extraData = {}) => {
	const result = extraLoanProps
		? {
			data: {
				lend: {
					loan: {
						...queryResult.data.lend.loan,
						...extraLoanProps
					}
				},
				...extraData
			}
		}
		: queryResult;

	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		mixins: [apolloStoryMixin({ ...(!isLoading && { queryResult: result }) }), cookieStoreStoryMixin()],
		components: { KivaClassicBasicLoanCardExp },
		template: `
			<kiva-classic-basic-loan-card-exp
				:loan-id="loanId"
				:lend-now-button="lendNowButton"
				:show-action-button="showActionButton"
				:use-full-width="useFullWidth"
				:show-tags="showTags"
				:in-grid="inGrid"
			/>
		`,
	})
	template.args = args;
	return template;
};

export const Default = story({
	loanId: loan.id,
});

export const Loading = story({
	loanId: loan.id,
}, true);

export const LendNowButton = story({
	loanId: loan.id,
	lendNowButton: true
});

export const ShowActionButton = story({
	loanId: loan.id,
	showActionButton: true
});

export const UseFullWidth = story({
	loanId: loan.id,
	useFullWidth: true
});

export const ShowTags = story({
	loanId: loan.id,
	showTags: true
});

export const InGrid = story({
	loanId: loan.id,
	inGrid: true
});

export const AllSharesReserved = story({
	loanId: loan.id,
}, false, { unreservedAmount: '0.00', fundraisingPercent: 1 });

export const Matched = story({
	loanId: loan.id,
}, false, { matchingText: 'Matched by Ebay', matchRatio: 1 });

export const InBasket = story({
	loanId: loan.id,
}, false, {}, { shop: { basket: { items: { values: [{ id: loan.id, __typename: 'LoanReservation' }] } } } });
