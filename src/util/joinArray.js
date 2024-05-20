/**
 * Takes an array of strings, joins them, inserts commas between each item
 * and inserts a conjunction before last item.
 *
 * @param {array} Array of strings
 * @param {string} Conjunction to use when joining array
 * @returns {string}
 */

export function joinArray(arr, last = 'and') {
	// Default last conjunction is 'and'
	if (!Array.isArray(arr)) {
		throw new Error('Passed value is not of array type.');
	}
	if (arr.length > 1 && last) {
		let processedArray = [...arr];

		// Insert conjunction as part of the array
		processedArray.splice(-1, 0, last);

		// Make a per-letter array with commas between each item
		processedArray = processedArray.join().split('');

		// Remove last 2 commas
		processedArray[processedArray.lastIndexOf(',')] = ' ';
		processedArray[processedArray.lastIndexOf(',')] = ' ';

		// Join array and add spaces to remaining commas
		processedArray = processedArray.join('').replace(/,/g, ', ');
		return processedArray;
	}
	// Return array of length 1 as string
	// Return normal array.join functionality if last is falsy
	return arr.join().replace(/,/g, ', ');
}
