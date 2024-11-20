import { differenceInMinutes, fromUnixTime } from 'date-fns';

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
