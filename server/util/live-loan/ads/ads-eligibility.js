import fetchGraphQL from '../../fetchGraphQL.js';
import { warn } from '../../log.js';

// Locked candidate cap for the curated feed: request at most this many fundraising loans per
// generation and do not paginate. The feed is deliberately conservative, so a single page is enough.
export const AD_FEED_LOAN_COUNT = 100;

// Not-anonymized value of AnonymizationLevelEnum (none | public | full | pii). Any other value
// hides borrower identity/photo, which makes the loan unsuitable for a public ad feed.
const NOT_ANONYMIZED = 'none';

const THRESHOLDS = {
	minRiskRating: 3.5,
	maxRepaymentMonths: 12,
	maxDefaultRate: 0.05,
	minAmountLeft: 200,
	minDaysToExpiry: 3,
};

// Exclude-by-id filter fragment for the FLSS `none` operator. Returns an empty object (key omitted)
// for an empty/absent list so we never send `{ none: [] }`. Generic by field so partner/sector
// exclusion reuses it unchanged.
const excludeIds = (field, ids) => (ids?.length ? { [field]: { none: ids } } : {});

// FLSS filters that narrow fundraising loans down to the set eligible for the ad feed.
// Attributes within a single FundraisingLoanSearchFilterInput object are AND-ed together,
// while separate objects in the array are OR-ed -- so all five thresholds must live in one
// merged object for a loan to be required to satisfy every criterion. Admin-managed exclusions
// (loan, partner, and sector ids) are merged into the same object so excluded loans never enter
// the candidate set.
export function buildAdFeedFilters({ excludedLoanIds = [], excludedPartnerIds = [], excludedSectorIds = [] } = {}) {
	return [{
		partnerRiskRating: { range: { gte: THRESHOLDS.minRiskRating } },
		lenderRepaymentTerm: { range: { lte: THRESHOLDS.maxRepaymentMonths } },
		partnerDefaultRate: { range: { lte: THRESHOLDS.maxDefaultRate } },
		amountLeft: { range: { gte: THRESHOLDS.minAmountLeft } },
		daysUntilExpiration: { range: { gte: THRESHOLDS.minDaysToExpiry } },
		...excludeIds('loanIds', excludedLoanIds),
		...excludeIds('partnerId', excludedPartnerIds),
		...excludeIds('sectorId', excludedSectorIds),
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
	return true;
}

const LOAN_FIELDS = `
	id
	anonymizationLevel
	borrowers { id firstName isPrimary }
	image { id hash }
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
