import Vue from 'vue'
import StoryRouter from 'storybook-vue-router';
import { select, text, number, boolean } from '@storybook/addon-knobs';

import GridLoanCard from '@/components/LoanCards/GridLoanCard';

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

export default {
	title: 'Components|Grid Loan Card',
	decorators: [StoryRouter()],
};

export const Default = () => ({
	provide: {
		apollo: {
			mutate() {
				return Promise.resolve({});
			},
			watchQuery() {
				return {
					subscribe() {}
				}
			},
			query() {
				return Promise.resolve({});
			}
		},
	},
	components: {
		GridLoanCard,
	},
	props: {
		loan: {
			type: Object,
			default: () => {
				return {
					id: 1,
					name: `${text('Name', 'Loan Name', 'Loan')}`,
					image: {
						retina: `${text('Image Retina', 'https://via.placeholder.com/956x720', 'Loan')}`,
						default: `${text('Image Default', 'https://via.placeholder.com/478x360', 'Loan')}`,
						hash: ''
					},
					loanAmount: `${text('Amount', '1250', 'Loan')}`,
					geocode: {
						country: {
							name: `${text('Country', 'United States', 'Loan')}`
						},
					},
					use: `${text('Use', 'to buy more fire wood to sell at local market to meet customer demand.', 'Loan')}`,
					status: `${select('Status', ['funded', 'expired', ''], '', 'Loan')}`,
					borrowerCount: number('Borrower Count', 2, {}, 'Loan'),
					lenderRepaymentTerm: number('Lender Repayment Term', 24, {}, 'Loan'),
					matchingText: `${text('Matching Text', 'Donation Matcher', 'Loan')}`,
					userProperties: {
						lentTo: boolean('Lent To', false, 'Loan')
					},
					loanFundraisingInfo: {
						fundedAmount: number('Funded Amount', 1000, {}, 'Loan'),
						reservedAmount: number('Reserved Amount', 0, {}, 'Loan'),
						isExpiringSoon: boolean('Is Expiring Soon', false, 'Loan')
					},
				};
			}
		},
		amountLeft: {
			type: Number,
			default: number("Amount Left", 250),
		},
		expiringSoonMessage: {
			type: String,
			default: `${text('Expiring Soon Message', 'Only 3 Days Left!')}`
		},
		isFavorite: {
			type: Boolean,
			default: boolean('Favorite', false)
		},
		isFunded: {
			type: Boolean,
			default: boolean('Funded', false)
		},
		isSelectedByAnother: {
			type: Boolean,
			default: boolean('Selected by Another', false)
		},
		isVisitor: {
			type: Boolean,
			default: boolean('Visitor', false)
		},
		itemsInBasket: {
			type: Array,
			default: () => [boolean('Loan In Basket', false) ? 1 : 0],
		},
		percentRaised: {
			type: Number,
			default: number('Percent Raised', .8, {
				range: true,
				min: 0,
				max: 1,
				step: .1,
			 }),
		},
		title: {
			type: String,
			default: `${text('Loan Title', '')}`
		},
	},
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
