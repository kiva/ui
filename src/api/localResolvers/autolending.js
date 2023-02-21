/* eslint-disable no-underscore-dangle */
import _get from 'lodash/get';
import logFormatter from '@/util/logFormatter';
import bothProfilesQuery from '@/graphql/query/autolending/bothProfiles.graphql';
import loanCountQuery from '@/graphql/query/loanCount.graphql';
import serverProfileQuery from '@/graphql/query/autolending/profileFromServer.graphql';
import updateServerProfile from '@/graphql/mutation/autolending/updateServerProfile.graphql';
import AutolendProfile, {
	getCacheableProfile,
	getInputProfile,
	profilesAreEqual,
} from '@/api/fixtures/AutolendProfile';
import LoanSearchCriteria, {
	criteriaAreEqual,
	getSearchableCriteria,
} from '@/api/fixtures/LoanSearchCriteria';

// Helper function for writing autolending data to the cache
function writeAutolendingData(cache, { currentProfile, savedProfile, ...fields }) {
	// Set base typename
	const autolending = {
		id: 0,
		__typename: 'Autolending',
		...fields,
	};
	// Set autolend profile typenames
	if (currentProfile) {
		autolending.currentProfile = getCacheableProfile(currentProfile);
	}
	if (savedProfile) {
		autolending.savedProfile = getCacheableProfile(savedProfile);
	}
	// Update autolending object in the cache
	const data = cache.readQuery({ query: bothProfilesQuery });
	cache.writeQuery({
		query: bothProfilesQuery,
		data: {
			autolending: {
				...data.autolending,
				...autolending
			}
		}
	});
}

let loanCountObservable;

// Return promise to fetch current loan count for the given autolend profile
function updateCurrentLoanCount({ cache, client, currentProfile }) {
	// Indicate fetching new loan count
	writeAutolendingData(cache, { countingLoans: true });

	// Get criteria input from current profile
	const { filters } = getSearchableCriteria(currentProfile.loanSearchCriteria);

	// Cancel the currently in-flight query
	if (loanCountObservable) loanCountObservable.unsubscribe();

	return new Promise(resolve => {
		// Query for total number of loans currently fundraising matching the profile's filters
		loanCountObservable = client.watchQuery({
			query: loanCountQuery,
			variables: { filters },
		}).subscribe({
			next(result) {
				// Parse the count from result
				const count = _get(result, 'data.lend.loans.totalCount') || 0;
				// Save the count in the cache
				writeAutolendingData(cache, {
					currentLoanCount: count,
					countingLoans: false,
				});
				resolve(count);
			},
			// Log any errors
			error(e) {
				logFormatter(e, 'error');
				writeAutolendingData(cache, { countingLoans: false });
				resolve(0);
			},
		});
	});
}

function convertEnableAfterToNewSetting(value) {
	switch (value) {
		case 0:// 'Whenever I have credit available'
			return 0;
		case 1:// 'If I don\'t log in for 1 Month'
			return 45;
		case 2:// 'If I don\'t log in for 2 Months'
			return 45;
		case 3:// 'If I don\'t log in for 3 Months';
			return 90;
		case 6:// 'If I don\'t log in for 6 Months';
		case 12:// 'If I don\'t log in for 1 Year'
		case 18:// 'If I don\'t log in for 1.5 Years'
			return 120;
		default:
			return 0;
	}
}

// Returns a profile with legacy filter values converted or removed
function convertLegacyProfile(profile) {
	const { loanSearchCriteria } = profile || {};
	const { filters } = loanSearchCriteria || {};
	const { riskRating, lenderTerm } = filters || {};

	// Convert legacy risk rating value to 0, 1, 2, 3, or 4
	const riskRatingMin = _get(riskRating, 'min') || 0;
	const boundedRiskRating = Math.max(0, Math.min(4, riskRatingMin));
	const integerRiskRating = Math.ceil(boundedRiskRating);
	const defaultRiskRating = riskRating ? {
		...riskRating,
		min: integerRiskRating,
	} : riskRating;

	// Convert legacy loan term value to 6, 12, 18, or 24
	let termMax = _get(lenderTerm, 'max');
	if (termMax >= 24) {
		termMax = 24;
	} else if (termMax >= 18) {
		termMax = 18;
	} else if (termMax >= 12) {
		termMax = 12;
	} else if (termMax >= 6) {
		termMax = 6;
	} else {
		termMax = null;
	}

	return {
		...profile,
		loanSearchCriteria: {
			...loanSearchCriteria,
			filters: {
				...filters,
				lenderTerm: {
					// Fix minimum loan term to be 0
					min: 0,
					max: termMax,
				},
				riskRating: defaultRiskRating
			},
			// Fix keyword to be null
			queryString: null,
		}
	};
}

