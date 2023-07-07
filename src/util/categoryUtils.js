/**
 * Get the current selected category name
 * @param {Number} categoryId
 * @param {String} name
 * @return {String} category name
*/
export default function getCategoryName(categoryId, name) {
	switch (categoryId) {
		case 5:
		case 52:
			return 'loans to women';
		case 96:
			return 'COVID-19 loans';
		case 93:
			return 'shelter loans';
		case 89:
			return 'arts loans';
		case 87:
			return 'agriculture loans';
		case 102:
			return 'technology loans';
		case 4:
			return 'education loans';
		case 25:
			return 'health loans';
		case 32:
			return 'loans to refugees and IDPs';
		default:
			// remove any text contained within square brackets, including the brackets
			return String(name).replace(/\s\[.*\]/g, '');
	}
}
