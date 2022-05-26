<template>
	<div class="kv-toggle">
		<input
			class="input"
			type="checkbox"
			:id="id"
			:disabled="disabled"
			:checked="checked"
			@change="onChange($event)"
		>
		<label
			class="label"
			:for="id"
		>
			<div class="circle"></div>
			<div>
				<slot></slot>
			</div>
		</label>
	</div>
</template>

<script>
export default {
	name: 'KvToggle',
	model: {
		prop: 'checked',
		event: 'change'
	},
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
	},
	methods: {
		onChange($event) {
			/**
			 * The value of the toggle :checked state
			 * @event change
			 * @type {Event}
			 */
			this.$emit('change', $event.target.checked);
		},
	}
};
</script>

<style lang="scss" scoped>
@import "settings";

.kv-toggle {
	position: relative;

	.label {
		display: flex;
		margin: 0;
		font-size: 1em;

		&:hover {
			cursor: pointer;
		}
	}

	.circle {
		position: relative;
		width: 2.25em;
		height: 1.375em;
		top: 0.2em;
		flex-shrink: 0;
		margin-right: 0.5em;
		border-radius: 0.75em;
		content: "";
		transition: background-color 0.1s ease;
		background-color: $input-border-color;

		&::after {
			content: '';
			position: absolute;
			top: 0.125em;
			left: 0.125em;
			border-radius: 50%;
			width: 1.125em;
			height: 1.125em;
			background-color: $white;
			transition: left 0.2s ease;
		}
	}

	.input {
		@include visually-hidden();

		&[disabled] + .label {
			@include disabled();
		}

		&:focus + .label {
			.circle {
				@include input-focus();
			}
		}

		&:checked + .label {
			.circle {
				background-color: $input-checked-color;

				&::after {
					left: 1em;
					background-color: $white;
					border: 0.25em solid $white;
				}
			}
		}

		&:active + .label {
			.circle {
				background-color: $input-active-color;
			}
		}
	}
}
</style>
