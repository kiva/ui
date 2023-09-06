import { setContext } from '@apollo/client/link/context';
import _set from 'lodash/set';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';

// Experiment assignments that will be passed in the X-Experiment Header
const targetIds = [
	'EXP-ML-Service-Bandit-LendByCategory',
	'EXP-FLSS-Ongoing-Sitewide-2'
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

export default () => {
	return setContext((operation, previousContext) => {
		// Fetch experiment header value
		const experimentHeader = buildExpHeaders(previousContext?.cache);

		// Pass along existing context if no experiment assignments exists
		if (experimentHeader === '') {
			return previousContext;
		}

		// Add header to existing context and pass along
		return _set(previousContext, 'headers.X-Experiments', experimentHeader);
	});
};
