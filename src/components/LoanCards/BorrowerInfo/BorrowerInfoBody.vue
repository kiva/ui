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
				@click="handleReadMoreLink"
			>
				{{ readMoreLinkText }}
			</span>
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
		maxUseLength: {
			type: Number,
			default: 500
		},
		readMoreLinkText: {
			type: String,
			default: 'Read full details',
		},
		disableLink: {
			type: Boolean,
			default: false,
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
			const lowerCaseUse = this.use.toString().charAt(0).toLowerCase() + this.use.toString().slice(1);
			const convertedUse = (this.use.substring(0, this.name.length) === this.name) ? this.use : lowerCaseUse;

			if (this.use.length === 0) {
				return 'For the borrower\'s privacy, this loan has been made anonymous.';
			}
			if (this.use.length > this.maxUseLength) {
				return `${convertedUse.substring(0, this.maxUseLength)}...`;
			}
			return convertedUse;
		},
	},
	methods: {
		handleReadMoreLink(event) {
			this.$emit('read-more-link', event);
			if (this.disableLink) {
				event.preventDefault();
				return;
			}
			this.$emit('track-loan-card-interaction', {
				interactionType: 'viewBorrowerPage',
				interactionElement: 'readMore'
			});
		},
	},
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
