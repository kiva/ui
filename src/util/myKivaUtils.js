import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import { differenceInMinutes, fromUnixTime } from 'date-fns';
import { gql } from 'graphql-tag';
import logFormatter from '#src/util/logFormatter';

export const MY_KIVA_PREFERENCE_KEY = 'myKivaJan2025Exp';
const MY_KIVA_EXP = 'my_kiva_jan_2025';
const MY_KIVA_LOAN_LIMIT = 4;
const FIRST_LOGIN_THRESHOLD = 5;

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
 * Gets whether the MyKiva experience is enabled for the user, excluding some specific logic for the TY page
 *
 * @param apollo The current Apollo client
 * @param $kvTrackEvent The Kiva tracking event function
 * @param userPreferences The user preferences object
 * @param loanTotal The total number of loans the user has made
 * @returns Whether the MyKiva experience is enabled for the user
 */
export const getIsMyKivaEnabled = (apollo, $kvTrackEvent, userPreferences, loanTotal) => {
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

	if (hasSeenMyKiva || loanTotal < MY_KIVA_LOAN_LIMIT) {
		const { version: myKivaVersion } = apollo.readFragment({
			id: `Experiment:${MY_KIVA_EXP}`,
			fragment: experimentVersionFragment,
		}) ?? {};
		const isMyKivaExperimentEnabled = myKivaVersion === 'b';

		trackExperimentVersion(
			apollo,
			$kvTrackEvent,
			'event-tracking',
			MY_KIVA_EXP,
			'EXP-MP-1235-Jan2025'
		);

		// Ensure that the user continues to see MyKiva after passing the loan limit
		// Only update the user preferences if running client-side
		if (isMyKivaExperimentEnabled && !hasSeenMyKiva && typeof window !== 'undefined') {
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

/*
 * Determines whether is first login for the user
 *
 * @param lastLogin last login time from token access
 * @param memberSince member since time from user data
 * @returns Whether the user is logging in for the first time
 */
export const isFirstLogin = (lastLogin, memberSince) => {
	const lastLoginDate = fromUnixTime(lastLogin);
	lastLoginDate.setHours(lastLoginDate.getHours() - 1);

	const minutesDiff = differenceInMinutes(
		lastLoginDate,
		new Date(memberSince),
	);

	return minutesDiff < FIRST_LOGIN_THRESHOLD;
};
