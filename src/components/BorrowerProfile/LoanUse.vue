<template>
	<p>
		{{ loanUseFiltered }}
		<kv-text-link
			v-if="loanId && showLearnMore"
			:to="customLoanDetails? null : `/lend/${loanId}`"
			v-kv-track-event="['Lending', 'click-Read more', 'Learn more', loanId]"
			@click="showLoanDetails"
		>
			Learn more
		</kv-text-link>
	</p>
</template>

<script>
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';

const loanUseFilter = require('../../plugins/loan-use-filter');

export default {
	name: 'LoanUse',
	components: {
		KvTextLink,
	},
	props: {
		loanAmount: {
			type: String,
			default: '',
		},
		use: {
			type: String,
			default: '',
		},
		status: {
			type: String,
			default: '',
		},
		name: {
			type: String,
			default: '',
		},
		borrowerCount: {
			type: Number,
			default: 1,
		},
		loanUseMaxLength: {
			type: Number,
			default: 0,
		},
		loanId: {
			type: String,
			default: '',
		},
		showLearnMore: {
			type: Boolean,
			default: true,
		},
		anonymizationLevel: {
			type: String,
			default: 'none',
		},
		customLoanDetails: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		showLoanDetails(e) {
			if (this.customLoanDetails) {
				e.preventDefault();
				this.$emit('show-loan-details', e);
			}
		},
	},
	computed: {
		loanUseFiltered() {
			return loanUseFilter(this.use, this.name, this.status, this.loanAmount, this.borrowerCount,
				this.loanUseMaxLength, this.anonymizationLevel);
		},
	}
};

</script>
