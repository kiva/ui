import experimentSettingQuery from '#src/graphql/query/experimentSetting.graphql';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import experimentIdsQuery from '#src/graphql/query/experimentIds.graphql';
import { readJSONSetting, hashCode } from '#src/util/settingsUtils';
import logReadQueryError from '#src/util/logReadQueryError';
import { v4 as uuidv4 } from 'uuid';
import logFormatter from '#src/util/logFormatter';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import Alea from './Alea';
import { HOME_PAGE_EXPERIMENT_KEY } from './fastlyExperimentUtils';

/**
 * The name of the cookie for storing assignments
 */
export const UIAB_COOKIE_NAME = 'uiab';

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
		activeExperiments = JSON.parse(data?.general?.activeExperiments?.value).split(',');
	} catch {
		// noop
	}

	// Then try getting the active experiments async
	if (!activeExperiments?.length) {
		try {
			const { data } = await client.query({ query: experimentIdsQuery });
			activeExperiments = JSON.parse(data?.general?.activeExperiments?.value).split(',');
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
				queryForced: expValues[4]?.toUpperCase() === true.toString().toUpperCase(),
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
		id, version, hash, population, queryForced
	}]) => {
		// eslint-disable-next-line max-len
		return `${id}:${version}:${hash || 'no-hash'}:${population || 'no-pop'}:${queryForced === true ? true.toString() : false.toString()}`;
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
 * @param {string} experimentKey The key of the experiment
 * @param {Object} param1.distribution An object of the variant weights, where each key is the
 * variant ID and the value is the weight of the variant. The weight must be a number between 0 and 1.
 * @param {number} param1.population A number between 0 and 1 representing the fraction of the population
 * that should be included in the experiment.
 * @param {string|number} loginId The login ID of the current user. This ID can be the user or visitor ID.
 * @returns {string|number} Returns a variant ID of the experiment
 */
export function assignVersionForLoginId(experimentKey, { distribution, population = 1 }, loginId) {
	if (!experimentKey || !distribution || !loginId) return;

	// Seed the pseudo random number generator with the experiment key and login ID
	// The seed ensures that the same number is generated for this experiment and login ID combination
	const marker = Alea(experimentKey, loginId)();

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
 * @param {Object} route The initial route resolved by the Vue router
 * @param {string} id The ID of the assignment to check
 * @param {Object} experimentSetting The experiment settings
 * @param {boolean|string} should force the new header experiment if was setted by fastly header otherwise false
 * @returns The forced experiment assignment
 */
export const getForcedAssignment = (cookieStore, route, id, experimentSetting, forceHeader = false) => {
	// Get previous cookie assignment
	const cookieAssignment = getCookieAssignments(cookieStore)[id];

	let queryForced;
	let headerForced = false;
	let forcedVersion = cookieAssignment?.version;

	if (forceHeader && id === HOME_PAGE_EXPERIMENT_KEY) {
		headerForced = true;
		forcedVersion = forceHeader;
	} else {
		// Look through setuiab assignments
		const setuiabQuery = route?.query?.setuiab;
		// Route query param will be an array if more than one instance in URL
		const setuiab = typeof setuiabQuery === 'string' ? [setuiabQuery] : (setuiabQuery ?? []);
		for (let i = 0; i < setuiab.length; i += 1) {
			const forcedExp = setuiab[i]?.split('.') ?? [];
			if (forcedExp[0] === id) {
				queryForced = !!forcedExp[1];
				forcedVersion = (queryForced && encodeURIComponent(forcedExp[1])) || forcedVersion;
				break;
			}
		}
	}

	// Return forced assignment if the version wasn't undefined
	if (typeof forcedVersion !== 'undefined') {
		// Get hash from cookie so that forced assignments don't get re-assigned because of missing hash
		const forcedHash = cookieAssignment?.hash;
		return {
			...experimentSetting,
			version: forcedVersion,
			...(forcedHash && { hash: forcedHash }),
			...(headerForced && { headerForced }),
			queryForced: !!queryForced,
		};
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

/**
 * Assigns all of the active experiments for the current user
 * Must be ran server-side due to the use of the HTTP only "kvu" cookie
 *
 * @param {ApolloClient} apollo The Apollo client
 * @returns {Promise} Empty or assignment Promise
 */
export const assignAllActiveExperiments = async apollo => {
	// Get active experiment IDs
	let activeExperiments;
	try {
		activeExperiments = await getActiveExperiments(apollo.cache, apollo);
	} catch (e) {
		logFormatter(e, 'error');
	}

	// Run the assignment query for all active experiments
	return Promise.all((activeExperiments ?? []).map(id => {
		return apollo.query({ query: experimentAssignmentQuery, variables: { id } });
	}));
};

/**
 * Evicts an experiment from the Apollo cache if setuiab query param is present
 * This forces the experiment resolver to re-run with the current route
 *
 * @param {Object} apollo The Apollo client
 * @param {Object} route The Vue route object
 * @param {string} experimentKey The experiment key to evict
 */
export const evictExperimentCacheIfForced = (apollo, route, experimentKey) => {
	// Check if setuiab query param is present
	if (route?.query?.setuiab) {
		// Evict the cached experiment to force re-assignment
		apollo.cache.evict({
			id: `Experiment:${experimentKey}`,
		});
		apollo.cache.gc();
	}
};

/**
 * Gets the initial experiment version from cookie or Apollo cache synchronously
 * This prevents pop-in by providing an immediate value before any async query completes
 *
 * @param {CookieStore} cookieStore The cookie store
 * @param {ApolloClient} apollo The Apollo client (optional, will fall back if no cookie)
 * @param {string} experimentKey The experiment key
 * @returns {string|undefined} The experiment version from cookie/cache, or undefined if not found
 */
export const getInitialExperimentVersion = (cookieStore, apollo, experimentKey) => {
	// First check cookie - this will exist if setuiab was used for assignment
	const assignments = getCookieAssignments(cookieStore);
	const cookieVersion = assignments[experimentKey]?.version;
	if (cookieVersion) {
		return cookieVersion;
	}

	// Fall back to Apollo cache (populated by preFetch during SSR) if no cookie
	if (apollo) {
		try {
			const experiment = apollo.readFragment({
				id: `Experiment:${experimentKey}`,
				fragment: experimentVersionFragment,
			});
			if (experiment?.version) {
				return experiment.version;
			}
		} catch (e) {
			// Cache miss is expected, return undefined
		}
	}

	return undefined;
};

/**
 * Queries for an experiment assignment, evicting cache if setuiab is present
 * Returns a promise that resolves with the experiment version ('a', 'b', etc.)
 *
 * @param {Object} apollo The Apollo client
 * @param {Object} route The Vue route object
 * @param {string} experimentKey The experiment key to query
 * @returns {Promise<Object>} Promise that resolves with the experiment data
 */
export const queryExperimentAssignment = (apollo, route, experimentKey) => {
	// Evict cached experiment if setuiab query param is present
	evictExperimentCacheIfForced(apollo, route, experimentKey);

	// Query for experiment assignment (will respect setuiab query param via resolver)
	return apollo.query({
		query: experimentAssignmentQuery,
		variables: { id: experimentKey },
	});
};

/**
 * Initializes an experiment assignment by reading from cookie/Apollo cache synchronously,
 * then optionally querying for the latest assignment if setuiab query param is present.
 * This prevents pop-in by setting an initial value immediately.
 *
 * @param {Object} cookieStore CookieStore instance
 * @param {Object} apollo Apollo client instance
 * @param {Object} route Vue Router route object
 * @param {string} experimentKey The experiment key to initialize
 * @param {Function} callback Function called with version ('a', 'b', etc.) when updated
 * @param {Function} trackEvent The tracking function to call (usually this.$kvTrackEvent)
 * @param {string} action The tracking action parameter (optional, defaults to experimentKey)
 * @param {string} category The tracking category (optional, defaults to 'event-tracking')
 * @returns {string|undefined} Initial version from cookie/cache
 */
export const initializeExperiment = (
	cookieStore,
	apollo,
	route,
	experimentKey,
	callback,
	trackEvent = null,
	action = null,
	category = 'event-tracking'
) => {
	// Get initial experiment value from cookie or Apollo cache to prevent pop-in
	const initialVersion = getInitialExperimentVersion(cookieStore, apollo, experimentKey);

	// Set initial value immediately (prevents pop-in)
	if (callback) {
		callback(initialVersion);
	}

	// Only query for experiment assignment if setuiab query param is present (to force re-assignment)
	if (route?.query?.setuiab) {
		queryExperimentAssignment(apollo, route, experimentKey)
			.then(({ data }) => {
				if (callback) {
					callback(data?.experiment?.version);
				}

				// Track experiment version if trackEvent function is provided
				if (trackEvent) {
					trackExperimentVersion(apollo, trackEvent, category, experimentKey, action);
				}
			});
	} else if (trackEvent) {
		// No query needed, just track the cached version
		trackExperimentVersion(apollo, trackEvent, category, experimentKey, action);
	}

	return initialVersion;
};
