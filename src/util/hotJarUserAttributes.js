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
			'Has ever logged in': userData.hasEverLoggedIn,
			'Has lent before': userData.hasLentBefore,
			'Has deposit before': userData.hasDepositBefore,
		});

		if (userData?.isFirstLoan) {
			window.hj('identify', userData.userId, {
				'First loan': userData?.isFirstLoan,
				'Has direct loan': userData?.hasDirectLoan,
				'Has core loan': userData?.hasCoreLoan,
			});
		}
	}
}
