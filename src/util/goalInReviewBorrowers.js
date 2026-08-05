export const MAX_BORROWER_CARDS = 11;

/**
 * Normalizes goal loans into photo cards, capped at MAX_BORROWER_CARDS.
 *
 * @param {Array} loans Goal loans, each `{ id, name, image { hash } }`.
 * @param {number|string} [totalBorrowerCount] Borrower total from slide 1.
 * @returns {{cards: Array<{id: string, name: string, imageHash: string}>, moreCount: number}}
 */
export function getBorrowerCards(loans = [], totalBorrowerCount = null) {
	const uniqueLoans = new Map(
		(loans ?? [])
			.filter(loan => loan?.id != null)
			.map(loan => [loan.id, loan]),
	);

	const cards = [...uniqueLoans.values()]
		.slice(0, MAX_BORROWER_CARDS)
		.map(loan => ({
			id: String(loan.id),
			name: loan.name ?? '',
			imageHash: loan.image?.hash ?? '',
		}));

	return {
		cards,
		moreCount: Math.max((Number(totalBorrowerCount) || 0) - cards.length, 0),
	};
}
