import { gql } from 'graphql-tag';

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
		} catch (error) {
			throw new Error(error);
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
		} catch (error) {
			throw new Error(error);
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
		} catch (error) {
			throw new Error(error);
		}
	};

	return {
		createUserPreferences,
		updateUserPreferences,
		saveUserPreferences,
	};
}
