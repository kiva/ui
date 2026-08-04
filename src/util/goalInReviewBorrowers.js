export const MAX_BORROWER_CARDS = 11;

/**
 * Normalizes goal loans into photo cards, capped at MAX_BORROWER_CARDS.
 *
 * @param {Array} loans Goal loans, each `{ id, name, image { hash } }`.
 * @param {number|string} [totalBorrowerCount] Borrower total from slide 1.
 * @returns {{cards: Array<{id: string, name: string, imageHash: string}>, moreCount: number}}
 */
export function getBorrowerCards(loans = [], totalBorrowerCount = null) {
	const seenLoanIds = new Set();
	const cards = [];

	(loans ?? []).forEach(loan => {
		if (cards.length >= MAX_BORROWER_CARDS) {
			return;
		}
		if (!loan || loan.id == null || seenLoanIds.has(loan.id)) {
			return;
		}
		seenLoanIds.add(loan.id);
		cards.push({
			id: String(loan.id),
			name: loan.name ?? '',
			imageHash: loan.image?.hash ?? '',
		});
	});

	const total = Number(totalBorrowerCount);
	const knownTotal = Number.isFinite(total) && total > 0 ? total : cards.length;

	return {
		cards,
		moreCount: Math.max(knownTotal - cards.length, 0),
	};
}
