import { parseExpCookie, serializeExpCookie, assignVersion } from '@/util/experimentUtils';
import { hashCode } from '@/util/settingsUtils';
import experimentSettingQuery from '@/graphql/query/experimentSetting.graphql';

/**
 * Experiment resolvers
 */
export default ({ cookieStore }) => {
	// initialize the assignments from the experiment cookie
	const assignments = parseExpCookie(cookieStore.get('uiab'));

	return {
		resolvers: {
			Query: {
				experiment(_, { id }, { cache }) {
					// get the existing assigned version for this experiment id
					let currentAssignment = assignments[id] || {};

					// read the experiment data from the cache
					const experimentData = cache.readQuery({
						query: experimentSettingQuery,
						variables: {
							key: id || '',
						}
					});

					const experimentSetting = experimentData?.general?.uiExperimentSetting;
					const experiment = JSON.parse(experimentSetting?.value);

					// create targeted subset of experiment setting to use in hash
					// Changing the Name, Distribution, Variants or Control values will "reset" an experiment assignment
					const {
						name, distribution, variants, control
					} = experiment || {};
					const experimentSubset = {
						name, distribution, variants, control
					};

					// get the hash for our current experiment setting
					const settingHash = hashCode(JSON.stringify(experimentSubset));
					const population = experiment?.population ?? 1;

					// Add hash to existing cookie exps if it's missing
					if (typeof currentAssignment.hash === 'undefined') {
						currentAssignment.hash = settingHash;
					}

					// Add population to existing cookie experiments if it's missing
					if (typeof currentAssignment.population === 'undefined') {
						currentAssignment.population = population;
					}

					// assign an experiment version if:
					// - we have an experiment
					// - and the experiment is enabled
					// - and currentAssignment.version is undefined or the hashes don't match
					// - current version is 'unassigned' and the population value has changed
					if (experiment !== null
						&& experiment.enabled
						&& (
							typeof currentAssignment.version === 'undefined'
							|| settingHash !== currentAssignment.hash
							|| (
								population !== currentAssignment.population
								&& currentAssignment.version === 'unassigned'
							)
						)
					) {
						// assign the version using the experiment data (undefined if experiment disabled)
						currentAssignment = {
							id,
							version: assignVersion(experiment, cookieStore),
							hash: settingHash,
							population,
						};

						// only update assignments and set cookie if the version is set
						if (typeof currentAssignment.version !== 'undefined' && experiment.enabled) {
							// apply updates to assignments object
							assignments[id] = currentAssignment;

							// save the new assignments to the experiment cookie
							cookieStore.set('uiab', serializeExpCookie(assignments), { path: '/' });
						} else {
							// otherwise set the version to null
							currentAssignment.version = null;
						}
					}

					return {
						id,
						// if experiment exist & enabled = false return a null version
						// > we don't want to render a disabled experiment even if a cookie version is present
						version: (!id?.length || experiment === null || !experiment.enabled)
							? null : currentAssignment.version,
						__typename: 'Experiment',
					};
				},
			},
			Mutation: {
				updateExperimentVersion(_, { id, version }) {
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
						cookieStore.set('uiab', serializeExpCookie(assignments), { path: '/' });
					}

					return {
						id,
						// return null if undefined so that apollo saves the value
						version: typeof version === 'undefined' ? null : version,
						__typename: 'Experiment',
					};
				},
				// COMING SOON
				// eslint-disable-next-line
				cleanExperimentCookie(_, data, context) {
					// get array of active experiment ids from cache
					// const activeExperiments = JSON.parse(_get(
					// 	context,
					// 	`cache.data.data['Setting:ui.active_experiments'].value` // eslint-disable-line
					// ));
					// console.log('------- Active Exps in cookie cleaner -------');
					// console.log(activeExperiments);

					// if (activeExperiments.length) {
					// 	const currentAssignments = parseExpCookie(cookieStore.get('uiab'));
					// 	console.log('current cookie assignments: ', currentAssignments);
					// 	const remainingAssignments = _filter(currentAssignments, (value, index) => {
					// 		return activeExperiments.indexOf(index) !== -1;
					// 	});
					// 	console.log('new cookie assignments: ', remainingAssignments);
					// 	// cookieStore.set('uiab', serializeExpCookie(remainingAssignments), { path: '/' });
					// }

					return true;
				}
			}
		}
	};
};
