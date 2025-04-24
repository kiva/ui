import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import { gql } from 'graphql-tag';
import logFormatter from '#src/util/logFormatter';
import { readBoolSetting } from '#src/util/settingsUtils';

export const MY_KIVA_PREFERENCE_KEY = 'myKivaJan2025Exp';
const MY_KIVA_EXP = 'my_kiva_jan_2025';
const MY_KIVA_LOAN_LIMIT = 4;
export const MY_KIVA_FOR_ALL_USERS_KEY = 'general.my_kiva_all_users.value';
export const GUEST_ASSIGNMENT_COOKIE = 'myKivaGuestAssignment';

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
 * Determines whether the provided loan needs a footnote
 *
 * @param loan The loan to check
 * @returns Whether the loan needs a footnote
 */
export const hasLoanFunFactFootnote = loan => {
	const region = loan?.geocode?.country?.region ?? '';
	const country = loan?.geocode?.country?.name ?? '';
	if (region === 'North America' && country === 'United States') {
		return true;
	}
	switch (region) {
		case 'Central America':
		case 'Africa':
		case 'Asia':
			return true;
		default:
			return false;
	}
};

/**
 * Fetches the post-checkout achievements for the provided loan IDs
 *
 * @param apollo The current Apollo client
 * @param loanIds The loan IDs to fetch achievements for
 */
export const fetchPostCheckoutAchievements = async (apollo, loanIds) => {
	try {
		await apollo.query({
			query: postCheckoutAchievementsQuery,
			variables: { loanIds },
		});
	} catch (e) {
		logReadQueryError(e, 'myKivaUtils postCheckoutAchievementsQuery');
	}
};

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
		logReadQueryError(e, 'myKivaUtils createUserPreferencesMutation');
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
		const preferences = JSON.stringify({ ...parsedPreferences, ...newPreferences });

		return await apollo.mutate({
			mutation: updateUserPreferencesMutation,
			variables: {
				updateUserPreferencesId: userPreferences.id,
				preferences,
			},
		});
	} catch (e) {
		logReadQueryError(e, 'myKivaUtils updateUserPreferencesMutation');
	}
};

/**
 * Set session cookie for guest MyKiva assignment to ensure consistent assignment after login
 *
 * @param cookieStore The cookie store
 * @param myKivaEnabled Whether the MyKiva experience is enabled
 * @param isGuest Whether the user is a guest
 */
export const setGuestAssignmentCookie = (cookieStore, myKivaEnabled, isGuest) => {
	// Only add the session cookie if the user is a guest and MyKiva is enabled
	if (isGuest && myKivaEnabled) {
		cookieStore?.set(GUEST_ASSIGNMENT_COOKIE, 'true', { path: '/' });
	}
};

/**
 * Checks for existence of session cookie for guest MyKiva assignment
 *
 * @param cookieStore The cookie store
 * @returns Whether the guest assignment cookie exists
 */
export const checkGuestAssignmentCookie = cookieStore => {
	return !!cookieStore?.get(GUEST_ASSIGNMENT_COOKIE);
};

/**
 * Gets whether the MyKiva experience is enabled for the user, excluding some specific logic for the TY page
 *
 * @param apollo The current Apollo client
 * @param $kvTrackEvent The Kiva tracking event function
 * @param userPreferences The user preferences object
 * @param loanTotal The total number of loans the user has made
 * @param myKivaFlagEnabled Whether the MyKiva flag is enabled
 * @param cookieStore The cookie store
 * @returns Whether the MyKiva experience is enabled for the user
 */
export const getIsMyKivaEnabled = (
	apollo,
	$kvTrackEvent,
	userPreferences,
	loanTotal,
	myKivaFlagEnabled,
	cookieStore,
) => {
	// Parse the user preferences to determine if the user has seen MyKiva
	let parsedPreferences = {};
	let hasSeenMyKiva = false;
	try {
		const preferences = userPreferences?.preferences ?? '';
		parsedPreferences = preferences ? JSON.parse(preferences) : {};
		hasSeenMyKiva = !!(parsedPreferences?.[MY_KIVA_PREFERENCE_KEY] ?? false);
	} catch (e) {
		logFormatter('getIsMyKivaEnabled JSON parsing exception', 'error');
	}

	// eslint-disable-next-line max-len
	if (hasSeenMyKiva || loanTotal < MY_KIVA_LOAN_LIMIT || myKivaFlagEnabled || checkGuestAssignmentCookie(cookieStore)) {
		const { version: myKivaVersion } = apollo.readFragment({
			id: `Experiment:${MY_KIVA_EXP}`,
			fragment: experimentVersionFragment,
		}) ?? {};
		const isMyKivaExperimentEnabled = myKivaVersion === 'b';

		if ($kvTrackEvent) {
			trackExperimentVersion(
				apollo,
				$kvTrackEvent,
				'event-tracking',
				MY_KIVA_EXP,
				'EXP-MP-1235-Jan2025'
			);
		}

		// Ensure that the user continues to see MyKiva after passing the loan limit
		// eslint-disable-next-line max-len
		// Only update the user preferences if running client-side and defined instead that guests users have undefined userPreferences.
		if (isMyKivaExperimentEnabled
			&& !hasSeenMyKiva
			&& typeof window !== 'undefined'
			&& typeof userPreferences !== 'undefined'
		) {
			const newPreferences = { [MY_KIVA_PREFERENCE_KEY]: 1 };

			if (userPreferences === null) {
				// Handle the case where the user has no previous preferences
				createUserPreferences(apollo, newPreferences);
			} else {
				updateUserPreferences(apollo, userPreferences, parsedPreferences, newPreferences);
			}
		}

		// The user preference hasSeenMyKiva can be true when we override for internal testing
		return hasSeenMyKiva || isMyKivaExperimentEnabled;
	}

	return false;
};

/**
 * Handles the redirect logic for the MyKiva home page
 *
 * @param client The Apollo client
 * @param args The arguments containing cookieStore and route
 * @param data The data containing user information
 * @return Whether the MyKiva route should be rejected
 */
export const shouldRejectMyKivaHomeRedirect = (client, args, data) => {
	const { cookieStore, route } = args;
	const currentRoute = route?.value ?? route ?? {};

	if (currentRoute.path === '/mykiva') {
		const userData = data?.my ?? {};
		const myKivaAllUsersEnabled = readBoolSetting(data, 'general.my_kiva_all_users.value');

		return !getIsMyKivaEnabled(
			client,
			undefined, // Passing undefined ensures no experiment tracking for users not qualified
			userData?.userPreferences,
			userData.lender?.loanCount,
			myKivaAllUsersEnabled,
			cookieStore,
		);
	}

	return false;
};
