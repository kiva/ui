/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import MinimalBorrowerProfile from '#src/components/BorrowerProfile/MinimalBorrowerProfile';
import LoanProgress from '#src/components/BorrowerProfile/LoanProgress';
import { globalOptions, routerLinkStub } from '../../../specUtils';

function mountMinimal({ utmCampaign } = {}) {
	return mount(MinimalBorrowerProfile, {
		props: {
			loan: {
				id: 88,
				name: 'Eunice',
				status: 'funded',
				geocode: { country: { name: 'Uganda' } },
			},
		},
		global: {
			...globalOptions,
			stubs: {
				RouterLink: routerLinkStub,
				HeroBackground: true,
				BorrowerImage: true,
				KivaClassicLoanCarousel: true,
				LoanCardController: true,
			},
			mocks: {
				...globalOptions.mocks,
				$route: {
					params: { id: '88' },
					query: utmCampaign ? { utm_campaign: utmCampaign } : {},
				},
			},
		},
	});
}

describe('MinimalBorrowerProfile live-loan ad funded messaging', () => {
	it('flags LoanProgress to show the ad fallback headline for ad landings', () => {
		const wrapper = mountMinimal({ utmCampaign: 'liveloans' });
		expect(wrapper.findComponent(LoanProgress).props('isLiveLoanAd')).toBe(true);
	});

	it('does not flag LoanProgress for non-ad traffic', () => {
		const wrapper = mountMinimal();
		expect(wrapper.findComponent(LoanProgress).props('isLiveLoanAd')).toBe(false);
	});
});

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

describe('MinimalBorrowerProfile.computed.isLiveLoanAd', () => {
	const invoke = ctx => MinimalBorrowerProfile.computed.isLiveLoanAd.call(ctx);

	it('is true when the landing query is the live-loan ads campaign', () => {
		expect(invoke({ $route: { query: { utm_campaign: 'liveloans' } } })).toBe(true);
	});

	it('is false for a different campaign', () => {
		expect(invoke({ $route: { query: { utm_campaign: 'scle' } } })).toBe(false);
	});

	it('is false when no campaign is present', () => {
		expect(invoke({ $route: { query: {} } })).toBe(false);
	});
});

describe('MinimalBorrowerProfile.methods.trackAdFundedLanding', () => {
	const invoke = ctx => MinimalBorrowerProfile.methods.trackAdFundedLanding.call(ctx);

	const adCtx = overrides => ({
		isLiveLoanAd: true,
		loanData: { id: 123, status: 'expired' },
		$kvTrackEvent: vi.fn(),
		...overrides,
	});

	it('fires the funded-state landing event with the raw status in the property arg', () => {
		const ctx = adCtx();
		invoke(ctx);
		expect(ctx.$kvTrackEvent).toHaveBeenCalledWith(
			'borrower-profile',
			'funded-state landing',
			123,
			'expired',
		);
	});

	it('does not fire for non-ad traffic', () => {
		const ctx = adCtx({ isLiveLoanAd: false });
		invoke(ctx);
		expect(ctx.$kvTrackEvent).not.toHaveBeenCalled();
	});

	it('does not fire without a loaded status', () => {
		const ctx = adCtx({ loanData: { id: 123 } });
		invoke(ctx);
		expect(ctx.$kvTrackEvent).not.toHaveBeenCalled();
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
