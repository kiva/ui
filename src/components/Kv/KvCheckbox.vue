<template>
	<div
		class="kv-checkbox"
		:class="{ 'kv-checkbox--right' : checkboxRight }"
	>
		<input
			class="input"
			type="checkbox"
			:id="id"
			:disabled="disabled"
			v-model="inputValue"
			v-bind="$attrs"
			@change="onChange($event)"
		>
		<label
			class="label"
			:for="id"
		>
			<div class="square"></div>
			<div>
				<!-- @slot Contents of the label element -->
				<slot></slot>
			</div>
		</label>
	</div>
</template>

<script>
export default {
	name: 'KvCheckbox',
	model: {
		prop: 'checked',
		event: 'change'
	},
	emits: ['update'],
	props: {
		id: {
			type: String,
			required: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		checked: {
			type: Boolean,
			default: null
		},
		checkboxRight: {
			type: Boolean,
			default: false
		},
		modelValue: {
			type: Boolean,
			default: null,
		},
	},
	data() {
		return {
			inputValue: this.checked,
		};
	},
	methods: {
		onChange(event) {
			this.$emit('update', event.target.checked);
		},
	},
	watch: {
		modelValue: {
			handler(newValue) {
				if (newValue !== null) {
					this.inputValue = newValue;
				}
			},
			immediate: true,
		},
		checked: {
			handler(newValue) {
				if (newValue !== null) {
					this.inputValue = newValue;
				}
			},
		},
	},
};
</script>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

.kv-checkbox {
	display: block;
	position: relative;

	.label {
		display: flex;
		align-items: baseline;
		font-size: 1em;
		line-height: inherit;
		margin: 0;
	}

	.square {
		width: 1em;
		height: 1em;
		top: 0.125em;
		flex-shrink: 0;
		border-radius: 0.125em;
		background-color: #fff;
		border: 0.125em solid $input-border-color;
		margin-right: 0.5em;
		position: relative;
		box-shadow: 0 0 0 0 rgb(79 175 78 / 20%);
		transition: background-color 200ms ease-in-out, box-shadow 200ms ease-in-out;

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0.225em;
			width: 0.3125em;
			height: 0.625em;
			border: solid transparent;
			border-width: 0 0.125em 0.125em 0;
			transform: rotate(45deg);
		}
	}

	&--right {
		.square {
			order: 1;
			margin-right: 0;
			margin-left: 0.5em;
		}
	}

	.input {
		@include visually-hidden();

		&:checked + .label {
			.square {
				background-color: $input-checked-color;
				border-color: $input-checked-border-color;
				border-width: 0.0625em;

				&::after {
					top: 0.0825em;
					left: 0.2875em;
					border-color: white;
				}
			}
		}

		&:focus + .label {
			.square {
				@include input-focus();
			}
		}

		&:active + .label {
			.square {
				background-color: $input-active-color;
				border-color: $input-checked-border-color;
			}
		}

		&[disabled] + .label {
			@include disabled();
		}
	}
}
</style>
