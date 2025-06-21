import { gql } from 'graphql-tag';
import numeral from 'numeral';
import thanksPageQuery from '#src/graphql/query/thanksPage.graphql';
import logReadQueryError from '#src/util/logReadQueryError';

export const hasLentBeforeCookie = 'kvu_lb';
export const hasDepositBeforeCookie = 'kvu_db';

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
 * Checks if user is checking out with a US Direct Loan.
 * @param {Boolean} hasUsLoan
 */
export function userUsLoanCheckout(hasUsLoan) {
	setUserAttribute('us_loan_checkout', hasUsLoan ? 'yes' : 'no');
}

/**
 * Checks if user has visted kiva before on the.
 * @param {Boolean} hasEverLoggedIn
 */
export function userHasEverLoggedInBefore(hasEverLoggedIn) {
	setUserAttribute('has_ever_logged_in_before', hasEverLoggedIn ? 'yes' : 'no');
}

/**
 * Checks if user has visted kiva before.
 * @param {Boolean} hasLentBefore
 */
export function userHasLentBefore(hasLentBefore) {
	setUserAttribute('has_lent_before', hasLentBefore ? 'yes' : 'no');
}

/**
 * Checks if user has deposited into their kiva account before.
 * @param {Boolean} hasDepositedBefore
 */
export function userHasDepositBefore(hasDepositedBefore) {
	setUserAttribute('has_deposited_before', hasDepositedBefore ? 'yes' : 'no');
}

export const optimizelyUserDataQuery = gql`query optimizelyUserDataQuery {
	my {
		id
		loans(limit:1) {
				totalCount
		}
		transactions(limit:1, filter:{category:deposit}) {
				totalCount
		}
	}
}`;

export async function setUserDataCookies(cookieStore, apolloClient) {
	if (!cookieStore.get(hasLentBeforeCookie) || !cookieStore.get(hasDepositBeforeCookie)) {
		const { data } = await apolloClient.query({
			query: optimizelyUserDataQuery,
		});

		const hasLentBefore = data?.my?.loans?.totalCount > 0;
		const hasDepositBefore = data?.my?.transactions?.totalCount > 0;

		cookieStore.set(hasLentBeforeCookie, hasLentBefore, { path: '/' });
		cookieStore.set(hasDepositBeforeCookie, hasDepositBefore, { path: '/' });
	}
}

export function buildUserDataGlobal(currentRoute, cookieStore, apolloClient) {
	const transactionId = currentRoute.query?.kiva_transaction_id
		? numeral(currentRoute.query?.kiva_transaction_id).value()
		: null;

	if (!transactionId) {
		return null;
	}

	let data = null;
	try {
		data = apolloClient.readQuery({
			query: thanksPageQuery,
			variables: {
				checkoutId: transactionId,
				visitorId: cookieStore.get('uiv') || null,
			}
		});
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
