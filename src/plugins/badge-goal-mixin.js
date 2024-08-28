import { gql } from '@apollo/client';
import checkInjections from '@/util/injectionCheck';

const injections = ['cookieStore', 'apollo'];

export default {
	methods: {
		createUserPreferences() {
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

			return this.apollo.mutate({
				mutation: createUserPreferencesMutation,
				variables: {
					preferences: '',
				},
			});
		},
		async storeGoal({ userPreferences, badgeName }) {
			checkInjections(this, injections);

			try {
				const currentPreferences = userPreferences?.preferences ?? {};
				const preferences = JSON.stringify({ ...currentPreferences, goal: badgeName });

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

				const updateUserPreferences = this.apollo.mutate({
					mutation: updateUserPreferencesMutation,
					variables: {
						updateUserPreferencesId: userPreferences.id,
						preferences,
					},
				});

				return updateUserPreferences;
			} catch (error) {
				throw new Error(error);
			}
		}
	}
};
