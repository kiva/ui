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
			<div class="square">
				<!-- Inline SVG for checked state -->
				<svg
					v-if="inputValue"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					style="display: block; margin: auto;"
				>
					<mask
						id="mask0_2408_31628" style="mask-type:alpha"
						maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"
					>
						<rect width="24" height="24" fill="#D9D9D9" />
					</mask>
					<g mask="url(#mask0_2408_31628)">
						<path
							d="M10.6 13.8L8.45 11.65C8.26667 11.4667 8.03333 11.375 7.75 11.375C7.46667 11.375 7.23333
							11.4667 7.05 11.65C6.86667 11.8333 6.775 12.0667 6.775 12.35C6.775 12.6333 6.86667 12.8667
							7.05 13.05L9.9 15.9C10.1 16.1 10.3333 16.2 10.6 16.2C10.8667 16.2 11.1 16.1 11.3 15.9L16.95
							10.25C17.1333 10.0667 17.225 9.83333 17.225 9.55C17.225 9.26667 17.1333 9.03333 16.95
							8.85C16.7667 8.66667 16.5333 8.575 16.25 8.575C15.9667 8.575 15.7333 8.66667 15.55
							8.85L10.6 13.8Z M12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825
							19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2
							12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025
							6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9
							2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125
							8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875
							17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833
							21.7375 13.3833 22 12 22Z"
							fill="#2AA967"
						/>
					</g>
				</svg>
			</div>
			<div>
				<!-- @slot Contents of the label element -->
				<slot></slot>
			</div>
		</label>
	</div>
</template>

<script>
export default {
	name: 'RoundCheckbox',
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
		align-items: center; // <-- Change from baseline to center
		font-size: 1em;
		line-height: inherit;
		margin: 0;
	}

	.square {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: #e5e7eb; // solid light gray
		border: none;
		margin-right: 0.5em;
		position: relative;
		box-shadow: none;
		transition: background-color 200ms ease-in-out, box-shadow 200ms ease-in-out;

		&::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			width: 7px;
			height: 12px;
			border: solid transparent;
			border-width: 0 3px 3px 0;
			transform: translate(-50%, -50%) rotate(45deg);
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
				background-color: #2AA967; // your green
				border: none;

				&::after {
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
