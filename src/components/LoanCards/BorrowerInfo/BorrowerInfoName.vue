<template>
	<router-link
		:to="`/lend/${loanId}`"
		v-kv-track-event="['Lending', 'click-Read more', 'Name', loanId, loanId]"
	>
		<span
			class="tw-block"
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
