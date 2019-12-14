<template>
	<div class="kv-checkbox">
		<input
			class="input"
			type="checkbox"
			:id="id"
			v-model="inputValue"
			v-on="inputListeners"
			v-bind="$attrs"
		>
		<label
			class="label"
			:for="id"
		>
			<div class="square"></div>
			<div>
				<slot></slot>
			</div>
		</label>
	</div>
</template>

<script>
import inputWrapperMixin from '@/plugins/input-wrapper-mixin';

export default {
	props: {
		id: {
			type: String,
			required: true
		},
		isChecked: { // workaround to allow both v-model binding and setting checked programatically
			type: Boolean,
			default: null
		}
	},
	watch: {
		isChecked(val) {
			this.inputValue = val;
		}
	},
	mounted() {
		if (this.isChecked !== null) {
			this.inputValue = this.isChecked;
		}
	},
	mixins: [inputWrapperMixin],
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-checkbox {
	display: block;
	position: relative;

	.label {
		display: flex;
		align-items: center;
		font-size: 1em;
		margin: 0;
	}

	.square {
		width: 1em;
		height: 1em;
		flex-shrink: 0;
		border-radius: 0.125em;
		background-color: #fff;
		border: 0.125em solid $subtle-gray;
		margin-right: 0.5em;
		box-shadow: 0 0 0 0 rgba(79, 175, 78, 0.2);
		position: relative;
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

	.input {
		@include visually-hidden();

		&:checked + .label {
			.square {
				background-color: $kiva-light-green;
				border-color: $kiva-green;
				border-width: 0.0625em;

				&::after {
					top: 0.0625em;
					left: 0.2875em;
					border-color: white;
				}
			}
		}

		&:focus + .label {
			.square {
				box-shadow: 0 0 0 0.25em rgba(174, 225, 92, 0.4); // $kiva-accent-green TODO: break into a scss mixin
			}
		}

		&[disabled] + .label {
			@include disabled();
		}
	}
}
</style>
