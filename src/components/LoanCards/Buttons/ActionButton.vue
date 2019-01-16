<template>
	<component
		:is="currentButtonState"
		class="action-button smaller"
		:loan-id="loanId"
		:loan="loan"
	/>
</template>

<script>
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import _get from 'lodash/get';
import _includes from 'lodash/includes';
import Lend25Button from './Lend25Button';
import LendIncrementButton from './LendIncrementButton';
import CheckoutNowButton from './CheckoutNowButton';
import LendAgainButton from './LendAgainButton';
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
			if (this.isLentTo) {
				return LendAgainButton;
			}
			if (this.isFunded) {
				return ReadMoreButton;
			}
			return experimentLendIncrement ? LendIncrementButton : Lend25Button;
		},
	},
	data() {
		return {
			lendIncrementExperimentVersion: '',
		};
	},
	methods: {
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
