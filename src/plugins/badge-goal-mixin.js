import { gql } from 'graphql-tag';
import checkInjections from '#src/util/injectionCheck';

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
		storeGoal({ userPreferences, badgeName }) {
			checkInjections(this, injections);

			try {
				const currentPreferences = JSON.parse(userPreferences?.preferences) ?? {};
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

				return this.apollo.mutate({
					mutation: updateUserPreferencesMutation,
					variables: {
						updateUserPreferencesId: userPreferences.id,
						preferences,
					},
				});
			} catch (error) {
				throw new Error(error);
			}
		}
	}
};
