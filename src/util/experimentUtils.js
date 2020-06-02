import _isUndefined from 'lodash/isUndefined';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
// import _pick from 'lodash/pick';
import _toPairs from 'lodash/toPairs';
import { isWithinInterval } from 'date-fns';
import cookieStore from '@/util/cookieStore';
// import { readJSONSetting, hashCode } from '@/util/settingsUtils';

/**
 * Parse the experiment cookie value into an object
 *
 * Accepts: pinned_filter:pinned_filter:-73648897|lend_filter_v2:x:186894633...
 * Returns: { pinned_filter : { id: 'pinned_filter', version: 'pinned_filter', hash: -73648897 }, ... }
 *
 * @param {string} cookie
 * @returns {object}
 */
export function parseExpCookie(cookie) {
	if (!cookie) return {};

	const expStrings = cookie.split('|');
	const assignments = {};
	expStrings.forEach(exp => {
		const expValues = exp.split(':');
		if (expValues[0]) {
			assignments[expValues[0]] = {
				id: expValues[0],
				version: expValues[1],
				hash: parseInt(expValues[2], 10),
				population: parseFloat(expValues[3]),
			};
		}
	});

	return assignments;
}

/**
 * Serialize an object into a string for the experiment cookie value
 *
 * Accepts: { pinned_filter : { id: 'pinned_filter', version: 'pinned_filter', hash: -73648897 }, ... }
 * Returns: pinned_filter:pinned_filter:-73648897|lend_filter_v2:x:186894633...
 *
 * @param {object} assignments
 * @returns {string}
 */
export function serializeExpCookie(assignments) {
	if (!assignments) return '';

	const expStrings = _map(assignments, ({
		id,
		version,
		hash,
		population,
	}) => {
		return `${id}:${version}:${hash || 'no-hash'}:${population || 'no-pop'}`;
	});
	// filter out strings that end with a ':', as they have no assignment
	const filteredStrings = _filter(expStrings, s => s.slice(-1) !== ':');
	return filteredStrings.join('|');
}

/**
 * Cycle through targets object and determine matches
 *
 * @param {object} targets
 * @returns {boolean}
 */
export function matchTargets(targets) {
	// return true if no targets are set, aka everyone matches!!!
	if (_isUndefined(targets)) return true;

	// re-start if targets are present
	let matched = false;

	// User Segment Targets
	if (!_isUndefined(targets.users)) {
		const kvu = cookieStore.get('kvu');
		// target cookied users only - kvu cookie is present
		if (kvu && targets.users.indexOf('cookied') > -1) {
			matched = true;
		}
		// target new or existing users without kvu cookie
		if (!kvu && targets.users.indexOf('uncookied') > -1) {
			matched = true;
		}
	}

	return matched;
}

/**
 * Experiment assignment algorithm
 *
 * An example json value for the experiment data stored in SettingsManager:
 * {
 *     "id":"test",
 *     "name": "TestUiExp",
 *     "enabled": true,
 *     "startTime": "2018-01-01",
 *     "endTime": "2019-01-01",
 *     "distribution": {
 *         "control": 0.5,
 *         "a": 0.2,
 *         "b": 0.3
 *     },
 *     "population": 0.5,
 *     "targets": {
 * 			"users": ["cookied"]
 *     }
 * }
 *
 * @param {object} experiment - The experiment data
 * @param {boolean} experiment.enabled - Is the experiment enabled
 * @param {string} experiment.startTime - A date string for the starting time of the experiment
 * @param {string} experiment.endTime - A date string for the ending time of the experiment
 * @param {object} experiment.distribution - An object of the variant weights, where each key is the
 *     variant id and the value is the weight of the variant. The weight must be a number between 0 and 1.
 * @param {number} experiment.population - A number between 0 and 1 representing the fraction of the population
 *     that should be included in the experiment.
 * @returns {string|number|undefined} Returns a variant id or undefined if the experiment is not enabled
 */
export function assignVersion({
	enabled,
	startTime,
	endTime,
	distribution,
	population,
	targets
}) {
	// only try to assign a version if the experiment is enabled
	if (!enabled) return undefined;
	// only try to assign a version if the experiment targets match
	if (!matchTargets(targets)) return undefined;
	// only try to assign a version if the experiment is enabled, started, and not ended
	if (isWithinInterval(new Date(), { start: new Date(startTime), end: new Date(endTime) })) {
		// Based on Algo from Manager.php
		const marker = Math.random();
		let cutoff = 0;

		// turn the distribution object into an array for easier iterating
		const weights = _toPairs(distribution);

		// now loop through and see which element of the distribution that num falls into
		for (let i = 0; i < weights.length; i += 1) {
			const [key, weight] = weights[i];
			// add the current distribution to our cutoff
			if (_isUndefined(population)) {
				cutoff += weight;
			} else {
				cutoff += weight * population;
			}
			// exit the loop and return the current version
			if (marker <= cutoff) return key;
		}
		// if no version was selected, mark them as 'unassigned' so that they will be re-assigned
		// if/when the population percent changes.
		return 'unassigned';
	}
	// doing nothing here returns undefined, indicating that the experiment is not active
}
