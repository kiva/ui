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
// expectedRepaymentsDetail. Ported verbatim from the legacy view's switch
// (kiva: Portfolio_EstimatedRepaymentsByMonthSubView::initializeData) so the
// detail note reads "bonus credit" rather than the raw `reward_credit`. Any
// type not listed here falls back to PROMO_CREDIT_FALLBACK_LABEL, mirroring the
// legacy `default` branch.
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

// The legacy page's static disclaimer, ported verbatim. Rendered via v-html (all
// content is static/trusted here), so inline markup like <em> is allowed.
export const DISCLAIMER_PARAGRAPHS = [
	'*Scheduled repayment estimates are calculated based on the <em>original</em> repayment schedule for '
		+ 'each of your loans. Please note, these estimates don\'t account for delinquencies, defaults, '
		+ 'currency loss, or for when borrowers pay more than was scheduled and the principal has been '
		+ 'paid down. Click the amounts in the detailed view to see the advanced repayment details for '
		+ 'each loan.',
	'Each month\'s repayment estimation is rounded down to the nearest penny for each loan, and '
		+ 'therefore actual repayment amounts received may differ from what is estimated. The due date '
		+ 'for repayments is on the 1st of the month. Many of Kiva\'s Lending Partners begin paying '
		+ 'lenders earlier, on the settlement date which is the 17th of the month <em>prior</em> to the due date. '
		+ 'However, repayments may continue post to lender accounts anytime between the 17th and the 1st '
		+ 'before they\'re considered delinquent. For example: Often a majority of the amount estimated '
		+ 'for December 1st will be returned to the lender\'s account on November 17th, but some may post '
		+ 'later than the 17th. The "Due" column shows the actual due dates, not the '
		+ 'dates when repayments post to your account.',
	'These figures also don\'t imply that repayments are in any way guaranteed, as lending through '
		+ 'Kiva involves risk of principal loss.',
];

export const SETTLEMENT_NOTE = '(Typically repaid by the "Settlement Date," which is the 17th of '
	+ 'the month prior to the "Due Date")';
