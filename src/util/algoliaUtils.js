import _find from 'lodash/find';
// import _sortBy from 'lodash/sortBy';

export default function mergeRefinmentListItems(allItems, filteredItems) {
	// sort our full facet query to match what sort set in algolia component above
	// const originalItems = _sortBy(allItems, [item => { return item.value; }]);
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
