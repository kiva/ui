import _omit from 'lodash/omit';
import LoanSearchCriteria, { criteriaAreEqual, getInputCriteria } from './LoanSearchCriteria';

// Return an AutolendProfile object with default values
export default function AutolendProfile() {
	return {
		__typename: 'AutolendProfile',
		id: null,
		isEnabled: false,
		donationPercentage: 15,
		enableAfter: 0,
		loanSearchCriteria: LoanSearchCriteria(),
	};
}

// Return a cleaned profile suitable for input
export function getInputProfile(profile) {
	const cleanProfile = _omit(profile, [
		'id',
		'__typename',
		'loanSearchCriteria'
	]);
	return {
		...cleanProfile,
		loanSearchCriteria: getInputCriteria(profile.loanSearchCriteria),
	};
}

// Return true if the two given autolend profiles have the same settings
export function profilesAreEqual(a, b) {
	if (!a || !b) return false;
	if (a.isEnabled !== b.isEnabled) return false;
	if (a.enableAfter !== b.enableAfter) return false;
	if (a.donationPercentage !== b.donationPercentage) return false;
	if (!criteriaAreEqual(a.loanSearchCriteria, b.loanSearchCriteria)) return false;
	return true;
}
