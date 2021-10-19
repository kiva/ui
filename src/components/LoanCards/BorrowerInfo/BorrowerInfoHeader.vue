<template>
	<div class="borrower-info-header">
		<borrower-info-name
			v-if="name"
			:name="name"
			:loan-id="loanId"
			class="tw-text-h3"
			@track-loan-card-interaction="trackInteraction"
		/>
		<div class="country" v-if="country">
			{{ locationString }}
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
		isoCode: {
			type: String,
			default: ''
		},
		state: {
			type: String,
			default: ''
		},
		city: {
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
	computed: {
		locationString() {
			const usLoanChannels = [
				'kiva-u-s',
				'loans-to-u-s-small-businesses',
				'united-states-loans',
			];
			// show city, state on US category pages
			if (this.isoCode === 'US' && usLoanChannels.includes(this.$route.params.category)) {
				return `${this.city}, ${this.state}`;
			}
			return this.country;
		}
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
