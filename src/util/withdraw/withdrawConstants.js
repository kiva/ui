// Mirrors the WithdrawalSubmitStatus GraphQL enum returned by the
// requestPayPalWithdrawal / authorizePayPalWithdrawal mutations. Also used for
// the pages' local `outcome` state, whose values are a subset of these.
export const WITHDRAWAL_STATUS = {
	SUCCESS: 'SUCCESS',
	AUTHORIZATION_REQUIRED: 'AUTHORIZATION_REQUIRED',
	BLOCKED: 'BLOCKED',
	ERROR: 'ERROR',
};

// Route paths for the withdraw-beta flow. Imported by the router and the pages so
// every navigation target resolves to a single source of truth.
export const WITHDRAW_ROUTE = {
	BASE: '/withdraw-beta',
	CONFIRM: '/withdraw-beta/confirm',
	CHECK_INBOX: '/withdraw-beta/check-inbox',
	AUTHORIZE: '/withdraw-beta/authorize',
};

// Human-readable action shown on the email-verification step-up page
// (StartVerification renders "…continue {process}!"). Shared by the route meta
// (guard-redirect path) and the in-page verify link so the wording can't drift.
export const WITHDRAW_PROCESS = 'withdrawing funds';

// Keys used to carry the in-flight request through history.state (kept out of the
// URL so PII never lands in query strings/logs). Shared by the pages that set and
// read them — a mismatch would silently drop the request, so they live in one place.
export const WITHDRAW_STATE_KEY = {
	AMOUNT: 'withdrawAmount',
	PAYPAL_EMAIL: 'withdrawPaypalEmail',
	EMAIL: 'withdrawEmail',
};
