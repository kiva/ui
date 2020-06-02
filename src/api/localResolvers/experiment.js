import _isUndefined from 'lodash/isUndefined';
import _pick from 'lodash/pick';
import _get from 'lodash/get';
import cookieStore from '@/util/cookieStore';
import { parseExpCookie, serializeExpCookie, assignVersion } from '@/util/experimentUtils';
import { readJSONSetting, hashCode } from '@/util/settingsUtils';

/**
 * Experiment resolvers
 */
export default () => {
	// initialize the assignments from the experiment cookie
	const assignments = parseExpCookie(cookieStore.get('uiab'));

	return {
		resolvers: {
			Query: {
				experiment(_, { id }, context) {
					// get the existing assigned version for this experiment id
					let currentAssignment = assignments[id] || {};

					// read the experiment data from the cache
					const experiment = readJSONSetting(context, `cache.data.data['Setting:uiexp.${id}'].value`);
					// create targeted subset of experiment setting to use in hash
					// Changing the Name, Distribution, Variants or Control values will "reset" an experiment assignment
					const experimentSubset = _pick(experiment, ['name', 'distribution', 'variants', 'control']);
					// get the hash for our current experiment setting
					const settingHash = hashCode(JSON.stringify(experimentSubset));
					const population = _get(experiment, 'population') || 1;

					// Add hash to exisitng cookie exps if it's missing
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
							_isUndefined(currentAssignment.version)
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
							version: assignVersion(experiment),
							hash: settingHash,
							population,
						};

						// only update assignments and set cookie if the version is set
						if (!_isUndefined(currentAssignment.version) && experiment.enabled) {
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
						version: (experiment === null || !experiment.enabled) ? null : currentAssignment.version,
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
						version: _isUndefined(version) ? null : version,
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
