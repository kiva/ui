/* eslint-disable no-underscore-dangle */
import _get from 'lodash/get';
import bothProfilesQuery from '@/graphql/query/autolending/bothProfiles.graphql';
import loanCountQuery from '@/graphql/query/loanCount.graphql';
import serverProfileQuery from '@/graphql/query/autolending/profileFromServer.graphql';
import updateServerProfile from '@/graphql/mutation/autolending/updateServerProfile.graphql';
import AutolendProfile, {
	getCacheableProfile,
	getInputProfile,
	profilesAreEqual,
} from '@/api/fixtures/AutolendProfile';
import { criteriaAreEqual, getInputCriteria } from '@/api/fixtures/LoanSearchCriteria';

// Helper function for writing autolending data to the cache
function writeAutolendingData(cache, { currentProfile, savedProfile, ...data }) {
	// Set base typename
	const autolending = {
		__typename: 'Autolending',
		...data,
	};
	// Set autolend profile typenames
	if (currentProfile) {
		autolending.currentProfile = getCacheableProfile(currentProfile);
	}
	if (savedProfile) {
		autolending.savedProfile = getCacheableProfile(savedProfile);
	}
	// Write autolending object to cache
	cache.writeData({ data: { autolending } });
}

// Return promise to fetch current loan count for the given autolend profile
function updateCurrentLoanCount({ cache, client, currentProfile }) {
	// Indicate fetching new loan count
	writeAutolendingData(cache, { countingLoans: true });

	// Get criteria input from current profile
	const { filters, queryString } = getInputCriteria(currentProfile.loanSearchCriteria);

	return new Promise(resolve => {
		// Query for total number of loans currently fundraising matching the profile's filters
		client.query({
			query: loanCountQuery,
			variables: { filters, queryString },
		})
			// Parse the count from result
			.then(result => _get(result, 'data.lend.loans.totalCount') || 0)
			// Save the count in the cache
			.then(count => {
				writeAutolendingData(cache, {
					currentLoanCount: count,
					countingLoans: false,
				});
				resolve(count);
			})
			// Log any errors
			.catch(e => {
				console.error(e);
				writeAutolendingData(cache, { countingLoans: false });
				resolve(0);
			});
	});
}

// export resolvers and defaults for Autolending and AutolendingMutation
export default () => {
	return {
		defaults: {
			autolending: {
				__typename: 'Autolending',
				currentLoanCount: 0, // updates when search filters are changed
				profileChanged: false, // true when the current profile is different than the profile on the server
				loadingProfile: false, // true when first loading the profile from the server
				countingLoans: false, // true when loan count is updating
				savingProfile: false, // true when profile is being saved o the server
				warningThreshold: 25, // minimum loan count to avoid getting a warning message
			},
		},
		resolvers: {
			AutolendingMutation: {
				/**
				 * Fetches autolend profile information and sets up local autolending state
				 *
				 * @resolve Boolean success/failure
				 */
				initAutolending(obj, args, { cache, client }) {
					// Indicate loading profile info from server
					writeAutolendingData(cache, { loadingProfile: true });

					return new Promise(resolve => {
						// Query for all the details of the server profile
						client.query({ query: serverProfileQuery })
							// Return default profile if non is defined on the server
							.then(result => _get(result, 'data.my.autolendProfile') || AutolendProfile())
							// Write the fetched profile to the cache as both the current and saved profiles
							.then(profile => {
								writeAutolendingData(cache, {
									currentProfile: {
										...profile,
										id: 0,
									},
									savedProfile: {
										...profile,
									},
									loadingProfile: false,
								});
								return profile;
							})
							// Finish by fetching the loan count for the current profile
							.then(currentProfile => updateCurrentLoanCount({ cache, client, currentProfile }))
							.then(() => resolve(true))
							// Log any errors
							.catch(e => {
								console.error(e);
								writeAutolendingData(cache, { loadingProfile: false });
								resolve(false);
							});
					});
				},

				/**
				 * Edits the local autolend profile and updates the current loan count
				 *
				 * @arg $profile AutolendProfileUpdateInput
				 * @resolve Boolean success/failure
				 */
				editProfile(obj, { profile }, { cache, client }) {
					// Read current profile information to compare with the changes being made
					const profileData = cache.readQuery({ query: bothProfilesQuery });
					const profileBeforeChange = _get(profileData, 'autolending.currentProfile');

					// Write profile argument to cache to update current profile
					writeAutolendingData(cache, {
						currentProfile: {
							...profile,
							id: 0,
						},
					});

					// Fetch profile information post-update
					const currentProfileData = cache.readQuery({ query: bothProfilesQuery });
					const currentProfile = _get(currentProfileData, 'autolending.currentProfile');
					const savedProfile = _get(currentProfileData, 'autolending.savedProfile');

					// Compare current and saved profile, and note the difference
					writeAutolendingData(cache, {
						profileChanged: !profilesAreEqual(currentProfile, savedProfile),
					});

					// If the search filters haven't changed, return immediately instead of getting a new loan count
					if (criteriaAreEqual(profileBeforeChange.loanSearchCriteria, currentProfile.loanSearchCriteria)) {
						return true;
					}

					// Otherwise fetch the new loan count
					return updateCurrentLoanCount({ cache, client, currentProfile })
						.then(() => true);
				},

				/**
				 * Save profile changes to the server
				 *
				 * @resolve Boolean success/failure
				 */
				saveProfile(obj, args, { cache, client }) {
					// Indicate saving profile info to server
					writeAutolendingData(cache, { savingProfile: true });

					// Get profile info to send
					const profileData = cache.readQuery({ query: bothProfilesQuery });
					const profile = getInputProfile(_get(profileData, 'autolending.currentProfile'));

					return new Promise(resolve => {
						// Update the profile
						client.mutate({
							mutation: updateServerProfile,
							variables: { profile },
						})
							// Store returned profile as 'savedProfile'
							.then(result => _get(result, 'data.my.updateAutolendProfile'))
							.then(serverProfile => {
								if (serverProfile) {
									writeAutolendingData(cache, {
										profileChanged: false,
										savingProfile: false,
										savedProfile: serverProfile,
									});
									resolve(true);
								} else {
									writeAutolendingData(cache, { savingProfile: false });
									resolve(false);
								}
							})
							// Log any errors
							.catch(e => {
								console.error(e);
								writeAutolendingData(cache, { savingProfile: false });
								resolve(false);
							});
					});
				},
			},
			Mutation: {
				autolending() {
					// Return typename so apollo will use that type to resolve the fields
					return { __typename: 'AutolendingMutation' };
				}
			}
		}
	};
};
