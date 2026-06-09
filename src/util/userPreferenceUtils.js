import { gql } from 'graphql-tag';
import setMyKivaGoalMutation from '#src/graphql/mutation/accountSettings/setMyKivaGoal.graphql';
import logReadQueryError from './logReadQueryError';

export const createUserPreferencesMutation = gql`
	mutation createUserPreferences($preferences: String) {
		my {
			createUserPreferences(userPreferences: { preferences: $preferences }) {
				id
				preferences
			}
		}
	}
`;

export const updateUserPreferencesMutation = gql`
	mutation UpdateUserPreferences(
		$updateUserPreferencesId: Int!,
		$preferences: String
	) {
		my {
			updateUserPreferences(id: $updateUserPreferencesId, userPreferences: {
				preferences: $preferences
		}) {
				id
				preferences
			}
		}
	}
`;

/**
 * Creates user preferences for the current user
 *
 * @param apollo The current Apollo client
 * @param newPreferences The new preferences to add
 * @returns The results of the mutation
 */
export const createUserPreferences = async (apollo, newPreferences) => {
	try {
		return await apollo.mutate({
			mutation: createUserPreferencesMutation,
			variables: { preferences: JSON.stringify(newPreferences) },
		});
	} catch (e) {
		logReadQueryError(e, 'userPreferenceUtils createUserPreferencesMutation');
	}
};

/**
 * Updates the user preferences for the current user
 *
 * @param apollo The current Apollo client
 * @param userPreferences The original user preferences
 * @param parsedPreferences The parsed user preferences
 * @param newPreferences The new preferences to add
 * @returns The updated user preferences
 */
export const updateUserPreferences = async (apollo, userPreferences, parsedPreferences, newPreferences) => {
	try {
		const mergedPreferences = { ...parsedPreferences, ...newPreferences };
		const preferences = JSON.stringify(mergedPreferences);
		return await apollo.mutate({
			mutation: updateUserPreferencesMutation,
			variables: {
				updateUserPreferencesId: userPreferences.id,
				preferences,
			},
		});
	} catch (e) {
		logReadQueryError(e, 'userPreferenceUtils updateUserPreferencesMutation');
	}
};

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
 * Upsert a single preference key for the current user: merge-update when a
 * record exists, otherwise create one.
 *
 * @param {object} apollo The current Apollo client
 * @param {{id?: number, preferences?: string}|null} userPreferences
 * @param {string} key
 * @param {*} value
 * @returns The result of the underlying create/update mutation
 */
export const setUserPreference = async (apollo, userPreferences, key, value) => {
	if (userPreferences?.id) {
		let parsed = {};
		try {
			parsed = JSON.parse(userPreferences.preferences || '{}');
		} catch {
			parsed = {};
		}
		return updateUserPreferences(apollo, userPreferences, parsed, { [key]: value });
	}
	return createUserPreferences(apollo, { [key]: value });
};

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
