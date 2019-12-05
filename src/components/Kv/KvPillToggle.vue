<template>
	<div class="pill-toggle">
		<div
			v-for="option in options"
			:key="option.key"
			class="pill"
		>
			<input
				class="radio"
				type="radio"
				:name="`pill-${uuid}`"
				:id="`${option.key}-${uuid}`"
				:class="option.key"
				:disabled="option.disabled"
				:checked="isSelected(option.key)"
				@change="onChange(option.key)"
			>
			<label class="label" :for="`${option.key}-${uuid}`">
				{{ option.title }}
			</label>
		</div>
	</div>
</template>

<script>
let uuid = 0;

export default {
	props: {
		options: {
			type: Array,
			required: true,
			default() {
				return [
					{
						title: '',
						key: '',
						disabled: false
					}
				];
			}
		},
		selected: {
			type: String,
			required: true
		},
	},
	methods: {
		onChange(key) {
			this.$emit('pill-toggled', key);
		},
		isSelected(key) {
			return this.selected === key;
		}
	},
	beforeCreate() {
		this.uuid = uuid.toString();
		uuid += 1;
	},
};

</script>

<style lang="scss" scoped>
@import "settings";

$form-border-radius: rem-calc(3);

.pill-toggle {
	display: flex;

	.pill {
		background: $tab-pill-background;
		border: $tab-pill-border;
		min-width: rem-calc(85);
		margin-left: rem-calc(-1);

		&:first-child {
			margin-left: 0;
			border-bottom-left-radius: $form-border-radius;
			border-top-left-radius: $form-border-radius;
		}

		&:last-child {
			border-bottom-right-radius: $form-border-radius;
			border-top-right-radius: $form-border-radius;
		}
	}

	.label {
		align-items: center;
		display: flex;
		justify-content: center;
		padding: 0 rem-calc(15);
		margin: 0;
		font-size: 1rem;
		color: $tab-pill-color;
		text-align: center;
		min-height: 100%;

		&:hover {
			background: $white;
			color: $kiva-text-dark;
		}
	}

	.radio {
		position: absolute;
		opacity: 0;
		width: 0;

		&:focus + .label {
			outline: rem-calc(2) solid $kiva-green;
			outline-offset: rem-calc(-2);
		}

		&:checked + .label {
			background: $tab-pill-active-background;
			color: $white;
			cursor: default;
			border: rem-calc(1) solid $kiva-green;
			margin: rem-calc(-1);
		}

		&:active + .label {
			background: $kiva-green;
			color: $white;
		}

		&[disabled] + .label {
			@include disabled();
		}
	}
}
</style>
