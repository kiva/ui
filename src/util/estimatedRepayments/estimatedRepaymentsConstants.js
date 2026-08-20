// Route path, chart palette, and legacy copy for the estimated-repayments beta page.
// Colours mirror the legacy stacked chart's two series and were validated (dataviz
// skill) for colour-blind separation and surface contrast in light and dark modes.
import kvTokensPrimitives from '@kiva/kv-tokens';

const { colors } = kvTokensPrimitives;

export const ESTIMATED_REPAYMENTS_ROUTE = '/portfolio/estimated-repayments-beta';

// The legacy detail query caps the per-month loan list; surface a truncation notice
// when the returned list reaches this size. Mirrors the resolver's default limit.
export const DETAIL_LIMIT = 500;

export const PROMO_CREDIT_FALLBACK_LABEL = 'promotional credit';

// Human-readable labels for the raw `promoType` enum returned by
// expectedRepaymentsDetail, so the detail note reads "bonus credit" rather than
// the raw `reward_credit`. Any type not listed here falls back to
// PROMO_CREDIT_FALLBACK_LABEL.
export const PROMO_TYPE_LABELS = {
	reward_credit: 'bonus credit',
	free_trial: 'free trial credit',
};

// Fixed series order (never cycled). `color` overrides the library's default
// palette; colors are pulled from the kv-tokens core palette (theme-independent,
// so they stay constant across light/dark per the kv-components chart convention).
// Order matters: KvStackedBarGraph renders the FIRST series at the top of the
// stack (and lists it first in the legend), so `promo` leads to sit on top.
export const REPAYMENT_SERIES = [
	{
		key: 'promo',
		label: 'Repaid to Kiva or sponsor (free trials, bonuses, and general promotional credit)',
		color: colors.marigold['3'],
	},
	{
		key: 'user',
		label: 'Repaid to your account',
		color: colors.brand['700'],
	},
];

export const SETTLEMENT_NOTE = '(Typically repaid by the "Settlement Date," which is the 17th of '
	+ 'the month prior to the "Due Date")';
