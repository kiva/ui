<template>
	<div class="borrower-info-body loan-use">
		<span>{{ loanUse }}</span>
		<router-link
			:to="`/lend/${loanId}`"
			v-kv-track-event="['Lending', 'click-Read more', 'Read more', loanId, loanId]"
		>
			<span
				@click="handleReadMoreLink"
				v-if="readMoreLinkText"
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
	name: 'BorrowerInfoBody',
	props: {
		loanId: {
			type: Number,
			default: null
		},
		use: {
			type: String,
			default: ''
		},
		maxUseLength: {
			type: Number,
			default: 0
		},
		readMoreLinkText: {
			type: String,
			default: 'Read more',
		},
		disableLink: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		loanUse() {
			if (this.maxUseLength > 0 && this.use.length > this.maxUseLength) {
				return `${this.use.slice(0, this.maxUseLength)}...`;
			}
			return this.use;
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
