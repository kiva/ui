import {
	getForcedAssignment,
	assignVersionForLoginId,
	getActiveExperiments,
	getExperimentSetting,
	calculateHash,
	getLoginId,
	getCookieAssignments,
	setCookieAssignments,
} from '@/util/experiment/experimentUtils';
import Experiment from '@/api/fixtures/Experiment';
import logFormatter from '@/util/logFormatter';

/**
 * Local resolvers for experiment assignment
 *
 * @param {Object} param0.cookieStore The cookie mixin
 * @param {String} param0.url The initial URL loaded by the application
 * @returns {Object} The local resolvers
 */
export default ({ cookieStore, url = '' }) => {
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

					// Check if the requested experiment is active
					if (!activeExperiments.includes(id)) {
						logFormatter('Experiment is not in active experiments list', 'warn');
						return Experiment({ id });
					}

					// Get the settings of the experiment (name, distribution, population)
					const experimentSetting = await getExperimentSetting(id, client);
					if (!experimentSetting.name) {
						logFormatter('Experiment setting is missing', 'warn');
						return Experiment({ id });
					}

					// Get forced assignment if there's an assignment in "setuiab" query string param or "uiab" cookie
					const forcedAssignment = getForcedAssignment(cookieStore, url, id, experimentSetting);

					// Create initial current assignment object
					let currentAssignment = { ...(forcedAssignment || { id }) };

					// Get the hash and population based on the experiment settings
					const hash = calculateHash(experimentSetting);
					const population = experimentSetting?.population ?? 1;

					// Get new experiment assignment if:
					// - Assignment is forced via the "setuiab" query string param
					// - Version is undefined (current assignment wasn't forced)
					// - Hash changed (distribution or population changed for cookie assignments)
					// - Population changed and previous forced version undefined or cookie assignment unassigned
					if (currentAssignment.queryForced
						|| typeof currentAssignment.version === 'undefined'
						|| hash !== currentAssignment.hash
						|| (
							population !== currentAssignment.population
								&& (
									typeof currentAssignment.version === 'undefined'
										|| currentAssignment.version === 'unassigned'
								)
						)
					) {
						// Get new assignment with updated props
						const updatedAssignment = {
							id,
							version: currentAssignment.queryForced
								? currentAssignment.version
								: assignVersionForLoginId(experimentSetting, getLoginId(cookieStore)),
							hash,
							population,
						};

						// Update the "uiab" cookie if the assignment was forced via the "setuiab" query string param
						if (currentAssignment.queryForced) {
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
