import experimentSettingQuery from '@/graphql/query/experimentSetting.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentIdsQuery from '@/graphql/query/experimentIds.graphql';
import { readJSONSetting, hashCode } from '@/util/settingsUtils';
import logReadQueryError from '@/util/logReadQueryError';
import { v4 as uuidv4 } from 'uuid';
import Alea from './Alea';

/**
 * The name of the cookie for storing assignments
 */
const UIAB_COOKIE_NAME = 'uiab';

/**
 * Gets the current active experiments
 *
 * @param {ApolloCache} cache The Apollo cache
 * @param {ApolloClient} client The Apollo client
 * @returns {Promise<Array<string>>|Array<string>} The current active experiment names
 */
export async function getActiveExperiments(cache, client) {
	let activeExperiments;

	// First check if the active experiments are cached
	try {
		const data = cache.readQuery({ query: experimentIdsQuery });
		activeExperiments = data?.general?.activeExperiments?.value;
	} catch {
		// noop
	}

	// Then try getting the active experiments async
	if (!activeExperiments?.length) {
		try {
			const { data } = await client.query({ query: experimentIdsQuery });
			activeExperiments = data?.general?.activeExperiments?.value;
		} catch {
			// noop
		}
	}

	return activeExperiments ?? [];
}

/**
 * Gets the experiment setting data for a given experiment key synchronously
 *
 * @param {ApolloClient} client The Apollo client
 * @param {string} key The experiment key
 * @return {Object} The cached setting
 */
export function getExperimentSettingCached(client, key) {
	try {
		const data = client.readQuery({
			query: experimentSettingQuery,
			variables: { key },
		});
		return readJSONSetting(data, 'general.uiExperimentSetting.value') ?? {};
	} catch (e) {
		logReadQueryError(e, `getExperimentSettingCached experimentSetting: ${key}`);
		return {};
	}
}

/**
 * Gets the experiment setting data for a given experiment key asynchronously
 *
 * @param {Object} client The Apollo client
 * @param {string} key The experiment key
 * @return {Promise<Object>} The experiment settings
 */
export function getExperimentSettingAsync(client, key) {
	return client.query({
		query: experimentSettingQuery,
		variables: { key },
	}).then(({ data }) => {
		return readJSONSetting(data, 'general.uiExperimentSetting.value') ?? {};
	});
}

/**
 * Gets the experiment setting data for a given experiment key
 *
 * @param {string} key The experiment key
 * @param {ApolloCache} client The Apollo client
 * @returns {Promise<Object>|Object}The experiment settings
 */
export function getExperimentSetting(key, client) {
	const cached = getExperimentSettingCached(client, key);
	return cached.name ? cached : getExperimentSettingAsync(client, key);
}

/**
 * Parses the experiment cookie value into an object
 *
 * Accepts: pinned_filter:pinned_filter:-73648897:1|lend_filter_v2:x:186894633:1...
 * Returns: { pinned_filter : { id: 'pinned_filter', version: 'pinned_filter', hash: -73648897, population: 1 }, ... }
 *
 * @param {string} cookie The value of the setuiab cookie
 * @returns {Object} The parsed experiment cookie value
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
 * Serializes an object into a string for the experiment cookie value
 *
 * Accepts: { pinned_filter : { id: 'pinned_filter', version: 'pinned_filter', hash: -73648897, population: 1 }, ... }
 * Returns: pinned_filter:pinned_filter:-73648897:1|lend_filter_v2:x:186894633:1...
 *
 * @param {Object} assignments The experiment assignments
 * @returns {string} The serialized cookie value
 */
