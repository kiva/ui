import { setContext } from '@apollo/client/link/context';
import _set from 'lodash/set';

// Experiment Ids from setting that will be passed in the X-Experiment Header
const targetIds = [
	'EXP-ML-Service-Bandit-LendByCategory',
	'EXP-FLSS-Lend-Filter'
];

function buildExpHeaders(cookieStore) {
	// kiva specific experiment cookie
	const exps = cookieStore.get('uiab');
	// handle missing cookie
	if (typeof exps === 'undefined') {
		return '';
	}
	const expCookieArray = exps.split('|');
	// filter experiments to only those containing targeted ids
	const targetExps = expCookieArray.filter(exp => {
		let matched = false;
		targetIds.forEach(expId => {
			if (exp.indexOf(expId) !== -1) {
				matched = true;
				return true;
			}
		});
		return matched;
	});

	// set experiment id:version then concatenate
	let experimentHeader = '';
	targetExps.forEach((target, index) => {
		const expSegments = target.split(':');
		if (expSegments.length && expSegments.length > 1) {
			experimentHeader += `${expSegments[0]};${expSegments[1]}`;
			if (targetExps.length - 1 > index) {
				experimentHeader += ',';
			}
		}
	});
	return experimentHeader;
}

export default ({ cookieStore }) => {
	return setContext((operation, previousContext) => {
		// fetch experiment header
		const experimentHeader = buildExpHeaders(cookieStore);
		// pass along existing context if no session id exists
		if (experimentHeader === '') {
			return previousContext;
		}
		// add header to existing context and pass along
		return _set(previousContext, 'headers.X-Experiments', experimentHeader);
	});
};
