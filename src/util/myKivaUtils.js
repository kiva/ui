import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import { readBoolSetting } from '#src/util/settingsUtils';
import { differenceInMinutes, fromUnixTime } from 'date-fns';

const MY_KIVA_EXP = 'my_kiva_jan_2025';
const MY_KIVA_LOAN_LIMIT = 4;
const FIRST_LOGIN_THRESHOLD = 5;

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
 * Gets whether the MyKiva experience is enabled for the user, excluding some specific logic for the TY page
 *
 * @param apollo The current Apollo client
 * @param $kvTrackEvent The Kiva tracking event function
 * @param preferences The user preferences object
 * @param loanTotal The total number of loans the user has made
 * @returns Whether the MyKiva experience is enabled for the user
 */
export const getIsMyKivaEnabled = (apollo, $kvTrackEvent, preferences, loanTotal) => {
	const formattedPreference = typeof preferences === 'string' ? JSON.parse(preferences) : preferences;
	const hasSeenMyKiva = !!(formattedPreference?.myKivaJan2025Exp ?? 0);

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
