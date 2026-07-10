import {
	getLoansIds,
	fetchAiLoanPills,
	addAiPillsToLoans,
	withAiPills,
} from '#src/util/aiLoanPillsUtils';
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

describe('withAiPills', () => {
	it('skips the query and returns the loans unchanged when there are no loans', async () => {
		const query = vi.fn();
		const result = await withAiPills({ query }, []);

		expect(result).toEqual([]);
		expect(query).not.toHaveBeenCalled();
	});

	it('returns an empty array when loans is null or undefined', async () => {
		const query = vi.fn();

		expect(await withAiPills({ query }, undefined)).toEqual([]);
		expect(query).not.toHaveBeenCalled();
	});

	it('fetches pills and attaches them to the loans', async () => {
		const query = vi.fn().mockResolvedValue({
			data: { getLoanPills: { values: [{ loanId: 1, pills: ['pillA'] }] } }
		});

		const result = await withAiPills({ query }, [{ id: 1 }, { id: 2 }]);

		expect(query).toHaveBeenCalledWith({
			query: expect.anything(),
			variables: { loanIds: [1, 2] }
		});
		expect(result).toEqual([
			{ id: 1, aiPills: ['pillA'] },
			{ id: 2, aiPills: [] }
		]);
	});

	it('returns the loans with empty pills when the query fails', async () => {
		const query = vi.fn().mockRejectedValue(new Error('network error'));

		const result = await withAiPills({ query }, [{ id: 1 }, { id: 2 }]);

		expect(query).toHaveBeenCalled();
		expect(result).toEqual([
			{ id: 1, aiPills: [] },
			{ id: 2, aiPills: [] }
		]);
	});
});
