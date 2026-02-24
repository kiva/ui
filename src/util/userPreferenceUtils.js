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
 * Upserts a My Kiva goal using the setMyKivaGoal mutation
 *
 * @param apollo The current Apollo client
 * @param {Object} goalData The goal data to upsert
 * @param {string} goalData.category The goal category
 * @param {number} goalData.target The target number of loans
 * @param {string} goalData.dateStarted The date the goal was started (ISO-8601)
 * @param {string} goalData.status The goal status
 * @returns The result of the mutation
 */
export const upsertMyKivaGoal = async (apollo, {
	category, target, dateStarted, status
}) => {
	try {
		return await apollo.mutate({
			mutation: setMyKivaGoalMutation,
			variables: {
				category,
				target,
				dateStarted,
				status,
			},
		});
	} catch (e) {
		logReadQueryError(e, 'userPreferenceUtils setMyKivaGoalMutation');
	}
};
