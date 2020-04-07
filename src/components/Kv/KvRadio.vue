<template>
	<div :class="pillStyle ? 'kv-radio-pill' : 'kv-radio'">
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
			:class="pillStyle ? 'pill-label' : 'label'"
			:for="id"
		>
			<div v-if="!pillStyle" class="disc"></div>
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
		radioValue: {
			type: String,
			required: true
		},
		pillStyle: {
			type: Boolean,
			default: false
		}
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
		border: 0.125em solid $subtle-gray;
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
				background-color: $kiva-light-green;
				border-color: $kiva-light-green;

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

		&[disabled] + .label {
			@include disabled();
		}
	}
}

$form-border-radius: rem-calc(3);

.kv-radio-pill {
	.pill-label {
		flex: 1;
		padding: rem-calc(6) rem-calc(13);
		color: $tab-pill-color;
		border: $tab-pill-border;
		border-radius: $form-border-radius;
		margin: 0;
		font-size: 1rem;
		text-align: center;
		min-height: 100%;
		line-height: 1.3;
		background: $tab-pill-background;
		min-width: rem-calc(85);

		&:hover {
			background: $white;
			color: $kiva-text-dark;
		}
	}

	.input {
		position: absolute;
		opacity: 0;
		width: 0;

		&:focus + .pill-label {
			border: $input-border-focus;
			background-color: $input-background-focus;
			box-shadow: $input-shadow-focus;
		}

		&:checked + .pill-label {
			background: $tab-pill-active-background;
			color: $white;
			cursor: default;
			border-color: $kiva-green;
			position: relative;
		}

		&:active + .pill-label {
			background: $kiva-green;
			color: $white;
		}

		&[disabled] + .pill-label {
			@include disabled();
		}

		&[disabled]:active + .pill-label,
		&[disabled] + .title:hover {
			background: inherit;
			color: $tab-pill-color;
		}
	}
}
</style>
