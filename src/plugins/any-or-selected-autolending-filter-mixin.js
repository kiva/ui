import _union from 'lodash/union';
import _without from 'lodash/without';

export default {
	methods: {
		// with a list of values, adds or removes the single value passed in
		getValues(checked, values, currentValues) {
			const codes = Array.isArray(values) ? values : [values];
			if (checked) {
				// Add the values to the current ids
				return _union(currentValues, codes);
			}
			// Remove the values from the current ids
			return _without(currentValues, ...codes);
		},
	},
};
