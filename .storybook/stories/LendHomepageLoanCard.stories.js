import Vue from 'vue'
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import LendHomepageLoanCard from '@/components/LoanCards/LendHomepageLoanCard';
// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

export default {
	title: 'Loan Cards/Lend Homepage Loan Card',
	component: LendHomepageLoanCard,
	args: {
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
		},
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin()],
	components: {
		LendHomepageLoanCard,
	},
	computed: {
		styling: function() {
			return {
				maxWidth: '476px',
			}
		},
	},
	template: `
		<div :style="styling">
			<lend-homepage-loan-card
				class="lend-homepage-loan-card"
				:amount-left="amountLeft"
				:expiring-soon-message="expiringSoonMessage"
				:is-expired="isExpired"
				:is-funded="isFunded"
				:is-selected-by-another="isSelectedByAnother"
				:is-visitor="isVisitor"
				:is-favorite="isFavorite"
				:items-in-basket="itemsInBasket"
				:loan="loan"
				:percent-raised="percentRaised"
			/>
			<component is="style">
				.lend-homepage-loan-card {
					border-radius: 0.65rem;
					box-shadow: 0 0.65rem 0.875rem 0.4375rem hsla(0,0%,60%,.1);
				}
   			 </component>
		</div>
	`,
});
