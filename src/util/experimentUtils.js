import experimentSettingQuery from '@/graphql/query/experimentSetting.graphql';
import experimentIdsQuery from '@/graphql/query/experimentIds.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import { readJSONSetting, hashCode } from '@/util/settingsUtils';
import logReadQueryError from '@/util/logReadQueryError';
import logFormatter from '@/util/logFormatter';

/**
 * Fetch pre-determined list of experiment settings
 *
 * @param  {ApolloClient} apolloClient
 * @return {string[]} array of active experiment IDs
 */
export function fetchActiveExperiments(apolloClient) {
	return new Promise((resolve, reject) => {
		apolloClient.query({
			query: experimentIdsQuery,
		}).then(results => {
			if (results?.errors) {
				logFormatter(results.errors, 'error');
				reject();
			} else {
				try {
					const setting = results?.data?.general?.activeExperiments?.value;
					const parsed = JSON.parse(setting) ?? '';
					const activeExperiments = parsed.split(',').map(id => id.trim()).filter(id => id);
					resolve(activeExperiments || []);
				} catch {
					resolve([]);
				}
				resolve(readJSONSetting(results, 'data.general.activeExperiments.value') ?? []);
			}
		}).catch(reject);
	});
}

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

	const expStrings = Object.keys(assignments).map(id => {
		const { version, hash, population } = assignments[id];
		return `${id}:${version}:${hash || 'n'}:${population || 'n'}`;
	});
	// filter out strings that end with a ':', as they have no assignment
	const filteredStrings = expStrings.filter(s => s.slice(-1) !== ':');
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
 *     "name": "TestUiExp",
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
 * @param {string} experiment - The experiment name, typocally used for tracking
 * @param {object} experiment.distribution - An object of the variant weights, where each key is the
 *     variant id and the value is the weight of the variant. The weight must be a number between 0 and 1.
 * @param {number} experiment.population - A number between 0 and 1 representing the fraction of the population
 *     that should be included in the experiment.
 * @param {object} experiment.targets
 * @returns {string|number|undefined} Returns a variant id or undefined if the experiment is not enabled
 */
export function assignVersion({
	distribution,
	population,
	targets
}, cookieStore) {
	// only try to assign a version if the experiment targets match
	if (!matchTargets(targets, cookieStore)) return undefined;

	// Based on Algo from Manager.php
	const marker = Math.random();
	let cutoff = 0;

	// turn the distribution object into an array for easier iterating
	const weights = Object.keys(distribution).map(key => [key, distribution[key]]);

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
		logReadQueryError(e, 'FeatureHeroLoanWrapper experimentSetting');
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
 * @return {Experiment}                the experiment assignment object read from the client cache
 */
export function trackExperimentVersion(client, trackEvent, category, key, action) {
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
		);
	}
	return exp;
}

/**
 * Calculate a hash representation of the experiment
 *
 * @param  {object} experiment
 * @return {int}
 */
export function calculateHash(experiment) {
	// Create targeted subset of experiment setting to use in hash
	// Changing the Name, Distribution, Variants, or Control values will "reset" an experiment assignment
	const {
		name, distribution, variants, control
	} = experiment || {};
	const experimentSubset = {
		name, distribution, variants, control
	};

	// Get the hash for our current experiment setting
	return hashCode(JSON.stringify(experimentSubset));
}

/**
 * Remove inactive experiments and null versions from assignments list
 *
 * @param  {object} assignments
 * @param  {string[]} activeExperiments
 * @return {object}
 */
export function cleanAssignments(assignments, activeExperiments) {
	const cleaned = {};
	// only save assignments that are in the active experiment list and have a version
	Object.keys(assignments).forEach(assignmentId => {
		if (activeExperiments.indexOf(assignmentId) > -1 && assignments[assignmentId].version) {
			cleaned[assignmentId] = assignments[assignmentId];
		}
	});
	return cleaned;
}

/**
 * Get current experiment assignments
 *
 * @param  {CookieStore} cookieStore
 * @param  {VueRouter} router
 * @return {object}
 */
export function getAssignments(cookieStore, router) {
	// initialize the assignments from the experiment cookie
	const cookieAssignments = parseExpCookie(cookieStore.get('uiab'));

	// read route query
	const routeQuery = router?.currentRoute?.query?.setuiab ?? [];
	// convert both a single string and an array of strings to an array of strings.
	const arrayOfSetuiabValues = [].concat(routeQuery);
	// parse forced experiment assignments
	const routeAssignments = {};
	arrayOfSetuiabValues.forEach(uiabvalue => {
		const forcedExp = uiabvalue.split('.');
		const id = encodeURIComponent(forcedExp[0]);
		const version = encodeURIComponent(forcedExp[1]);
		routeAssignments[id] = { id, version };
	});

	// merge for current assignments
	return {
		...cookieAssignments,
		...routeAssignments
	};
}

/**
 * Save assignments object to experiment cookie
 *
 * @param  {CookieStore} cookieStore
 * @param  {object} assignments
 */
export function saveAssignments(cookieStore, assignments) {
	cookieStore.set('uiab', serializeExpCookie(assignments), { path: '/' });
}
