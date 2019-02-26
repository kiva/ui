<template>
	<div class="pill-toggle">
		<span
			v-for="option in options" :key="option.key"
			@click="pillToggled(option.key)"
			:class="{ active: selected === option.key }
			">
			<div class="title">
				{{ option.title }}
			</div>
		</span>
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
			this.$emit('pill-toggled', key);
		}
	}
};

</script>

<style lang="scss" scoped>
@import "settings";

$form-border-radius: rem-calc(3);

.pill-toggle {
	font-size: rem-calc(14);
	height: rem-calc(34);
	width: 100%;

	span {
		background: $tab-pill-background;
		border: $tab-pill-border;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		color: $tab-pill-color;
		cursor: pointer;
		display: inline-block;
		height: 100%;
		min-width: rem-calc(85);

		.title {
			align-items: center;
			display: flex;
			height: 100%;
			justify-content: center;
			text-align: center;
			width: 100%;
		}

		&:first-child {
			border-bottom-left-radius: $form-border-radius;
			border-top-left-radius: $form-border-radius;
		}

		&:last-child {
			border-bottom-right-radius: $form-border-radius;
			border-top-right-radius: $form-border-radius;
		}
	}

	.active {
		background: $tab-pill-active-background;
		border: rem-calc(1) solid $kiva-green;
		color: $white;
		cursor: default;
	}
}
</style>
