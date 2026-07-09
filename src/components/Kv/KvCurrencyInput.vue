<template>
	<kv-text-input
		type="text"
		ref="kvCurrencyInputRef"
		v-model="displayValue"
		v-bind="$attrs"
		@blur="isInputActive = false"
		@focus="isInputActive = true"
		placeholder="$"
		:id="id"
	/>
</template>

<script>
import numeral from 'numeral';
import { KvTextInput } from '@kiva/kv-components';

export default {
	name: 'KvCurrencyInput',
	components: {
		KvTextInput
	},
	emits: ['input'],
	props: {
		id: {
			type: String,
			default: '',
		},
		modelValue: {
			type: [Number, String],
			required: true,
		},
		// When true, a zero value renders as an empty field while focused so the user can
		// type straight away instead of having to clear a leading "0".
		clearZeroOnFocus: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			value: this.modelValue,
			isInputActive: false
		};
	},
	computed: {
		displayValue: {
			get() {
				if (this.isInputActive) {
					// Show an empty field instead of "0" so the user can type immediately.
					if (this.clearZeroOnFocus && !Number(this.value)) {
						return '';
					}
					// Cursor is inside the input field. unformat display value for user
					return this.value.toString();
				}
				// User is not modifying now. Format display value for user interface
				return numeral(this.value).format('$0,0.00');
			},
			set(modifiedValue) {
				// Recalculate value after ignoring "$" and "," in user input
				// ensure value is a number
				let newValue = numeral(modifiedValue).value() || 0;
				// Round to 2 decimal places
				if (!Number.isInteger(newValue)) {
					newValue = parseFloat(newValue.toFixed(2));
				}
				// $emit the event to the parent component
				this.$emit('input', newValue);
			}
		}
	},
	watch: {
		modelValue(newValue) {
			this.value = newValue;
		},
	},
};
</script>
