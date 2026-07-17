import MinimalBorrowerProfile from '#src/components/BorrowerProfile/MinimalBorrowerProfile';

describe('MinimalBorrowerProfile.apollo.result', () => {
	const invokeResult = (ctx, data) => {
		expect(typeof MinimalBorrowerProfile.apollo.result).toBe('function');
		ctx.initRecommendations = ctx.initRecommendations ?? (() => {});
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
		ctx.initRecommendations = ctx.initRecommendations ?? (() => {});
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

describe('MinimalBorrowerProfile.methods.initRecommendations', () => {
	const invokeInit = ctx => MinimalBorrowerProfile.methods.initRecommendations.call(ctx);

	it('defers building the rows until the loan has loaded (no sector yet)', () => {
		const createViewportObserver = vi.fn();
		const ctx = { rows: null, loanData: {}, createViewportObserver };
		invokeInit(ctx);
		expect(ctx.rows).toBeNull();
		expect(createViewportObserver).not.toHaveBeenCalled();
	});

	it('builds all four rows from the loaded loan and starts the observer', () => {
		const createViewportObserver = vi.fn();
		const ctx = {
			rows: null,
			loanData: {
				sector: { name: 'Retail' },
				gender: 'female',
				geocode: { country: { isoCode: 'GT' } },
			},
			createViewportObserver,
		};
		invokeInit(ctx);
		expect(ctx.rows).toHaveLength(4);
		expect(ctx.rows[0].filter).toEqual({ sector: { eq: 'Retail' } });
		expect(ctx.rows[2].filter).toEqual({ gender: { eq: 'female' } });
		expect(ctx.rows[3].filter).toEqual({ countryIsoCode: { eq: 'GT' } });
		expect(createViewportObserver).toHaveBeenCalledOnce();
	});

	it('does not rebuild the rows once they are already built', () => {
		const createViewportObserver = vi.fn();
		const existing = [{ identifier: 'sector' }];
		const ctx = { rows: existing, loanData: { sector: { name: 'Retail' } }, createViewportObserver };
		invokeInit(ctx);
		expect(ctx.rows).toBe(existing);
		expect(createViewportObserver).not.toHaveBeenCalled();
	});
});
