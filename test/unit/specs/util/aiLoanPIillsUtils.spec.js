import { getLoansIds, fetchAiLoanPills, addAiPillsToLoans } from '#src/util/aiLoanPIillsUtils';
import logReadQueryError from '#src/util/logReadQueryError';

vi.mock('#src/util/logReadQueryError');

describe('getLoansIds', () => {
	it('should return an array of loan ids', () => {
		const loans = [{ id: 1 }, { id: 2 }, { id: 3 }];
		expect(getLoansIds(loans)).toEqual([1, 2, 3]);
	});

	it('should return an empty array if loans is empty', () => {
		expect(getLoansIds([])).toEqual([]);
	});
});

describe('fetchAiLoanPills', () => {
	const mockQuery = vi.fn();
	const apollo = { query: mockQuery };
	const loanIds = [1, 2];

	it('should return pills values from data', async () => {
		mockQuery.mockResolvedValue({
			data: { getLoanPills: { values: ['pill1', 'pill2'] } }
		});
		const result = await fetchAiLoanPills(apollo, loanIds);
		expect(result).toEqual(['pill1', 'pill2']);
		expect(mockQuery).toHaveBeenCalledWith({
			query: expect.anything(),
			variables: { loanIds }
		});
	});

	it('should return empty array if values is undefined', async () => {
		mockQuery.mockResolvedValue({ data: { getLoanPills: {} } });
		const result = await fetchAiLoanPills(apollo, loanIds);
		expect(result).toEqual([]);
	});

	it('should call logReadQueryError on error', async () => {
		const error = new Error('Test error');
		apollo.query.mockRejectedValueOnce(error);

		await fetchAiLoanPills(apollo, loanIds);

		expect(logReadQueryError).toHaveBeenCalledWith(error, 'aiLoanPillsUtils aiLoanPillsQuery');
	});
});

describe('addAiPillsToLoans', () => {
	it('should add aiPills to loans', () => {
		const loans = [{ id: 1 }, { id: 2 }];
		const pillsLoans = [
			{ loanId: 1, pills: ['pillA'] },
			{ loanId: 2, pills: ['pillB', 'pillC'] }
		];
		const result = addAiPillsToLoans(loans, pillsLoans);
		expect(result).toEqual([
			{ id: 1, aiPills: ['pillA'] },
			{ id: 2, aiPills: ['pillB', 'pillC'] }
		]);
	});

	it('should add empty aiPills if no pills found', () => {
		const loans = [{ id: 1 }];
		const pillsLoans = [];
		const result = addAiPillsToLoans(loans, pillsLoans);
		expect(result).toEqual([{ id: 1, aiPills: [] }]);
	});

	it('should handle null or undefined loans', () => {
		const result = addAiPillsToLoans(undefined, []);
		expect(result).toEqual([]);
	});
});
