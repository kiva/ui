// This mixin allows you to create a custom input component that can be used with v-model. Add whatever
// container or stylistic html elements that you want to your component while having it behave like a
// regular <input> element.
//
// To use this mixin, add the following attributes to the <input> element in your template:
// v-model="inputValue"
// v-on="inputListeners"
// v-bind="$attrs"
export default {
	// Prevent attributes being applied to the root element by default. Instead they are applied to
	// the input element in the template using v-bind="$attrs"
	inheritAttrs: false,
	props: {
		// This will be updated by v-model
		value: {},
	},
	data() {
		return {
			inputValue: null,
		};
	},
	computed: {
		inputListeners() {
			return {
				// Pass through any listeners from the parent to the input element...
				...this.$listeners,
				// ...except for the listener to the 'input' event which is emitted by this component
				input: () => {},
			};
		},
	},
	watch: {
		// First half of passing through any v-model binding on the root element to the input element.
		// This emits an 'input' event when the v-model value of the input element changes.
		inputValue(newValue, oldValue) {
			if (newValue !== oldValue) {
				this.$emit('input', newValue);
			}
		},

		// Second half of passing through any v-model binding on the root element to the input element.
		// This updates the value of the input element when the v-model value of the root element changes.
		value: {
			handler(value) {
				if (value !== this.inputValue) {
					this.inputValue = value;
				}
			},
			immediate: true,
		},
	},
};
