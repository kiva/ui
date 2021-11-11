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
						:id="`${id}-custom-amount-input`"
						:ref="`${id}-kvCurrencyRef`"
						class="input-element"
						:class="{'custom-input-element': true, 'error': $v.$invalid}"
						v-model="customAmountModel"
						:aria-disabled="!selected === 'custom'"
						:disabled="!selected === 'custom'"
					/>
				</div>
			</transition>
		</div>
		<ul class="validation-errors" v-if="$v.$invalid">
			<li v-if="!$v.customAmountModel.minValue || !$v.customAmountModel.maxValue">
				Enter an amount of ${{ minCustomAmount }}&ndash;${{ maxCustomAmount }}
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
			default: 25, // 25_hard_coded
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
		customAmount(newVal, prevVal) {
			if (newVal !== prevVal) {
				this.customAmountModel = newVal;
			}
		},
		customAmountModel(newVal) {
			// Implementation Required in Parent Component
			// Enables tracking of custom option/key associated value
			this.$emit('custom-amount-updated', newVal);
		},
		selected(newVal, prevVal) {
			// to focus custom amount input element
			if (newVal === 'custom') {
				this.$nextTick(() => {
					try {
						this.$refs[`${this.id}-kvCurrencyRef`][0].$refs.kvCurrencyInputRef.focus();
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

			// to update checked if selected state comes through a prop
			if (newVal !== 'custom' && newVal !== prevVal) {
				// reset to valid default value
				this.checked = newVal;
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

.custom-amount-holder {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: 0;

	.custom-input-element {
		border-radius: $input-border-radius;
		margin: 0;
		font-size: 1em;
		text-align: center;
		cursor: default;
		border-color: $kiva-green;
		width: 100%;
	}

	.error {
		border-color: $kiva-accent-red;
	}
}

.kv-pill-toggle {
	display: flex;

	.label {
		flex: 1;
		padding: rem-calc(12) rem-calc(13);
		border: rem-calc(1) solid $input-border-color;
		display: flex;
		justify-content: center;
		align-items: stretch;
		margin: 0;
		font-size: 1em;
		text-align: center;
		min-height: 100%;
		line-height: 1.3;
		transition: border-color 100ms ease-in-out, box-shadow 100ms ease-in-out;

		&:hover {
			background: $white;
		}
	}

	.pill {
		position: relative;
		background: $platinum;
		min-width: rem-calc(95);

		&:first-child {
			.label {
				border-bottom-left-radius: $input-border-radius;
				border-top-left-radius: $input-border-radius;
				margin-left: 0;
			}
		}

		&:last-child {
			.label {
				border-bottom-right-radius: $input-border-radius;
				border-top-right-radius: $input-border-radius;
			}
		}
	}

	.radio {
		position: absolute;
		opacity: 0;
		width: 0;

		&:focus + .label {
			@include input-focus();
		}

		&:checked + .label {
			background: $input-checked-color;
			color: $white;
			cursor: default;
			border-color: $input-checked-border-color;
			position: relative;
		}

		&:active + .label {
			background: $input-active-color;
			color: $white;
		}

		&[disabled] + .label {
			@include disabled();
		}

		&[disabled]:active + .label,
		&[disabled] + .title:hover {
			background: inherit;
			color: #fff;
		}
	}
}

.split-pills {
	flex-wrap: wrap;
	margin: -0.5rem;

	.split-pill {
		flex: 1 1 auto;
		margin: 0.5rem;

		.split-pill-label {
			border-radius: $input-border-radius;
		}

		&:first-child {
			.split-pill-label {
				border-radius: $input-border-radius;
			}
		}

		&:last-child {
			.split-pill-label {
				border-radius: $input-border-radius;
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
