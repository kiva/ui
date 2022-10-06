/**
 * Sets the user attributes for the hotjar API
 * @param userData {Object}
 */
export default function setHotJarUserAttributes(userData) {
	if (typeof window === 'undefined') {
		return;
	}

	if (window.hj) {
		window.hj('identify', userData.userId, {
			has_ever_logged_in: userData.hasEverLoggedIn,
			has_lent_before: userData.hasLentBefore,
			has_deposit_before: userData.hasDepositBefore,
		});
	}
}
