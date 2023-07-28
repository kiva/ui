import { setContext } from '@apollo/client/link/context';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import { UIAB_COOKIE_NAME } from '@/util/experiment/experimentUtils';

// Experiment assignments that will be passed in the X-Experiment Header
const targetIds = [
	'EXP-ML-Service-Bandit-LendByCategory',
	'EXP-FLSS-Ongoing-Sitewide'
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
		// Initialize new context
		const newContext = { ...previousContext };
		newContext.headers = newContext.headers ?? {};

		// Fetch experiment header values
		const experimentHeader = buildExpHeaders(previousContext?.cache);
		const uiabValue = cookieStore.get(UIAB_COOKIE_NAME) ?? '';

		// Add headers to context and pass along
		if (experimentHeader) {
			newContext.headers['X-Experiments'] = experimentHeader;
		}
		if (uiabValue) {
			newContext.headers['X-UIAB'] = uiabValue;
		}

		return newContext;
	});
};
