import {
	getForcedAssignment,
	assignVersionForLoginId,
	getActiveExperiments,
	getExperimentSetting,
	calculateHash,
	getLoginId,
	getCookieAssignments,
	setCookieAssignments,
	cleanupStaleCookieAssignments,
} from '#src/util/experiment/experimentUtils';
import Experiment from '#src/api/fixtures/Experiment';
import logFormatter from '#src/util/logFormatter';

/**
 * Local resolvers for experiment assignment
 *
 * @param {Object} param0.cookieStore The cookie mixin
 * @param {Object} param0.route The initial route resolved by the Vue router
 * @param {boolean|string} param0.forceHeader Force new navigation header
 * @returns {Object} The local resolvers
 */
export default ({ cookieStore, route, forceHeader }) => {
	if (!cookieStore) {
		return {};
	}

	return {
		resolvers: {
			Query: {
				/**
				 * Assigns the experiment based on the provided ID if the experiment is active and has settings
				 *
				 * @param {Object} _ The previous resolver in the resolver chain
				 * @param {String} param1.id The ID of the experiment
				 * @param {Object} param2.cache The Apollo cache
				 * @param {Object} param2.client The Apollo client
				 * @returns The active experiment assignment
				 */
				async experiment(_, { id = '' }, { cache, client }) {
					// Get the list of active experiments
					const activeExperiments = await getActiveExperiments(cache, client);
					if (!activeExperiments?.length) {
						logFormatter('Active experiments list is empty', 'warn');
						return Experiment({ id });
					}

					// Clean up stale cookie assignments that are no longer in active experiments
					cleanupStaleCookieAssignments(cookieStore, activeExperiments);

					// Check if the requested experiment is active
					if (!activeExperiments.includes(id)) {
						logFormatter(`Experiment is not in active experiments list: ${id}`, 'warn');
						return Experiment({ id });
					}

					// Get the settings of the experiment (name, distribution, population)
					const experimentSetting = await getExperimentSetting(id, client);
					if (!experimentSetting.name) {
						logFormatter(`Experiment setting is missing: ${id}`, 'warn');
						return Experiment({ id });
					}

					// Get forced assignment if there's an assignment in "setuiab" query string param or "uiab" cookie
					const forcedAssignment = getForcedAssignment(
						cookieStore,
						route,
						id,
						experimentSetting,
						forceHeader
					);

					// Create initial current assignment object
					let currentAssignment = { ...(forcedAssignment || { id }) };

					// Get the hash and population based on the experiment settings
					const hash = calculateHash(experimentSetting);
					const population = experimentSetting?.population ?? 1;

					// Check if this experiment uses userId-based assignment (no cookie storage)
					// When userIdExperiment is true, assignments are determined by the current loginId
					// and are NOT stored to the uiab cookie (except for query-forced assignments)
					const isUserIdExperiment = experimentSetting?.userIdExperiment === true;

					// If this is a userIdExperiment and there's an existing non-query-forced cookie assignment,
					// remove it from the cookie (experiment may have transitioned from cookie-based to userId-based)
					if (isUserIdExperiment && currentAssignment.version && !currentAssignment.queryForced) {
						const cookieAssignments = getCookieAssignments(cookieStore);
						if (cookieAssignments[id]) {
							delete cookieAssignments[id];
							setCookieAssignments(cookieStore, cookieAssignments);
						}
						// Clear the cookie assignment so we recalculate based on loginId
						currentAssignment = { id };
					}

					// Get new experiment assignment if:
					// - Assignment is not Fastly header forced (new assignment and setting cookie not needed)
					// - Assignment is forced via the "setuiab" query string param
					// - Version is undefined (current assignment wasn't forced)
					// - Hash changed (distribution or population changed for cookie assignments)
					// - Population changed and previous forced version undefined or cookie assignment unassigned
					if (
						!currentAssignment.headerForced
						&& (currentAssignment.queryForced
							|| typeof currentAssignment.version === 'undefined'
							|| hash !== currentAssignment.hash
							|| (
								population !== currentAssignment.population
									&& (
										typeof currentAssignment.version === 'undefined'
											|| currentAssignment.version === 'unassigned'
									)
							)
						)
					) {
						// Get new assignment with updated props
						const updatedAssignment = {
							id,
							version: currentAssignment.queryForced
								? currentAssignment.version
								: assignVersionForLoginId(id, experimentSetting, getLoginId(cookieStore)),
							hash,
							population,
							queryForced: currentAssignment.queryForced,
						};

						// Update the "uiab" cookie:
						// - Always update if assignment was forced via "setuiab" query string param
						// - Also update for new assignments if NOT a userIdExperiment (default behavior)
						// userIdExperiment uses current loginId for assignment without cookie storage
						if (currentAssignment.queryForced || !isUserIdExperiment) {
							const cookieAssignments = getCookieAssignments(cookieStore);
							cookieAssignments[id] = updatedAssignment;
							setCookieAssignments(cookieStore, cookieAssignments);
						}

						// Update the current assignment that will be returned
						currentAssignment = updatedAssignment;
					}

					// Return the current experiment assignment
					return Experiment({ id, version: currentAssignment.version });
				},
			},
		}
	};
};
