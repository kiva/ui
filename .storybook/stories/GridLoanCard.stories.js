import apolloStoryMixin from '../mixins/apollo-story-mixin';
import GridLoanCard from '#src/components/LoanCards/GridLoanCard';

const args = {
	amountLeft: 250,
	expiringSoonMessage: 'Only 3 Days Left!',
	isFavorite: false,
	isExpired: false,
	isFunded: false,
	isSelectedByAnother: false,
	isVisitor: false,
	itemsInBasket: [1],
	percentRaised: .4,
	loan: {
		id: 1,
		name: 'Loan Name',
		image: {
			retina: 'https://via.placeholder.com/956x720',
			default: 'https://via.placeholder.com/478x360',
			hash: ''
		},
		loanAmount: '1250',
		geocode: {
			country: {
				name: 'United States',
				isoCode: 'us'
			},
		},
		use: 'to buy more fire wood to sell at local market to meet customer demand.',
		status: '',
		borrowerCount: 2,
		lenderRepaymentTerm: 24,
		matchingText: 'Donation Matcher',
		userProperties: {
			lentTo: false
		},
		loanFundraisingInfo: {
			fundedAmount: 1000,
			reservedAmount: 0,
			isExpiringSoon: false,
		},
		fullLoanUse: 'A loan of $1,250 helps to buy more fire wood to sell at local market to meet customer demand.'
	},
};

export default {
	title: 'Loan Cards/Grid Loan Card',
	component: GridLoanCard,
	args,
};

export const Default = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin()],
	components: {
		GridLoanCard,
	},
	setup() { return args; },
	template: `
		<grid-loan-card
			:items-in-basket="itemsInBasket"
			:loan="loan"
			:amount-left="amountLeft"
			:expiring-soon-message="expiringSoonMessage"
			:is-favorite="isFavorite"
			:is-funded="isFunded"
			:is-selected-by-another="isSelectedByAnother"
			:is-visitor="isVisitor"
			:percent-raised="percentRaised"
			:title="title"
		/>
	`,
});

export const Tags = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin()],
	components: {
		GridLoanCard,
	},
	setup() { return args; },
	template: `
		<grid-loan-card
			:items-in-basket="itemsInBasket"
			:loan="loan"
			:amount-left="amountLeft"
			:expiring-soon-message="expiringSoonMessage"
			:is-favorite="isFavorite"
			:is-funded="isFunded"
			:is-selected-by-another="isSelectedByAnother"
			:is-visitor="isVisitor"
			:percent-raised="percentRaised"
			:title="title"
			:show-tags="true"
		/>
	`,
});
