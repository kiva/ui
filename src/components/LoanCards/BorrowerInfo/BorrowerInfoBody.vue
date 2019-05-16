<template>
	<div class="borrower-info-body loan-use">
		<span>
			A loan of {{ amount | numeral('$0,0') }} {{ helpedLanguage }}
			{{ borrowerCountLanguage }} {{ shortenedLoanUse }}
		</span>
		<router-link
			:to="`/lend/${loanId}`"
			v-kv-track-event="['Lending', 'click-Read more', 'Read more', loanId, 'true']"
		>
			<span
				@click="$emit('track-loan-card-interaction', {
					interactionType: 'viewBorrowerPage',
					interactionElement: 'readMore'
				})"
			>Read more</span>
		</router-link>
		<!--
        <div v-if="activeSort === 'loanLength'" class="loan-length">
            <strong>Loan length:</strong> {{ loanLength }} months
        </div>
        -->
	</div>
</template>

<script>
export default {
	props: {
		amount: {
			type: String,
			default: ''
		},
		borrowerCount: {
			type: Number,
			default: 1
		},
		loanId: {
			type: Number,
			default: null
		},
		name: {
			type: String,
			default: ''
		},
		status: {
			type: String,
			default: ''
		},
		use: {
			type: String,
			default: ''
		},
	},
	computed: {
		helpedLanguage() {
			if (this.status === 'fundraising'
				|| this.status === 'inactive'
				|| this.status === 'reviewed') {
				return 'helps';
			}
			return 'helped';
		},
		borrowerCountLanguage() {
			if (this.borrowerCount > 1) {
				return ' a member ';
			}
			return ' ';
		},
		shortenedLoanUse() {
			const maxLength = 1000;
			const lowerCaseUse = this.use.toString().charAt(0).toLowerCase() + this.use.toString().slice(1);
			const convertedUse = (this.use.substring(0, this.name.length) === this.name) ? this.use : lowerCaseUse;
			/* eslint-disable */
			// TODO: Fix eslint rule to allow else if
			if (this.use.length === 0) {
				return 'For the borrower\'s privacy, this loan has been made anonymous.';
			} else if (this.use.length > maxLength) {
				return `${convertedUse.substring(0, maxLength)}...`;
			}
			return convertedUse;
			/* eslint-enable */
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.borrower-info-body {
	line-height: rem-calc(22);

	/*
	.loan-length {
		display: inline-block;
		margin-top: rem-calc(15);
	}
	*/
}
</style>
