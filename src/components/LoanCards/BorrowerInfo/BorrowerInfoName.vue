<template functional>
	<router-link
		:to="`/lend/${props.loanId}`"
		class="borrower-info-name"
		:class="[
			data.class,
			data.staticClass,
		]"
		v-kv-track-event="['Lending', 'click-Read more', 'Name', props.loanId, 'true']"
	>
		<span
			@click="listeners['track-loan-card-interaction']({
				interactionType: 'viewBorrowerPage',
				interactionElement: 'borrowerName'
			})"
		>
			{{ props.name }}
		</span>
	</router-link>
</template>

<style lang="scss">
@import 'settings';

.borrower-info-name {
	font-size: rem-calc(22);
	font-weight: $global-weight-highlight;
}
</style>
