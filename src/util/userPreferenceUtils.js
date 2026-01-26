import { gql } from 'graphql-tag';
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
export const createUserPreferences = async (apollo, newPreferences, refetchQueries = null) => {
	try {
		return await apollo.mutate({
			mutation: createUserPreferencesMutation,
			variables: { preferences: JSON.stringify(newPreferences) },
			refetchQueries: refetchQueries || [],
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
 * @param refetchQueries Optional queries to refetch after mutation
 * @returns The updated user preferences
 */
export const updateUserPreferences = async (
	apollo,
	userPreferences,
	parsedPreferences,
	newPreferences,
	refetchQueries = null
) => {
	try {
		const mergedPreferences = { ...parsedPreferences, ...newPreferences };
		const preferences = JSON.stringify(mergedPreferences);
		return await apollo.mutate({
			mutation: updateUserPreferencesMutation,
			variables: {
				updateUserPreferencesId: userPreferences.id,
				preferences,
			},
			refetchQueries: refetchQueries || [],
		});
	} catch (e) {
		logReadQueryError(e, 'userPreferenceUtils updateUserPreferencesMutation');
	}
};
