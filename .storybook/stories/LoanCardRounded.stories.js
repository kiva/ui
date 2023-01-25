import LoanCardRounded from '@/components/LoanCards/LoanCardRounded';
import { mockLoansArray } from '../utils';
import apolloStoryMixin from '../mixins/apollo-story-mixin';

export default {
	title: 'Loan Cards/Loan Card Rounded',
	component: LoanCardRounded,
};

const loan = mockLoansArray(1)[0];
const amountLeft =  loan.loanAmount;

const fundedLoan = JSON.parse(JSON.stringify(loan));
fundedLoan.status = 'funded';

const matchedLoan = JSON.parse(JSON.stringify(loan));
matchedLoan.matchingText = 'Matched by Ebay'
matchedLoan.matchRatio = 2;

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		mixins: [apolloStoryMixin()],
		components: { LoanCardRounded },
		template: `
			<div style="width: 500px;">
				<loan-card-rounded
					:amount-left="amountLeft"
					:expiring-soon-message="expiringSoonMessage"
					:is-favorite="isFavorite"
					:is-funded="isFunded"
					:is-match-at-risk="isMatchAtRisk"
					:is-selected-by-another="isSelectedByAnother"
					:is-visitor="isVisitor"
					:items-in-basket="itemsInBasket"
					:loan="loan"
					:percent-raised="percentRaised"
					:title="title"
					:show-tags="showTags"
				/>
			</div>
		`,
	})
	template.args = args;
	return template;
};

export const Default = story({
	amountLeft,
	loan,
	isVisitor: false
});

export const ExpiringSoon = story({
	amountLeft,
	loan,
	isVisitor: false,
	expiringSoonMessage: 'Loan expires soon'
});

export const Favorite = story({
	amountLeft,
	loan,
	isVisitor: false,
	isFavorite: true
});

export const Funded = story({
	amountLeft,
	loan: fundedLoan,
	isVisitor: false,
	isFunded: true,
});

export const Matched = story({
	amountLeft,
	loan: matchedLoan,
	isVisitor: false,
});

export const MatchAtRisk = story({
	amountLeft,
	loan: matchedLoan,
	isVisitor: false,
	isMatchAtRisk: true
});

export const SelectedByAnother = story({
	amountLeft,
	loan,
	isVisitor: false,
	isSelectedByAnother: true
});

export const Visitor = story({
	amountLeft,
	loan,
	isVisitor: true,
});

export const InBasket = story({
	amountLeft,
	loan,
	isVisitor: false,
	itemsInBasket: [loan.id]
});

export const PercentageRaised50 = story({
	amountLeft,
	loan,
	isVisitor: false,
	percentRaised: .5
});

export const Title = story({
	amountLeft,
	loan,
	isVisitor: false,
	title: 'Great loan!'
});

export const Tags = story({
	amountLeft: 25,
	loan,
	isVisitor: false,
	showTags: true
});
