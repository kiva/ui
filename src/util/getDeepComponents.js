import _forEach from 'lodash/forEach';

// recursive function to add child components to a set
function deepAdd(components, set) {
	_forEach(components, definition => {
		if (!set.has(definition)) {
			set.add(definition);
			deepAdd(definition.components, set);
		}
	});
}

// Return an array of passed-in components and all their children
export default function getDeepComponents(components) {
	const result = new Set();
	deepAdd(components, result);
	return Array.from(result);
}