// export resolvers and defaults for Autolending and AutolendingMutation

export default () => {
	return {
		defaults(cache) {
			cache.writeQuery({
				query: bothProfilesQuery,
				data: {
					autolending: {
						id: 0,
						__typename: 'Autolending',
						currentProfile: null,
						savedProfile: null,
						currentLoanCount: 0, // updates when search filters are changed
						profileChanged: false, // true when currentProfile is different than savedProfile
						loadingProfile: false, // true when first loading the profile from the server
						countingLoans: false, // true when loan count is updating
						savingProfile: false, // true when profile is being saved o the server
						warningThreshold: 25, // minimum loan count to avoid getting a warning message
					}
				}
			});
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

					return new Promise((resolve, reject) => {
						// Query for all the details of the server profile
						client.query({ query: serverProfileQuery, fetchPolicy: 'network-only' })
							.then(result => {
								if (result.errors) {
									// Throw the first error that is found
									// NOTE: this error only gets passed as a NetworkError and it's not
									// possible to pass more data than the a message, so currently this
									// uses the error's code as the message. One alternative would be switching
									// back to using apollo-link-state, which handles errors from client
									// resolvers as actual graphql errors. More discussion here
									// https://github.com/apollographql/apollo-client/issues/4575
									throw new Error(result.errors[0].extensions.code || result.errors[0].message);
								}
								return result;
							})
							// Return default profile/loan search criteria if none is defined on the server
							.then(result => {
								const profile = _get(result, 'data.my.autolendProfile') || AutolendProfile();
								return {
									...profile,
									loanSearchCriteria: profile.loanSearchCriteria || LoanSearchCriteria(),
								};
							})
							// Replace any legacy filter values
							.then(convertLegacyProfile)
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
							// Reject errors
							.catch(e => {
								writeAutolendingData(cache, { loadingProfile: false });
								reject(e);
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

					// Update legacy timing options if present
					if (profile.enableAfter > 0) {
						profile.lendAfterDaysIdle = convertEnableAfterToNewSetting(profile.enableAfter);
						profile.enableAfter = 0;
					}

					// always sync idleCreditOptIn with isEnabled
					profile.idleCreditOptIn = profile.isEnabled;

					return new Promise((resolve, reject) => {
						// Update the profile
						client.mutate({
							mutation: updateServerProfile,
							variables: { profile },
						})
							.then(result => {
								if (result.errors) {
									// Throw the first error that is found
									// NOTE: see note above in initAutolending about local state error handling
									throw new Error(result.errors[0].code || result.errors[0].message);
								}
								return result;
							})
							// Store returned profile as 'savedProfile'
							.then(result => _get(result, 'data.my.updateAutolendProfile'))
							.then(serverProfile => {
								if (serverProfile) {
									writeAutolendingData(cache, {
										currentProfile: {
											...serverProfile,
											id: 0,
										},
										profileChanged: false,
										savingProfile: false,
										savedProfile: {
											...serverProfile,
										},
									});
									resolve(true);
								} else {
									writeAutolendingData(cache, { savingProfile: false });
									resolve(false);
								}
							})
							// Reject errors
							.catch(e => {
								writeAutolendingData(cache, { savingProfile: false });
								reject(e);
							});
					});
				},
			},
			Mutation: {
				autolending() {
					// Return typename so apollo will use that type to resolve the fields
					return { id: 0, __typename: 'AutolendingMutation' };
				}
			}
		}
	};
};
