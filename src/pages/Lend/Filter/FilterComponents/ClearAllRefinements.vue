<template>
	<button
		class="clear-all-refinements tw-text-small tw-text-link"
		@click="clearAll"
	>
		Reset all
	</button>
</template>

<script>
export default {
	name: 'ClearAllRefinements',
	methods: {
		clearAll() {
			this.$emit('clear-all-refinements');
			this.$emit('clear-custom-categories');
		},
	},
};
</script>
