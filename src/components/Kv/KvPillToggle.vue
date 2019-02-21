<template>
	<div>
		<div
			v-for="option in options" :key="option.key"
			@click="pillToggled(option.key)"
			class="pill-option"
			:class="{ active: selected === option.key }">
			<h3>
				{{ option.title }}
			</h3>
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
		},
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

$form-border-radius: rem-calc(3);

.pill-option {
	display: inline-block;
	border: 1px solid $subtle-gray;
	cursor: pointer;
}

.pill-option:first-child {
	border-top-left-radius: $form-border-radius;
	border-bottom-left-radius: $form-border-radius;
}

.pill-option:nth-child(2) {
	border-top-right-radius: $form-border-radius;
	border-bottom-right-radius: $form-border-radius;
}

.pill-option.active {
	border: 1px solid $kiva-darkgreen;
	cursor: default;
}

h3 {
	padding: rem-calc(7) rem-calc(20);
}

.pill-option.active h3 {
	background-color: $kiva-green;
}

</style>
