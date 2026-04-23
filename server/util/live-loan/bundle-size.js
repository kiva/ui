export const DEFAULT_BUNDLE_COUNT = 4;

const REDIRECT_PATH = '/lend/filter';
const MAX_BALANCE = 150;
const TIER_STEP = 25;
const MIN_LOANS = 1;
const MAX_LOANS = 6;

/**
 * Resolves how many loans should be included in a live-loan email bundle, based on the
 * recipient's account balance. Tiers: $25.01–$50 → 2 loans, $50.01–$75 → 3, $75.01–$100 → 4,
 * $100.01–$125 → 5, $125.01–$150 → 6. Balance ≤ $25 → 1 loan. Balance > $150 → redirect to
 * `/lend/filter` (combo page) so the user can curate a larger bundle themselves.
 *
 * Falsy, malformed, non-string/non-number, or negative input returns the 4-loan default so
 * that pre-MP-2713 email links without a `?balance=` parameter keep their original behavior.
 *
 * @param {string|number} balanceInput Raw `?balance=` query value from the request.
 * @returns {{ count: number } | { redirect: string }} Either a count in [1, 6] or a redirect path.
 */
export function resolveBundleSize(balanceInput) {
	if (typeof balanceInput !== 'string' && typeof balanceInput !== 'number') {
		return { count: DEFAULT_BUNDLE_COUNT };
	}
	const normalized = typeof balanceInput === 'string' ? balanceInput.trim() : balanceInput;
	if (normalized === '') {
		return { count: DEFAULT_BUNDLE_COUNT };
	}
	const balance = Number(normalized);
	if (!Number.isFinite(balance) || balance < 0) {
		return { count: DEFAULT_BUNDLE_COUNT };
	}
	if (balance > MAX_BALANCE) {
		return { redirect: REDIRECT_PATH };
	}
	const raw = Math.ceil(balance / TIER_STEP);
	const count = Math.min(Math.max(raw, MIN_LOANS), MAX_LOANS);
	return { count };
}
