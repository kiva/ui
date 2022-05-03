import {
	calculateHash,
	cleanAssignments,
	getAssignments,
	saveAssignments,
	assignVersion,
	getExperimentSettingAsync,
	fetchActiveExperiments,
} from '@/util/experimentUtils';
import Experiment from '@/api/fixtures/Experiment';

/**
 * Experiment resolvers
 */
export default ({ cookieStore, router }) => {
	return {
		resolvers: {
			Query: {
				async experiment(_, { id }, { client }) {
					// get active experiments and assignments
					const activeExperiments = await fetchActiveExperiments(client);
					const assignments = cleanAssignments(getAssignments(cookieStore, router), activeExperiments);

					// return null without saving if activeExperiments list is empty, in case of a data-fetching error
					if (!activeExperiments?.length) {
						// TODO log warning here about empty active experiments list
						return Experiment({ id });
					}

					// return null experiment if current id is not in active experiment list
					if (activeExperiments.indexOf(id) === -1) {
						saveAssignments(cookieStore, assignments);
						return Experiment({ id });
					}

					// get the experiment settings
					const experiment = await getExperimentSettingAsync(client, id);

					// return null experiment if experiment setting is missing
					if (!experiment) {
						saveAssignments(cookieStore, assignments);
						return Experiment({ id });
					}

					// get the hash and population for our current experiment setting
					const settingHash = calculateHash(experiment);
					const population = experiment?.population ?? 1;

					// get the existing assigned version for this experiment id
					let currentAssignment = assignments[id] || {};

					// Add hash to existing cookie exps if it's missing
					if (typeof currentAssignment.hash === 'undefined') {
						currentAssignment.hash = settingHash;
					}

					// Add population to existing cookie experiments if it's missing
					if (typeof currentAssignment.population === 'undefined') {
						currentAssignment.population = population;
					}

					// assign an experiment version if:
					// - currentAssignment.version is undefined or the hashes don't match
					// - current version is 'unassigned' and the population value has changed
					if (typeof currentAssignment.version === 'undefined'
						|| settingHash !== currentAssignment.hash
						|| (
							population !== currentAssignment.population
							&& currentAssignment.version === 'unassigned'
						)
					) {
						// assign the version using the experiment data (undefined if experiment disabled)
						currentAssignment = {
							version: assignVersion(experiment, cookieStore),
							hash: settingHash,
							population,
						};

						// only update assignments and set cookie if the version is set
						if (typeof currentAssignment.version !== 'undefined') {
							// apply updates to assignments object
							assignments[id] = currentAssignment;
						} else {
							// otherwise set the version to null
							currentAssignment.version = null;
						}
					}

					// save and return current assignement
					saveAssignments(cookieStore, cleanAssignments(assignments, activeExperiments));
					return Experiment({
						id,
						version: currentAssignment.version ?? null,
					});
				},
			},
			Mutation: {
				updateExperimentVersion(_, { id, version }) {
					// get current assignments
					const assignments = getAssignments(cookieStore, router);

					// start with previously assigned version for this experiment id
					let updatedVersion = assignments[id] || {};

					// re-assign experiment version
					if (updatedVersion.version !== version) {
						// assign the passed version
						updatedVersion = {
							// get the new assignment
							version,
							id,
							hash: updatedVersion.hash || 0
						};

						// apply updates to assignments object
						assignments[id] = updatedVersion;

						// save the new assignments to the experiment cookie
						saveAssignments(cookieStore, assignments);
					}

					// return currently assigned version
					return Experiment({
						id,
						version: updatedVersion.version ?? null,
					});
				},
			}
		}
	};
};