export function serializeExpCookie(assignments) {
	if (!assignments) return '';

	// eslint-disable-next-line no-unused-vars
	const expStrings = Object.entries(assignments).map(([_, {
		id, version, hash, population
	}]) => {
		return `${id}:${version}:${hash || 'no-hash'}:${population || 'no-pop'}`;
	});

	// Filter out strings that end with a ':', as they have no assignment
	const filteredStrings = expStrings.filter(s => s.slice(-1) !== ':');
	return filteredStrings.join('|');
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
 * @param {string} param0.name The name of the experiment
 * @param {Object} param0.distribution An object of the variant weights, where each key is the
 * variant ID and the value is the weight of the variant. The weight must be a number between 0 and 1.
 * @param {number} param0.population A number between 0 and 1 representing the fraction of the population
 * that should be included in the experiment.
 * @param {string|number} loginId The login ID of the current user. This ID can be the user or visitor ID.
 * @returns {string|number} Returns a variant ID of the experiment
 */
export function assignVersionForLoginId({ name, distribution, population = 1 }, loginId) {
	if (!name || !distribution || !loginId) return;

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
 * Track which experiment version the user is assigned
 *
 * @param {ApolloClient} client The Apollo client
 * @param {Function} trackEvent The tracking function to call (usually this.$kvTrackEvent)
 * @param {string} category The tracking category
 * @param {string} key The experiment key
 * @param {string} action The tracking action parameter
 * @param {string} property The tracking property parameter
 * @return {Experiment} The experiment assignment object read from the client cache
 */
export function trackExperimentVersion(client, trackEvent, category, key, action, property = undefined) {
	// Get assignment for experiment key
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

/**
 * Calculates a hash representation of an experiment
 *
 * @param {Object} experiment The experiment setting
 * @returns {number} The hash of the experiment
 */
export function calculateHash(experiment = {}) {
	// Changing name, distribution, variants, or control values in Kiva Admin will "reset" an experiment assignment.
	// The experiment assignment algorithm only uses distribution, but variants and control kept to keep old experiment
	// assignments consistent. Once all existing experiments have completed, variants and control can be removed here.
	const {
		name, distribution, variants, control,
	} = experiment || {};
	const experimentSubset = {
		name, distribution, variants, control,
	};

	// Get the hash for our current experiment setting
	return hashCode(JSON.stringify(experimentSubset));
}

/**
 * Gets the current cookie assignments
 *
 * @param {CookieStore} cookieStore The cookie mixin
 * @returns {Object} The cookie assignments
 */
export const getCookieAssignments = cookieStore => parseExpCookie(cookieStore.get(UIAB_COOKIE_NAME));

/**
 * Sets the cookie assignments
 *
 * @param {CookieStore} cookieStore The cookie mixin
 * @param {Object} assignments The cookie assignments
 */
export const setCookieAssignments = (cookieStore, assignments) => {
	const serialized = serializeExpCookie(assignments);
	if (serialized) {
		cookieStore.set(UIAB_COOKIE_NAME, serialized, { path: '/' });
	}
};

/**
 * Get current experiment assignments forced via either query string or cookie
 *
 * @param {string} cookieStore The cookie mixin
 * @param {string} url The URL to check for query forced assignments
 * @param {string} id The ID of the assignment to check
 * @param {Object} experimentSetting The experiment settings
 * @returns The forced experiment assignment
 */
export const getForcedAssignment = (cookieStore, url, id, experimentSetting) => {
	// Get setuiab value
	const { setuiab } = new Proxy(new URLSearchParams(url?.split('?')?.[1] ?? ''), {
		get: (searchParams, prop) => searchParams.get(prop),
	});

	// Parse forced experiment assignment
	const cookieAssignment = getCookieAssignments(cookieStore)[id];
	const forcedExp = setuiab?.split('.') ?? [];
	const queryForced = forcedExp[0] === id && !!forcedExp[1];
	const forcedVersion = (queryForced && encodeURIComponent(forcedExp[1])) || cookieAssignment?.version;

	// Return forced assignment if the version wasn't undefined
	if (typeof forcedVersion !== 'undefined') {
		return { ...experimentSetting, version: forcedVersion, queryForced };
	}
};

/**
 * Gets the login ID for the current user
 *
 * @param {CookieStore} cookieStore The cookie mixin
 * @returns {string} The login ID
 */
export const getLoginId = cookieStore => {
	// Return hashed user ID from kvu ticket or visitor ID GUID or fallback GUID
	// The fallback GUID shouldn't be needed but included in case there's an unknown edge case
	return cookieStore.get('kvu')?.split('.')?.[3] || cookieStore.get('uiv') || uuidv4();
};
