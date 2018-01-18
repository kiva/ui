import _values from 'lodash/values';

// Create a function to recursively call asyncData on a component and its child components using
// the given asyncDataOptions as the argument for each asyncData call.
export default asyncDataOptions => function callAsyncData({ asyncData, components }) {
	return Promise.all([
		asyncData && asyncData(asyncDataOptions),
		components && Promise.all(_values(components).map(callAsyncData))
	]);
};
