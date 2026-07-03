import MinimalBorrowerProfile from '#src/components/BorrowerProfile/MinimalBorrowerProfile';

describe('MinimalBorrowerProfile.apollo.result', () => {
	// We test result() by invoking it directly against a plain context object.
	// This avoids mounting + mocking the entire apollo plugin for a one-line fix,
	// and exercises exactly the assignment behaviour we care about.
	const invokeResult = (ctx, data) => {
		expect(typeof MinimalBorrowerProfile.apollo.result).toBe('function');
		MinimalBorrowerProfile.apollo.result.call(ctx, { data });
	};

	it('replaces loanData with the fetched loan when the query returns one', () => {
		const ctx = { loanData: { id: 123, name: 'Maria' } };
		invokeResult(ctx, { lend: { loan: { id: 123, name: 'Maria', status: 'funded' } } });
		expect(ctx.loanData).toEqual({ id: 123, name: 'Maria', status: 'funded' });
	});

	it('preserves the prop-seeded loanData when the response is missing a loan', () => {
		const seeded = { id: 123, name: 'Maria', geocode: { country: { name: 'Kenya' } } };
		const ctx = { loanData: { ...seeded } };

		invokeResult(ctx, { lend: { loan: null } });
		expect(ctx.loanData).toEqual(seeded);

		invokeResult(ctx, { lend: null });
		expect(ctx.loanData).toEqual(seeded);

		invokeResult(ctx, null);
		expect(ctx.loanData).toEqual(seeded);
	});
});

describe('MinimalBorrowerProfile.apollo.result isSummaryLoading', () => {
	const invokeResult = (ctx, data) => {
		MinimalBorrowerProfile.apollo.result.call(ctx, { data });
	};

	it('clears isSummaryLoading once the query resolves with a loan', () => {
		const ctx = { loanData: {}, isSummaryLoading: true };
		invokeResult(ctx, { lend: { loan: { id: 123, name: 'Maria', status: 'refunded' } } });
		expect(ctx.isSummaryLoading).toBe(false);
	});

	it('still clears isSummaryLoading when the response is missing a loan', () => {
		const ctx = { loanData: { id: 123, name: 'Maria' }, isSummaryLoading: true };
		invokeResult(ctx, { lend: { loan: null } });
		expect(ctx.isSummaryLoading).toBe(false);
	});
});
