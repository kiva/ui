/**
 * Sets the user attributes for the hotjar API
 * @param userData {Object}
 */
export function setHotJarUserAttributes(userData) {
	if (typeof window === 'undefined') {
		return;
	}

	if (window.hj) {
		window.hj('identify', userData?.userId, {
			'Has ever logged in': userData?.hasEverLoggedIn ?? false,
			'Has lent before': userData?.hasLentBefore ?? false,
			'Has deposit before': userData?.hasDepositBefore ?? false,
		});

		if (userData?.isFirstLoan !== undefined) {
			window.hj('identify', userData?.userId, {
				'First loan': userData?.isFirstLoan ?? false,
				'Has direct loan': userData?.hasDirectLoan ?? false,
				'Has core loan': userData?.hasCoreLoan ?? false,
			});
		}
	}
}

/**
 * Fires an event to the hotjar API
 * @param eventName String
 */
export function fireHotJarEvent(eventName) {
	if (typeof window === 'undefined') {
		return;
	}
	if (window.hj) {
		window.hj('event', eventName);
	}
}

/**
 * Fires the `new_user` event when the visitor has never logged in.
 *
 * `hasEverLoggedIn === false` is our brand-new-visitor definition (not
 * currently logged in, no `kvu` cookie, no cached value). Firing an event —
 * rather than relying solely on the `Has ever logged in` attribute — gives
 * Hotjar a durable segment that survives even if the visitor logs in later
 * in the same recording session.
 * Only fires on a strict `false` — an unknown/undefined value means we
 * can't confirm a new user, so we stay silent rather than mis-tag them.
 * @param hasEverLoggedIn Boolean
 */
export function fireNewUserHotJarEvent(hasEverLoggedIn) {
	if (hasEverLoggedIn === false) {
		fireHotJarEvent('new_user');
	}
}
