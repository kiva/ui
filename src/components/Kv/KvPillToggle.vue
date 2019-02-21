<template>
	<div>
		<div
			v-for="option in options" :key="option.key"
			@click="pillToggled(option.key)"
			:class="{ active: selected === option.key }"
		>
			<h3 class="">{{ option.title }}</h3>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		options: {
			type: Array,
			required: true
		},
		selected: {
			type: String,
			required: true
		}
	},
	methods: {
		pillToggled(key) {
			this.$emit('pillToggled', key);
		}
	}
};

</script>

<style lang="scss">
@import "settings";

.active {
	background-color: red;
}

</style>
