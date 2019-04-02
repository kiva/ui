<template>
	<div class="borrower-info-header">
		<router-link
			:to="`/lend/${loanId}`"
			class="name"
			v-kv-track-event="['Lending', 'click-Read more', 'Name', loanId, 'true']"
			v-if="name"
		>
			<span
				@click="$emit('track-loan-card-interaction', {
					interactionType: 'viewBorrowerPage',
					interactionElement: 'borrowerName'
				})"
			>
				{{ name }}
			</span>
		</router-link>
		<div class="country" v-if="country">{{ country }}</div>
	</div>
</template>

<script>
export default {
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
};
</script>

<style lang="scss" scoped>
@import 'settings';

.borrower-info-header {
	line-height: rem-calc(22);

	.name {
		font-size: rem-calc(22);
		font-weight: $global-weight-highlight;
	}

	.country {
		color: $kiva-text-light;
		font-weight: $global-weight-highlight;
		margin-bottom: rem-calc(10);
	}
}
</style>
