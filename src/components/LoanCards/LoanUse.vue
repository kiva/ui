<template>
	<p class="tw-line-clamp-4">
		{{ loanUse }}

		<span
			v-if="showMore"
			class="tw-text-action tw-text-h5 tw-underline tw-inline"
		>
			More
		</span>
	</p>
</template>

<script>
import getLoanUse from '@/util/loanUse';

const DIRECT = 'direct';

export default {
	name: 'LoanUse',
	props: {
		anonymizationLevel: {
			type: String,
			default: 'none',
		},
		use: {
			type: String,
			default: '',
		},
		loanAmount: {
			type: String,
			default: '',
		},
		status: {
			type: String,
			default: '',
		},
		borrowerCount: {
			type: Number,
			default: 1,
		},
		name: {
			type: String,
			default: '',
		},
		loanUseMaxLength: {
			type: Number,
			default: 100,
		},
		distributionModel: {
			type: String,
			default: DIRECT
		},
		showMore: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		loanUse() {
			return getLoanUse({
				version: 2,
				anonymizationLevel: this.anonymizationLevel,
				borrowerCount: this.borrowerCount,
				distributionModel: this.distributionModel,
				loanAmount: this.loanAmount,
				maxLength: this.loanUseMaxLength,
				name: this.name,
				status: this.status,
				use: this.use,
			});
		},
	}
};
</script>
