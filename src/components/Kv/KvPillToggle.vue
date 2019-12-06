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
			default: '',
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
	height: rem-calc(34);

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
		border: $tab-pill-border;
		margin-left: rem-calc(-1);

		&:hover {
			background: $white;
			color: $kiva-text-dark;
		}
	}

	.pill {
		background: $tab-pill-background;
		min-width: rem-calc(85);

		&:first-child {
			.label {
				border-bottom-left-radius: $form-border-radius;
				border-top-left-radius: $form-border-radius;
				margin-left: 0;
			}
		}

		&:last-child {
			.label {
				border-bottom-right-radius: $form-border-radius;
				border-top-right-radius: $form-border-radius;
			}
		}
	}

	.radio {
		position: absolute;
		opacity: 0;
		width: 0;

		&:focus + .label {
			border: $input-border-focus;
			background-color: $input-background-focus;
			box-shadow: $input-shadow-focus;
		}

		&:checked + .label {
			background: $tab-pill-active-background;
			color: $white;
			cursor: default;
			border-color: $kiva-green;
			position: relative;
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
