import { gql } from 'graphql-tag';
import numeral from 'numeral';
import {
	HAS_LENT_BEFORE_COOKIE,
	HAS_DEPOSIT_BEFORE_COOKIE,
	recordTransactorSignals as recordSignals,
} from '@kiva/kv-analytics';
import thanksPageQuery from '#src/graphql/query/thanksPage.graphql';
import logReadQueryError from '#src/util/logReadQueryError';

const hasLentBeforeCookie = HAS_LENT_BEFORE_COOKIE;
const hasDepositBeforeCookie = HAS_DEPOSIT_BEFORE_COOKIE;

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

/**
 * Seeds the lifetime transactor cookies from the user's loan/deposit totals.
 */
export async function setUserDataCookies(cookieStore, apolloClient) {
	if (!cookieStore.get('kvu')) {
		return;
	}

	if (!cookieStore.get(hasLentBeforeCookie) || !cookieStore.get(hasDepositBeforeCookie)) {
		const { data } = await apolloClient.query({
			query: optimizelyUserDataQuery,
		});

		// Logged in per the cookie, but the session didn't resolve server-side — still unknown,
		// so leave the cookies alone rather than caching a false negative.
		if (!data?.my?.id) {
			return;
		}

		const hasLentBefore = data?.my?.loans?.totalCount > 0;
		const hasDepositBefore = data?.my?.transactions?.totalCount > 0;

		cookieStore.set(hasLentBeforeCookie, String(hasLentBefore), { path: '/' });
		cookieStore.set(hasDepositBeforeCookie, String(hasDepositBefore), { path: '/' });
	}
}

/**
 * This wrapper supplies ui's cookieStore and adds the Optimizely attributes, which are ui-only.
 *
 * @param {object} cookieStore ui cookie accessor with get/set.
 * @param {object} receiptSignals What THIS transaction proves.
 * @param {boolean} receiptSignals.hasLoans Whether the receipt contained loans.
 * @param {boolean} receiptSignals.hasDeposit Whether the receipt included a deposit.
 * @returns {{hasLentBefore: boolean, hasDepositBefore: boolean}} The merged lifetime flags.
 */
export function recordTransactorSignals(cookieStore, { hasLoans, hasDeposit }) {
	const { hasLentBefore, hasDepositBefore } = recordSignals(
		{
			get: name => cookieStore?.get(name),
			set: (name, value) => cookieStore.set(name, value, { path: '/' }),
		},
		{ hasLoans, hasDeposit },
	);

	userHasLentBefore(hasLentBefore);
	userHasDepositBefore(hasDepositBefore);

	return { hasLentBefore, hasDepositBefore };
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
