<template>
	<div class="kv-radio">
		<input
			class="input"
			type="radio"
			:id="id"
			:value="radioValue"
			v-model="inputValue"
			v-on="inputListeners"
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
import inputWrapperMixin from '@/plugins/input-wrapper-mixin';

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
	},
	mixins: [inputWrapperMixin]
};

</script>

<style lang="scss" scoped>
@import 'settings';

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
		box-shadow: 0 0 0 0 rgba(79, 175, 78, 0.2);
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
