import { setContext } from '@apollo/client/link/context/index';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
// import { UIAB_COOKIE_NAME } from '#src/util/experiment/experimentUtils';

// Experiment assignments that will be passed in the X-Experiment Header
const targetIds = [
	'EXP-ML-Service-Bandit-LendByCategory',
	'EXP-FLSS-Ongoing-Sitewide-3'
];

function buildExpHeaders(cache) {
	const experimentAssignments = [];

	targetIds.forEach(id => {
		const exp = cache?.readFragment({
			id: `Experiment:${id}`,
			fragment: experimentVersionFragment,
		}) ?? {};

		if (exp.version) {
			experimentAssignments.push(`${id};${exp.version}`);
		}
	});

	return experimentAssignments.join();
}

export default ({ cookieStore }) => {
	return setContext((operation, previousContext) => {
		if (!cookieStore) return previousContext;

		// Initialize new context
		const newContext = { ...previousContext };
		newContext.headers = newContext.headers ?? {};

		// Fetch experiment header values
		const experimentHeader = buildExpHeaders(previousContext?.cache);
		// TODO: Uncomment once X-UIAB header is allowed by the API
		// const uiabValue = cookieStore.get(UIAB_COOKIE_NAME) ?? '';

		// Add headers to context and pass along
		if (experimentHeader) {
			newContext.headers['X-Experiments'] = experimentHeader;
		}
		// if (uiabValue) {
		// 	newContext.headers['X-UIAB'] = uiabValue;
		// }

		return newContext;
	});
};
