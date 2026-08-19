import fetchGraphQL from '../../fetchGraphQL.js';
import { warn } from '../../log.js';

// Pull the FLSS single-page maximum (200) per generation without paginating -- the eligibility and
// ad-safety gates drop a chunk of candidates (small images, banned copy), so requesting the max leaves
// headroom to fill the feed.
export const AD_FEED_LOAN_COUNT = 200;

// Not-anonymized value of AnonymizationLevelEnum (none | public | full | pii). Any other value
// hides borrower identity/photo, which makes the loan unsuitable for a public ad feed.
const NOT_ANONYMIZED = 'none';

// Google Merchant Center requires an image_link of at least 500x500 px. We don't upscale, so a loan
// whose photo is smaller than this on either side is dropped rather than shipped small.
const MIN_IMAGE_DIMENSION = 500;

const THRESHOLDS = {
	minRiskRating: 3.5,
	maxRepaymentMonths: 12,
	maxDefaultRate: 0.05,
	minAmountLeft: 200,
	minDaysToExpiry: 3,
};

// Exclude-by-id filter fragment for the FLSS `none` operator. Returns an empty object (key omitted)
// for an empty/absent list so we never send `{ none: [] }`.
const excludeIds = (field, ids) => (ids?.length ? { [field]: { none: ids } } : {});

// FLSS filters that narrow fundraising loans down to the set eligible for the ad feed.
// Attributes within a single FundraisingLoanSearchFilterInput object are AND-ed together,
// while separate objects in the array are OR-ed -- so all five thresholds must live in one
// merged object for a loan to be required to satisfy every criterion. Admin-managed exclusions
// arrive as a map of FLSS filter field -> ids (e.g. { loanIds, partnerId, sectorId }) and are merged
// into the same object as `none` fragments -- so a new exclusion dimension is one more map entry at
// the call site, not a change to this signature.
export function buildAdFeedFilters(exclusions = {}) {
	return [{
		partnerRiskRating: { range: { gte: THRESHOLDS.minRiskRating } },
		lenderRepaymentTerm: { range: { lte: THRESHOLDS.maxRepaymentMonths } },
		partnerDefaultRate: { range: { lte: THRESHOLDS.maxDefaultRate } },
		amountLeft: { range: { gte: THRESHOLDS.minAmountLeft } },
		daysUntilExpiration: { range: { gte: THRESHOLDS.minDaysToExpiry } },
		...Object.entries(exclusions).reduce(
			(filters, [field, ids]) => ({ ...filters, ...excludeIds(field, ids) }),
			{},
		),
	}];
}

// Return the first name to display for a loan: the primary borrower if flagged, otherwise the
// first borrower in the list.
export function primaryFirstName(loan) {
	const list = loan?.borrowers ?? [];
	const primary = list.find(b => b?.isPrimary) ?? list[0];
	return primary?.firstName ?? '';
}

// Code-side eligibility gate applied after the FLSS query, for conditions FLSS filters can't express.
export function isEligibleLoan(loan) {
	if (!loan?.id) return false;
	if (loan.anonymizationLevel !== NOT_ANONYMIZED) return false;
	if (!primaryFirstName(loan)) return false;
	if (!loan?.image?.hash) return false;
	if (!(loan.image.width >= MIN_IMAGE_DIMENSION && loan.image.height >= MIN_IMAGE_DIMENSION)) return false;
	return true;
}

const LOAN_FIELDS = `
	id
	anonymizationLevel
	use
	borrowers { id firstName isPrimary }
	image { id hash width height }
	geocode { country { id name } }
	sector { id name }
`;

// Fetch fundraising loans that pass the FLSS ad-eligibility filters, then apply the code-side gate.
export async function fetchAdEligibleLoans(count = AD_FEED_LOAN_COUNT, exclusions = {}) {
	const data = await fetchGraphQL(
		{
			query: `query adEligibleLoans($filters: [FundraisingLoanSearchFilterInput!]) {
				fundraisingLoans(
					limit: ${count},
					filters: $filters,
					origin: "google:live-loan-ads"
				) {
					values { ${LOAN_FIELDS} }
				}
			}`,
			variables: { filters: buildAdFeedFilters(exclusions) },
		},
		'data.fundraisingLoans.values',
	);
	if (!Array.isArray(data)) {
		warn('Ad feed: no loans returned');
		return [];
	}
	return data.filter(isEligibleLoan);
}
