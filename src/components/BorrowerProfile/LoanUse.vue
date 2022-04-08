<template>
	<p>
		{{ loanUseFiltered }}
		<kv-text-link
			v-if="loanId && showLearnMore"
			:to="`/lend/${loanId}`"
			v-kv-track-event="['Lending', 'click-Read more', 'Learn more', loanId]"
		>
			Learn more
		</kv-text-link>
	</p>
</template>

<script>
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';

const loanUseFilter = require('../../plugins/loan-use-filter');

export default {
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
	},
	computed: {
		loanUseFiltered() {
			// eslint-disable-next-line max-len
			if (this.anonymizationLevel !== 'full') {
				return loanUseFilter(this.use, this.name, this.status, this.loanAmount, this.borrowerCount,
					this.loanUseMaxLength);
			}
			return 'For the borrower\'s privacy, this loan has been made anonymous.';
		},
	}
};

</script>
