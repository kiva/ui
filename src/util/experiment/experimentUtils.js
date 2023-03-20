import _filter from 'lodash/filter';
import _map from 'lodash/map';
import _toPairs from 'lodash/toPairs';
import { isWithinInterval } from 'date-fns';
import experimentSettingQuery from '@/graphql/query/experimentSetting.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import { readJSONSetting } from '@/util/settingsUtils';
import logReadQueryError from '@/util/logReadQueryError';
import Alea from './Alea';

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
export function matchTargets(targets, cookieStore) {
	// return true if no targets are set, aka everyone matches!!!
	if (typeof targets === 'undefined') return true;

	// re-start if targets are present
	let matched = false;

	// User Segment Targets
	if (typeof targets.users !== 'undefined') {
		const kvu = cookieStore.get('kvu');
		const kvuLb = cookieStore.get('kvu_lb');
		const kvuDb = cookieStore.get('kvu_db');

		// target cookied users only - kvu cookie is present
		if (kvu && targets.users.indexOf('cookied') > -1) {
			matched = true;
		}
		// target new or existing users without kvu cookie
		if (!kvu && targets.users.indexOf('uncookied') > -1) {
			matched = true;
		}
		// target users who have lent
		if (kvuLb === 'true' && targets.users.indexOf('lender') > -1) {
			matched = true;
		}
		// target users who have not lent
		if (kvuLb !== 'true' && targets.users.indexOf('non-lender') > -1) {
			matched = true;
		}
		// target users who have deposited
		if (kvuDb === 'true' && targets.users.indexOf('depositor') > -1) {
			matched = true;
		}
		// target users who have not deposited
		if (kvuDb !== 'true' && targets.users.indexOf('non-depositor') > -1) {
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
}, cookieStore) {
	// only try to assign a version if the experiment is enabled
	if (!enabled) return undefined;
	// only try to assign a version if the experiment targets match
	if (!matchTargets(targets, cookieStore)) return undefined;
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
			if (typeof population === 'undefined') {
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

/**
 * Experiment assignment algorithm for login ID
 *
 * An example json value for the experiment data stored in SettingsManager:
 * {
 *     "name": "TestUiExp",
 *     "distribution": {
 *         "control": 0.5,
 *         "a": 0.2,
 *         "b": 0.3
 *     },
 *     "population": 0.5,
 * }
 *
 * @param {String} param0.name The name of the experiment
 * @param {Object} param0.distribution An object of the variant weights, where each key is the
 * variant ID and the value is the weight of the variant. The weight must be a number between 0 and 1.
 * @param {Number} param0.population A number between 0 and 1 representing the fraction of the population
 * that should be included in the experiment.
 * @param {String|Number} loginId The login ID of the current user. This ID can be the user or visitor ID.
 * @returns {String|Number} Returns a variant ID of the experiment
 */
export function assignVersionForLoginId({ name, distribution, population }, loginId) {
	// Seed the pseudo random number generator with the experiment name and login ID
	// The seed ensures that the same number is generated for this experiment and login ID combination
	const marker = Alea(name, loginId)();

	let cutoff = 0;

	// Turn the distribution object into an array for easier iterating
	const weights = Object.keys(distribution).map(key => [key, distribution[key]]);

	// Now loop through and see which element of the distribution that random number falls into
	for (let i = 0; i < weights.length; i += 1) {
		const [key, weight] = weights[i];
		// Add the current distribution to our cutoff
		if (typeof population === 'undefined') {
			cutoff += weight;
		} else {
			cutoff += weight * population;
		}
		// Exit the loop and return the current version
		if (marker <= cutoff) return key;
	}
}

/**
 * Get the experiment setting data for a given experiment key asynchronously.
 *
 * @param  {ApolloClient} client     the client to make the request to
 * @param  {string} key              the experiment key
 * @return {Promise}                 a promise that resolves to the setting data
 */
export function getExperimentSettingAsync(client, key) {
	return client.query({
		query: experimentSettingQuery,
		variables: { key },
	}).then(({ data }) => {
		const setting = readJSONSetting(data, 'general.uiExperimentSetting.value') ?? {};
		return setting;
	});
}

/**
 * Get the experiment setting data for a given experiment key synchronously.
 *
 * @param  {ApolloClient} client     the client to read the data from
 * @param  {string} key              the experiment key
 * @return {object}                  the cached setting data
 */
export function getExperimentSettingCached(client, key) {
	try {
		const data = client.readQuery({
			query: experimentSettingQuery,
			variables: { key },
		});
		const setting = readJSONSetting(data, 'general.uiExperimentSetting.value') ?? {};
		return setting;
	} catch (e) {
		logReadQueryError(e, `getExperimentSettingCached experimentSetting: ${key}`);
		return {};
	}
}

/**
 * Track which experiment version the user is assigned
 *
 * @param  {ApolloClient} client       a client with the experiment assignment cached
 * @param  {Function} trackEvent       the tracking function to call (usually this.$kvTrackEvent)
 * @param  {string} category           the tracking category
 * @param  {string} key                the experiment key
 * @param  {string} action             the tracking action parameter
 * @param  {string} property           the tracking property parameter
 * @return {Experiment}                the experiment assignment object read from the client cache
 */
export function trackExperimentVersion(client, trackEvent, category, key, action, property = undefined) {
	// get assignment for experiment key
	const exp = client.readFragment({
		id: `Experiment:${key}`,
		fragment: experimentVersionFragment,
	}) ?? {};

	// Fire event for experiment key
	if (exp.version && exp.version !== 'unassigned') {
		trackEvent(
			category,
			action ?? key,
			exp.version,
			property
		);
	}
	return exp;
}
