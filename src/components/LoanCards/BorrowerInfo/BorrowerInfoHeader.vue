<template>
	<div class="borrower-info-header">
		<borrower-info-name
			v-if="name"
			:name="name"
			:loan-id="loanId"
			@track-loan-card-interaction="trackInteraction"
		/>
		<div class="country" v-if="country">
			{{ country }}
		</div>
	</div>
</template>

<script>
import BorrowerInfoName from '@/components/LoanCards/BorrowerInfo/BorrowerInfoName';

export default {
	components: {
		BorrowerInfoName,
	},
	props: {
		country: {
			type: String,
			default: ''
		},
		loanId: {
			type: Number,
			default: null
		},
		name: {
			type: String,
			default: ''
		},
	},
	methods: {
		trackInteraction(args) {
			this.$emit('track-loan-card-interaction', args);
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.borrower-info-header {
	line-height: rem-calc(22);

	.country {
		color: $kiva-text-light;
		font-weight: $global-weight-highlight;
		margin-bottom: rem-calc(10);
	}
}
</style>
