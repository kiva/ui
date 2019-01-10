<template>
	<component
		:is="currentButtonState"
		class="action-button smaller"
		:loan-id="loanId"
		:loan="loan"
		@lend="handleLend"
	/>
</template>

<script>
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';
import loanCardBasketed from '@/graphql/query/loanCardBasketed.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import _get from 'lodash/get';
import _includes from 'lodash/includes';
import _forEach from 'lodash/forEach';
import numeral from 'numeral';
import Lend25Button from './Lend25Button';
import LendIncrementButton from './LendIncrementButton';
import CheckoutNowButton from './CheckoutNowButton';
import LendAgainButton from './LendAgainButton';
import LendLoadingButton from './LendLoadingButton';
import ReadMoreButton from './ReadMoreButton';

export default {
	inject: ['apollo'],
	props: {
		loan: {
			type: Object,
			default: () => {}
		},
		loanId: {
			type: Number,
			default: null
		},
		itemsInBasket: {
			type: Array,
			default: () => []
		},
		isLentTo: {
			type: Boolean,
			default: false
		},
		isFunded: {
			type: Boolean,
			default: false
		},
	},
	computed: {
		currentButtonState() {
			const experimentLendIncrement = this.lendIncrementExperimentVersion === 'variant-b';
			if (_includes(this.itemsInBasket, this.loanId)) {
				return CheckoutNowButton;
			}
			if (this.isFunded) {
				return ReadMoreButton;
			}
			if (this.isLoading) {
				return LendLoadingButton;
			}
			if (this.isLentTo) {
				return LendAgainButton;
			}
			return experimentLendIncrement ? LendIncrementButton : Lend25Button;
		},
	},
	data() {
		return {
			isLoading: false,
			lendIncrementExperimentVersion: '',
		};
	},
	methods: {
		handleLend(amount) {
			this.isLoading = true;
			this.apollo.mutate({
				mutation: updateLoanReservation,
				variables: {
					loanid: this.loanId,
					price: numeral(amount).format('0.00'),
				},
			}).then(({ errors }) => {
				if (errors) {
					// Handle errors from adding to basket
					_forEach(errors, ({ message }) => {
						this.$showTipMsg(message, 'error');
					});
				} else {
					// If no errors, update the loan fundraising info
					return this.apollo.query({
						query: loanCardBasketed,
						variables: {
							id: this.loanId,
						},
						fetchPolicy: 'network-only',
					});
				}
			}).catch(() => {
				this.$showTipMsg('Failed to add loan. Please try again.', 'error');
			}).finally(() => {
				this.isLoading = false;
			});
		},
		setupExperimentState() {
			const lendIncrementExperimentVersion = this.apollo.readQuery({
				query: experimentAssignmentQuery,
				variables: { id: 'lend_increment_button' },
			});
			this.lendIncrementExperimentVersion = _get(lendIncrementExperimentVersion, 'experiment.version') || null;
		},
	},
	created() {
		this.setupExperimentState();
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.action-button {
	margin-top: rem-calc(30);
	margin-bottom: rem-calc(10);
	width: 100%;
}
</style>
