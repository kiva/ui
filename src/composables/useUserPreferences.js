import { gql } from 'graphql-tag';
import logReadQueryError from '#src/util/logReadQueryError';

export default function useUserPreferences(apollo) {
	const createUserPreferences = () => {
		try {
			const createUserPreferencesMutation = gql`
				mutation createUserPreferences($preferences: String) {
					my {
						createUserPreferences(userPreferences: {preferences: $preferences}) {
							id
							preferences
						}
					}
				}
			`;

			return apollo.mutate({
				mutation: createUserPreferencesMutation,
				variables: {
					preferences: '',
				},
			});
		} catch (e) {
			logReadQueryError(e, 'useUserPreferences createUserPreferences');
		}
	};

	const updateUserPreferences = async ({ userPreferences, newPreference }) => {
		try {
			const preferences = JSON.stringify({ ...userPreferences.preferences, ...newPreference });

			const updateUserPreferencesMutation = gql`
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
			}`;

			return apollo.mutate({
				mutation: updateUserPreferencesMutation,
				variables: {
					updateUserPreferencesId: userPreferences.id,
					preferences,
				},
			});
		} catch (e) {
			logReadQueryError(e, 'useUserPreferences updateUserPreferences');
		}
	};

	const saveUserPreferences = async ({ userPreferences, newPreference }) => {
		try {
			let currentPreferences = userPreferences;
			if (!userPreferences?.id) {
				const createPreferences = await createUserPreferences();
				currentPreferences = createPreferences?.data?.my?.createUserPreferences ?? {};
			}

			const response = await updateUserPreferences({ userPreferences: currentPreferences, newPreference });

			return response;
		} catch (e) {
			logReadQueryError(e, 'useUserPreferences saveUserPreferences');
		}
	};

	return {
		createUserPreferences,
		updateUserPreferences,
		saveUserPreferences,
	};
}
