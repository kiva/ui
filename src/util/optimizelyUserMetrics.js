function setUserAttribute(key, value) {
	if (typeof window === 'undefined') {
		return;
	}

	window.optimizely = window.optimizely || [];
	window.optimizely.push({
		type: 'user',
		attributes: {
			[key]: value,
		},
	});
}

/**
 * Checks if user has visted kiva before on the.
 * @param {Boolean} hasEverLoggedIn
 */
export function userHasEverLoggedInBefore(hasEverLoggedIn) {
	setUserAttribute('has_ever_logged_in_before', hasEverLoggedIn);
}

/**
 * Checks if user has visted kiva before.
 * @param {Boolean} hasLentBefore
 */
export function userHasLentBefore(hasLentBefore) {
	setUserAttribute('has_lent_before', hasLentBefore);
}

/**
 * Checks if user has deposited into their kiva account before.
 * @param {Boolean} hasDepositedBefore
 */
export function userHasDepositBefore(hasDepositedBefore) {
	setUserAttribute('has_deposited_before', hasDepositedBefore);
}
