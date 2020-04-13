<template>
	<div :class="{ 'kv-pill-toggle': true, 'split-pills': splitPills }">
		<div
			v-for="option in options"
			:key="option.key"
			:class="{ 'pill': true, 'split-pill': splitPills }"
		>
			<input
				class="radio"
				type="radio"
				:id="`${id}-${option.key}`"
				:disabled="option.disabled"
				:value="option.key"
				v-model="checked"
				@change="onChange(option.key)"
			>
			<label
				:class="{ 'label': true, 'split-pill-label': splitPills }"
				:for="`${id}-${option.key}`"
			>
				{{ option.title }}
			</label>
			<transition name="kvfade">
				<div
					class="custom-amount-holder"
					v-if="selected === 'custom' && option.key === 'custom'"
				>
					<kv-currency-input
						id="custom-amount-input"
						ref="kvCurrencyRef"
						class="input-element"
						:class="{'custom-input-element': true, 'error': $v.$invalid}"
						v-model="customAmountModel"
						:aria-disabled="!selected === 'custom'"
						:disabled="!selected === 'custom'"
						@focus.native="$event.target.select()"
					/>
				</div>
			</transition>
		</div>
		<ul class="validation-errors" v-if="$v.$invalid">
			<li v-if="!$v.customAmountModel.minValue || !$v.customAmountModel.maxValue">
				Enter an amount of $5-$10,000
			</li>
		</ul>
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';

export default {
	components: {
		KvCurrencyInput
	},
	mixins: [
		validationMixin
	],
	props: {
		id: {
			type: String,
			required: true
		},
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
		/**
     	* A key from options array you want to be selected
     	*/
		selected: {
			type: String,
			default: '',
		},
		splitPills: {
			type: Boolean,
			default: false,
		},
		customAmount: {
			type: Number,
			default: 25,
		},
		minCustomAmount: {
			type: Number,
			default: 25,
		},
		maxCustomAmount: {
			type: Number,
			default: 10000,
		}
	},
	data() {
		return {
			checked: this.selected,
			customAmountModel: this.customAmount,
		};
	},
	validations() {
		return {
			customAmountModel: {
				required,
				minValue: minValue(this.minCustomAmount),
				maxValue: maxValue(this.maxCustomAmount)
			},
		};
	},
	watch: {
		customAmountModel(newVal) {
			// Implementation Required in Parent Component
			// Enables tracking of custom option/key associated value
			this.$emit('custom-amount-updated', newVal);
		},
		selected(newVal) {
			// to focus custom amount input element
			if (newVal === 'custom') {
				this.$nextTick(() => {
					try {
						this.$refs.kvCurrencyRef[0].$refs.kvCurrencyInputRef.focus();
					} catch (e) {
						// noop
					}
				});
			}
			// to prevent unnecessary validations from showing
			if (newVal !== 'custom' && this.$v.$invalid) {
				// reset to valid default value
				this.customAmountModel = this.minCustomAmount;
			}
		},
	},
	methods: {
		/**
		 * The key of the currently selected item
		 * @event pill-toggled
		 * @type {Event}
		 */
		onChange(key) {
			// Implementation Required in Parent Component
			// Enables tracking of selected option/key
			this.$emit('pill-toggled', key);
		},
	},
};

</script>

<style lang="scss" scoped>
@import "settings";

$form-border-radius: rem-calc(3);

.custom-amount-holder {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: 0;

	.custom-input-element {
		height: 2.125rem;
		border-radius: $form-border-radius;
		margin: 0;
		font-size: 1em;
		text-align: center;
		cursor: default;
		border-color: $kiva-green;
	}

	.error {
		border-color: $kiva-accent-red;
	}
}

.kv-pill-toggle {
	display: flex;

	.label {
		flex: 1;
		padding: rem-calc(6) rem-calc(13);
		color: $tab-pill-color;
		border: $tab-pill-border;
		display: flex;
		justify-content: center;
		align-items: stretch;
		margin: 0;
		font-size: 1em;
		text-align: center;
		min-height: 100%;
		line-height: 1.3;

		&:hover {
			background: $white;
			color: $kiva-text-dark;
		}
	}

	.pill {
		position: relative;
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

		&[disabled]:active + .label,
		&[disabled] + .title:hover {
			background: inherit;
			color: $tab-pill-color;
		}
	}
}

.split-pills {
	flex-wrap: wrap;

	.split-pill {
		flex: 1 1 auto;
		margin: 0.5rem;

		.split-pill-label {
			border-radius: $form-border-radius;
		}

		&:first-child {
			.split-pill-label {
				border-radius: $form-border-radius;
			}
		}

		&:last-child {
			.split-pill-label {
				border-radius: $form-border-radius;
			}
		}
	}
}

.validation-errors {
	flex: 0 0 100%;
	text-align: right;
	margin: 0 0 0.5rem;
	padding: 0.15rem 0.5rem 0;

	li {
		line-height: 1.15rem;
	}
}
</style>
