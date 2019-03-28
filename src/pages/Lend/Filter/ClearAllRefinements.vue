<template>
	<div
		class="clear-all-refinements"
		@click.prevent="clearAll"
	>
		Clear all
	</div>
</template>

<script>
export default {
	methods: {
		clearAll() {
			this.$emit('clear-all-refinements');
			this.$emit('clear-custom-categories');
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.clear-all-refinements {
	color: $blue;
	user-select: none;
	cursor: pointer;
	display: inline;
}
</style>
