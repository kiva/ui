import _isUndefined from 'lodash/isUndefined';
import _fromPairs from 'lodash/fromPairs';
import _toPairs from 'lodash/toPairs';
import { isWithinRange } from 'date-fns';
import { readJSONSetting } from '@/util/settingsUtils';

/*
 * Parse the experiment cookie value into a plain object
 *
 * @param {string} cookie
 * @returns {object}
 */
function parseExpCookie(cookie) {
	if (!cookie) return {};
	const expStrings = cookie.split('|');
	const pairs = expStrings.map(exp => exp.split(':'));
	return _fromPairs(pairs);
}

/*
 * Serialize an object into a string for the experiment cookie value
 *
 * @param {object} assignments
 * @returns {string}
 */
function serializeExpCookie(assignments) {
	const pairs = _toPairs(assignments);
	const expStrings = pairs.map(pair => pair.join(':'));
	return expStrings.join('|');
}

/*
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
 *     }
 * }
 *
 * @param {object} experiment - The experiment data
 * @param {boolean} experiment.enabled - Is the experiment enabled
 * @param {string} experiment.startTime - A date string for the starting time of the experiment
 * @param {string} experiment.endTime - A date string for the ending time of the experiment
 * @param {object} experiment.distribution - An object of the variant weights, where each key is the
 *     variant id and the value is the weight of the variant. The weight must be a number between 0 and 1.
 * @returns {string|number|undefined} Returns a variant id or undefined if the experiment is not enabled
 */
function assignVersion({
	enabled,
	startTime,
	endTime,
	distribution
}) {
	// only try to assign a version if the experiment is enabled, started, and not ended
	if (enabled && isWithinRange(new Date(), new Date(startTime), new Date(endTime))) {
		// Based on Algo from Manager.php
		const marker = Math.random();
		let cutoff = 0;

		// turn the distribution object into an array for easier iterating
		const weights = _toPairs(distribution);

		// now loop through and see which element of the distribution that num falls into
		for (let i = 0; i < weights.length; i += 1) {
			const [key, weight] = weights[i];
			// add the current distribution to our cutoff
			cutoff += weight;
			// exit the loop and return the current version
			if (marker <= cutoff) return key;
		}
	}
	// doing nothing here returns undefined, indicating that the experiment is not active
}

/*
 * Experiment resolvers
 */
export default ({ cookieStore }) => {
	// initialize the assignments from the experiment cookie
	const assignments = parseExpCookie(cookieStore.get('uiab'));

	return {
		resolvers: {
			Query: {
				experiment(_, { id }, context) {
					// get the existing assigned version for this experiment id
					let version = assignments[id];

					// assign an experiment version if it's currently undefined
					if (_isUndefined(version)) {
						// read the experiment data from the cache
						const experiment = readJSONSetting(context, `cache.data.data['Setting:uiexp.${id}'].value`);

						// assign the version using the experiment data (undefined if experiment disabled)
						assignments[id] = assignVersion(experiment);

						// save the new assignments to the experiment cookie
						cookieStore.set('uiab', serializeExpCookie(assignments));

						// get the new assignment. return null if undefined so that apollo saves the value
						version = _isUndefined(assignments[id]) ? null : assignments[id];
					}

					return {
						id,
						version,
						__typename: 'Experiment',
					};
				},
			}
		}
	};
};
