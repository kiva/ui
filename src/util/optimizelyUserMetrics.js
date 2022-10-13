import numeral from 'numeral';
import thanksPageQuery from '@/graphql/query/thanksPage.graphql';
import logReadQueryError from '@/util/logReadQueryError';

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

export function buildUserDataGlobal(router, cookieStore, apolloClient) {
	let data = null;
	const transactionId = router.currentRoute.query?.kiva_transaction_id
		? numeral(router.currentRoute.query?.kiva_transaction_id).value()
		: null;
	try {
		data = transactionId ? apolloClient.readQuery({
			query: thanksPageQuery,
			variables: {
				checkoutId: transactionId,
				visitorId: cookieStore.get('uiv') || null,
			}
		}) : {};
	} catch (e) {
		logReadQueryError(e, `Thanks page on server-entry failed: (transaction_id: ${transactionId})`);
	}

	const loans = data?.shop?.receipt?.items?.values
		.filter(item => item.basketItemType === 'loan_reservation')
		.map(item => item.loan) ?? [];

	return {
		viewer: {
			userId: data?.my?.userAccount?.id,
			displayName: `${data?.my?.userAccount?.firstName} ${data?.my?.userAccount?.lastName}`,
			publicProfile: data?.my?.userAccount?.public
		},
		loans
	};
}
