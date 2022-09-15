<template>
	<div class="borrower-info-body loan-use">
		<span>{{ use | loanUse(name, status, amount, borrowerCount, maxUseLength) }}</span>
		<router-link
			:to="`/lend/${loanId}`"
			v-kv-track-event="['Lending', 'click-Read more', 'Read more', loanId, loanId]"
		>
			<kv-text-link
				@click="handleReadMoreLink"
				v-if="readMoreLinkText"
			>
				{{ readMoreLinkText }}
			</kv-text-link>
		</router-link>
		<!--
        <div v-if="activeSort === 'loanLength'" class="loan-length">
            <strong>Loan length:</strong> {{ loanLength }} months
        </div>
        -->
	</div>
</template>

<script>
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';

export default {
	name: 'BorrowerInfoBody',
	components: {
		KvTextLink,
	},
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
			default: 'Read more',
		},
		disableLink: {
			type: Boolean,
			default: false,
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
