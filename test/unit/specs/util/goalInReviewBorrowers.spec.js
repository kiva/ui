import { getBorrowerCards, MAX_BORROWER_CARDS } from '#src/util/goalInReviewBorrowers';

const buildLoans = (count, startId = 1) => Array.from({ length: count }, (_unused, i) => ({
	id: startId + i,
	name: `Borrower ${startId + i}`,
	image: { hash: `hash-${startId + i}` },
}));

describe('goalInReviewBorrowers', () => {
	describe('getBorrowerCards', () => {
		it('maps loans to cards with name and image hash', () => {
			const { cards } = getBorrowerCards(buildLoans(2), 2);
			expect(cards).toEqual([
				{ id: '1', name: 'Borrower 1', imageHash: 'hash-1' },
				{ id: '2', name: 'Borrower 2', imageHash: 'hash-2' },
			]);
		});

		it('de-duplicates loans repeated across achievements', () => {
			const [loan] = buildLoans(1);
			const { cards, moreCount } = getBorrowerCards([loan, { ...loan }, ...buildLoans(1, 2)], 2);
			expect(cards.map(card => card.id)).toEqual(['1', '2']);
			expect(moreCount).toBe(0);
		});

		it('skips loans with no id', () => {
			const { cards } = getBorrowerCards([{ name: 'No id' }, null, ...buildLoans(1)], 1);
			expect(cards.map(card => card.id)).toEqual(['1']);
		});

		it('falls back to empty strings for a missing name or image', () => {
			const { cards } = getBorrowerCards([{ id: 7 }], 1);
			expect(cards).toEqual([{ id: '7', name: '', imageHash: '' }]);
		});

		describe('overflow rule', () => {
			it('shows every card and no overflow at exactly the limit', () => {
				const { cards, moreCount } = getBorrowerCards(
					buildLoans(MAX_BORROWER_CARDS),
					MAX_BORROWER_CARDS,
				);
				expect(cards).toHaveLength(MAX_BORROWER_CARDS);
				expect(moreCount).toBe(0);
			});

			it('caps at the limit and rolls the remainder into "+n more" one over', () => {
				const total = MAX_BORROWER_CARDS + 1;
				const { cards, moreCount } = getBorrowerCards(buildLoans(total), total);
				expect(cards).toHaveLength(MAX_BORROWER_CARDS);
				expect(moreCount).toBe(1);
			});

			it('sums cards plus the overflow back to the borrower total', () => {
				const total = 48;
				const { cards, moreCount } = getBorrowerCards(buildLoans(total), total);
				expect(cards.length + moreCount).toBe(total);
			});

			it('counts the overflow against borrowers, not loans, for group loans', () => {
				const { cards, moreCount } = getBorrowerCards(buildLoans(4), 20);
				expect(cards).toHaveLength(4);
				expect(moreCount).toBe(16);
			});

			it('never returns a negative overflow when the total lags the loans', () => {
				const { cards, moreCount } = getBorrowerCards(buildLoans(5), 2);
				expect(cards).toHaveLength(5);
				expect(moreCount).toBe(0);
			});
		});

		describe('missing inputs', () => {
			it('hides the overflow when the total is absent', () => {
				const { cards, moreCount } = getBorrowerCards(buildLoans(3));
				expect(cards).toHaveLength(3);
				expect(moreCount).toBe(0);
			});

			it('hides the overflow when the total is not a number', () => {
				const { moreCount } = getBorrowerCards(buildLoans(3), 'not a number');
				expect(moreCount).toBe(0);
			});

			it('returns an empty grid with no loans', () => {
				expect(getBorrowerCards()).toEqual({ cards: [], moreCount: 0 });
				expect(getBorrowerCards(null, 5)).toEqual({ cards: [], moreCount: 5 });
			});
		});
	});
});
