<template>
	<div
		class="clear-all-refinements"
		@click.prevent="clearAll"
	>
		Reset all
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
	color: $faded-blue;
	cursor: pointer;
	display: inline;
	font-size: rem-calc(14);
	user-select: none;
}
</style>
