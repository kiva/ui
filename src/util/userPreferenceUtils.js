import setMyKivaGoalMutation from '#src/graphql/mutation/accountSettings/setMyKivaGoal.graphql';
import setUserPreferenceMutation from '#src/graphql/mutation/accountSettings/setUserPreference.graphql';
import logReadQueryError from './logReadQueryError';

/**
 * Read a single key out of a userPreferences node's JSON `preferences` blob.
 *
 * @param {{preferences?: string}|null} userPreferences
 * @param {string} key
 * @returns {*} the stored value, or null when absent/unparseable.
 */
export const getUserPreference = (userPreferences, key) => {
	if (!userPreferences?.preferences) return null;
	try {
		return JSON.parse(userPreferences.preferences)[key] ?? null;
	} catch {
		return null;
	}
};

/**
 * Set one preference key. The server merges it and creates the row when missing.
 *
 * @param {object} apollo The current Apollo client
 * @param {string} key
 * @param {*} value Any JSON-serializable value
 * @returns The result of the mutation
 */
export const setUserPreference = async (apollo, key, value) => {
	try {
		return await apollo.mutate({
			mutation: setUserPreferenceMutation,
			variables: { key, value: JSON.stringify(value) },
		});
	} catch (e) {
		logReadQueryError(e, 'userPreferenceUtils setUserPreferenceMutation');
	}
};

/**
 * Set several preference keys one at a time, so the server-side writes cannot race.
 *
 * @param {object} apollo The current Apollo client
 * @param {object} preferences The keys to set and their values
 * @returns The result of the last mutation
 */
export const setUserPreferenceKeys = (apollo, preferences) => Object.entries(preferences).reduce(
	(chain, [key, value]) => chain.then(() => setUserPreference(apollo, key, value)),
	Promise.resolve(),
);

/**
 * Set a My Kiva goal using the setMyKivaGoal mutation
 *
 * @param apollo The current Apollo client
 * @param {Object} goalData The goal data to upsert
 * @param {string} goalData.category The goal category
 * @param {number} goalData.target The target number of loans
 * @param {string} goalData.dateStarted The date the goal was started (ISO-8601)
 * @param {string} goalData.status The goal status
 * @returns The result of the mutation
 */
export const setMyKivaGoal = async (apollo, {
	category, target, dateStarted, status
}) => {
	return apollo.mutate({
		mutation: setMyKivaGoalMutation,
		variables: {
			category,
			target,
			dateStarted,
			status,
		},
	});
};
