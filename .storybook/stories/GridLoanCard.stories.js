import Vue from 'vue'
import StoryRouter from 'storybook-vue-router';
import { text, number, boolean } from '@storybook/addon-knobs';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import loanDataPropStoryMixin from '../mixins/loan-data-prop-story-mixin';


import GridLoanCard from '@/components/LoanCards/GridLoanCard';

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

export default {
	title: 'Loan Cards/Grid Loan Card',
	component: GridLoanCard,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	mixins: [apolloStoryMixin(), loanDataPropStoryMixin],
	components: {
		GridLoanCard,
	},
	props: {
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
