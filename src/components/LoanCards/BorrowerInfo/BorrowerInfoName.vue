<template>
	<router-link
		:to="`/lend/${loanId}`"
		class="borrower-info-name"
		v-kv-track-event="['Lending', 'click-Read more', 'Name', loanId, loanId]"
	>
		<span
			@click="handleNameClick"
		>
			{{ name }}
		</span>
	</router-link>
</template>

<script>
export default {
	props: {
		disableLink: {
			type: Boolean,
			default: false,
		},
		loanId: {
			type: Number,
			default: 0
		},
		name: {
			type: String,
			default: ''
		},
	},
	methods: {
		handleNameClick(event) {
			this.$emit('name-click');

			this.$emit('track-loan-card-interaction', {
				interactionType: 'viewBorrowerPage',
				interactionElement: 'borrowerName'
			});

			if (this.disableLink) {
				event.preventDefault();
			}
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.borrower-info-name {
	font-size: rem-calc(22);
	font-weight: $global-weight-highlight;

	> span {
		display: block;
	}
}
</style>
