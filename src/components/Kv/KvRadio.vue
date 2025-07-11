<template>
	<div class="kv-radio">
		<input
			class="input"
			type="radio"
			:id="id"
			:value="radioValue"
			:checked="isChecked"
			v-model="inputValue"
			v-bind="$attrs"
		>
		<label
			class="label"
			:for="id"
		>
			<div class="disc"></div>
			<div>
				<slot></slot>
			</div>
		</label>
	</div>
</template>

<script>
export default {
	name: 'KvRadio',
	props: {
		id: {
			type: String,
			required: true
		},
		radioValue: {
			type: String,
			required: true
		},
		modelValue: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			inputValue: null,
		};
	},
	computed: {
		isChecked() {
			return this.radioValue === this.modelValue;
		}
	},
	watch: {
		modelValue: {
			immediate: true,
			handler(value) {
				if (value !== this.inputValue) {
					this.inputValue = value;
				}
			}
		},
	},
};

</script>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

.kv-radio {
	display: block;
	position: relative;

	.label {
		display: flex;
		align-items: baseline;
		font-size: 1em;
		line-height: inherit;
		margin: 0;
	}

	.disc {
		border-radius: 50%;
		width: 1em;
		height: 1em;
		top: 0.125em;
		flex-shrink: 0;
		background-color: #fff;
		border: 0.125em solid $input-border-color;
		margin-right: 0.5em;
		box-shadow: 0 0 0 0 rgb(79 175 78 / 20%);
		position: relative;
		transition: background-color 200ms ease-in-out, border-color 100ms ease-in-out, box-shadow 300ms ease-in-out;

		&::after {
			content: '';
			position: absolute;
			border-radius: 50%;
			background: #fff;
			transition: all 150ms ease-out;
			width: 0.5em;
			height: 0.5em;
			transform: translate(0.125em, 0.125em);
		}
	}

	.input {
		@include visually-hidden();

		&:checked + .label {
			.disc {
				background-color: $input-checked-color;
				border-color: $input-checked-color;

				&::after {
					transform: translate(0.25em, 0.25em);
					width: 0.25em;
					height: 0.25em;
					transition: all 100ms ease-in;
				}
			}
		}

		&:focus + .label {
			.disc {
				@include input-focus();
			}
		}

		&:active + .label {
			.disc {
				background-color: $input-active-color;
				border-color: $input-active-color;
			}
		}

		&[disabled] + .label {
			@include disabled();
		}
	}
}
</style>
