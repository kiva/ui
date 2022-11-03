import _orderBy from 'lodash/orderBy';

/**
 * FLSS API query type
 */
export const FLSS_QUERY_TYPE = 'flss';

/**
   * Standard/lend API query type
   */
export const STANDARD_QUERY_TYPE = 'standard';

/**
 * Object for the different types of filter components
 */
export const filterUiType = {
	radioGroup: 'radioGroup',
	keyword: 'keyword',
	sortBy: 'sortBy',
	location: 'location',
	checkboxList: 'checkboxList',
	partner: 'partner',
	rangeSlider: 'rangeSlider',
};

/**
 * Prepares the options to be used by a radio group
 *
 * @param {Array<Object>} options The options to transform
 * @param {Array<string>} order The order of the options (name property)
 * @param {Object} displayMap The map for name to display title
 * @param {Object} valueMap The map for name to value
 * @returns {Array<Object>} The transformed radio group options
 */
export function transformRadioGroupOptions(options, order, displayMap, valueMap = {}) {
	const capitalizedOrder = order.map(o => o.toUpperCase());

	const transformed = options.filter(o => capitalizedOrder.includes(o.name.toUpperCase())).map(o => {
		const key = o.name.toUpperCase();

		return {
			name: o.name,
			title: displayMap[key] ?? o,
			value: valueMap[key] ?? o.name,
		};
	}).sort((a, b) => capitalizedOrder.indexOf(a.name.toUpperCase()) - capitalizedOrder.indexOf(b.name.toUpperCase()));

	return transformed;
}

/**
 * Gets the filter key based on the value
 * @param {(Object|boolean|string)} value The filter value
 * @param {Object} valueMap The filter key to value map
 * @returns The key of the filter
 */
export function getFilterKeyFromValue(value, valueMap) {
	const isMinMax = typeof value === 'object'
		&& typeof value?.min !== 'undefined'
		&& typeof value?.max !== 'undefined';

	return Object.keys(valueMap).find(k => {
		const mapValue = valueMap[k];

		if (isMinMax) {
			return mapValue.min === value.min && mapValue.max === value.max;
		}

		return mapValue === value;
	});
}

/**
 * Gets an updated items list to display in the filter with updated numLoansFundraising. Expected items and next format:
 * [{
 *   id: 1,
 *   name: '',
 *   numLoansFundraising: 1,
 * }]
 *
 * @param {Array<Object>} items The items previously displayed in the filter
 * @param {Array<Object>} next The items returned by the FLSS facets query
 * @returns {Array<Object>} The updated items list
 */
export function getUpdatedNumLoansFundraising(items, next) {
	const updated = [];

	// Get updated numLoansFundraising
	items?.forEach(item => {
		const nextItem = next.find(a => a.id === item.id);

		// Some facets don't have loan counts in FLSS
		const hasNumLoans = typeof item.numLoansFundraising !== 'undefined';

		const updatedItem = {
			...item,
			numLoansFundraising: hasNumLoans ? nextItem?.numLoansFundraising || 0 : undefined,
		};

		updated.push(updatedItem);
	});

	// Add missing items that have been added since previous query
	next?.forEach(item => {
		if (!updated.find(a => a.id === item.id)) {
			updated.push({ ...item });
		}
	});

	return _orderBy(updated, 'name');
}

/**
 * Returns the item label with fundraising amount in parens
 *
 * @param {Object} item The item for generating the label
 * @returns {string} The item label
 */
export function getCheckboxLabel(item) {
	const countLabel = typeof item.numLoansFundraising !== 'undefined' ? ` (${item.numLoansFundraising})` : '';

	return `${item.name || item.region}${countLabel}`;
}
