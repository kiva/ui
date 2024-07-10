import { isNumber } from '@/util/numberUtils';

/**
 * Creates the min max range object
 *
 * @param {number} min The min of the range
 * @param {number} max The max of the range
 * @returns The new min max range object
 */
export function createMinMaxRange(min, max) {
	if (!isNumber(min) || !isNumber(max)) return;

	return { min, max, __typename: 'MinMaxRange' };
}

/**
 * Gets the FLSS filter object from the min max range object
 *
 * @param {number} param0.min The min of the range
 * @param {number} param0.max The max of the range
 * @returns The FLSS filter object
 */
export function getMinMaxRangeFilter({ min, max }) {
	if (!isNumber(min) && !isNumber(max)) return null;

	return {
		...(typeof min !== 'undefined' && { gte: min }),
		...(typeof max !== 'undefined' && { lte: max })
	};
}

/**
 * Gets the query param string based on the min max range object
 *
 * @param {number} param0.min The min of the range
 * @param {number} param0.max The max of the range
 * @returns The query param string
 */
export function getMinMaxRangeQueryParam({ min, max }) {
	if (!isNumber(min) || !isNumber(max)) return null;

	return [min, max].join();
}
