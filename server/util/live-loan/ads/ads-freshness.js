import chunk from 'lodash/chunk.js';
import fetchGraphQL from '../../fetchGraphQL.js';
import { warn } from '../../log.js';

// The gateway's Loan.status returns lowercase 'fundraising' (verified against the live graph);
// this is NOT the monolith's camelCase 'fundRaising' constant.
const STATUS_FUNDRAISING = 'fundraising';
const NOT_ANONYMIZED = 'none';
// The gateway caps query complexity (~230) and each aliased loan(id){...} costs ~5, so a full
// 100-candidate query (~500) is rejected. Batch ids into chunks well under that ceiling and merge.
const CHUNK_SIZE = 40;

// Re-fetch a chunk of candidates from the authoritative lend.loan resolver in one round trip, using
// GraphQL field aliases (l0, l1, ...). lend.loan(id) is the source-of-truth loan record, distinct
// from the FLSS search index which can lag. A failed chunk drops only its own loans (they stay
// unverified and are excluded downstream), so one bad chunk never poisons the rest.
async function fetchLiveLoans(ids) {
	const selections = ids
		.map((id, i) => `l${i}: loan(id: ${id}) { id status anonymizationLevel }`)
		.join('\n\t\t\t');
	const query = `query adFreshness {\n\t\tlend {\n\t\t\t${selections}\n\t\t}\n\t}`;
	try {
		const lend = await fetchGraphQL({ query }, 'data.lend');
		return lend ? Object.values(lend) : [];
	} catch (err) {
		warn(`Ad feed: freshness re-check chunk failed, ${err}`);
		return [];
	}
}

// Re-check FLSS candidates against the authoritative loan resolver and keep only those that are
// still fundraising and not anonymized, preserving the input order. A non-fundraising status
// (funded, expired, refunded, defaulted) or any anonymization drops the loan; a loan the resolver
// couldn't return is dropped too (fail closed) rather than advertised unverified.
export async function filterToStillFundraising(loans) {
	const ids = loans
		.map(loan => Number(loan?.id))
		.filter(id => Number.isInteger(id) && id > 0);
	if (ids.length === 0) return [];

	const results = await Promise.all(chunk(ids, CHUNK_SIZE).map(fetchLiveLoans));

	const live = new Map();
	results.flat().forEach(loan => {
		if (loan?.id) live.set(Number(loan.id), loan);
	});
	if (live.size === 0) {
		warn('Ad feed: freshness re-check returned no data');
	}

	return loans.filter(loan => {
		const authoritative = live.get(Number(loan?.id));
		return authoritative
			&& authoritative.status === STATUS_FUNDRAISING
			&& authoritative.anonymizationLevel === NOT_ANONYMIZED;
	});
}
