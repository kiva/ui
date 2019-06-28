import _find from 'lodash/find';

export default function mergeRefinmentListItems(allItems, filteredItems) {
	// new array to hold our merged items
	const patchedItems = [];
	allItems.forEach(originalItem => {
		// check filtered result items for matches
		const matchedItem = _find(filteredItems, item => {
			return item.value === originalItem.value;
		});
		if (matchedItem !== undefined) {
			// push matched/active item data
			patchedItems.push(matchedItem);
		} else {
			// push stub item data
			patchedItems.push(originalItem);
		}
	});
	return patchedItems;
}
