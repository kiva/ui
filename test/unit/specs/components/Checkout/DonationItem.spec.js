/* eslint-disable import/no-extraneous-dependencies -- @vue/test-utils devDependency */
import { flushPromises } from '@vue/test-utils';
import DonationItem from '#src/components/Checkout/DonationItem';
import useCheckoutTipExperimentCopy from '#src/composables/useCheckoutTipExperimentCopy';

vi.mock('#src/composables/useCheckoutTipExperimentCopy', () => ({ default: vi.fn() }));

// The named tip ask. Reads the borrowers out of the basket so the copy says who the money is
// for, and falls back to the existing wording wherever there is no borrower to name.
describe('DonationItem tip ask copy', () => {
	const call = (name, context) => DonationItem.computed[name].call(context);

	const askContext = ({ names = ['Maria'], loanCount = 1, loanReservationTotal = 25 } = {}) => {
		const context = {
			borrowerNames: names,
			loanCount,
			loanReservationTotal,
			hasLoans: loanCount > 0,
			isCampaignDonation: false,
			showTipFromBalanceVariant: true,
		};
		// Mirror the component: these computeds read one another
		context.loanNoun = call('loanNoun', context);
		context.firstBorrowerName = call('firstBorrowerName', context);
		context.showTipAskVariant = call('showTipAskVariant', context);
		context.loanTotalDisplay = call('loanTotalDisplay', context);
		context.tipAskHeader = call('tipAskHeader', context);
		context.tipAskTagline = call('tipAskTagline', context);
		return context;
	};

	it.each([
		[
			'one loan',
			{ names: ['Maria'], loanCount: 1, loanReservationTotal: 25 },
			"Cover the cost of Maria's loan?",
			"100% of your $25 goes to Maria's loan — your donation helps Kiva get it there.",
		],
		[
			'two loans',
			{ names: ['Maria', 'Joice'], loanCount: 2, loanReservationTotal: 50 },
			"Cover the cost of Maria and Joice's loans?",
			'100% of your $50 goes toward these loans — your donation helps Kiva get it there.',
		],
		[
			'three loans',
			{ names: ['Maria', 'Joice', 'Ana'], loanCount: 3, loanReservationTotal: 75 },
			"Cover the cost of Maria's loan and 2 others?",
			'100% of your $75 goes toward these loans — your donation helps Kiva get it there.',
		],
	])('names the borrowers with %s', (label, overrides, expectedHeader, expectedTagline) => {
		const context = askContext(overrides);

		expect(call('basketDonationHeader', context)).toBe(expectedHeader);
		expect(call('basketDonationTagline', context)).toBe(expectedTagline);
		expect(call('donationDetailsLink', context)).toBe('Learn more');
	});

	// LoanReservation.loan is nullable, so BasketItemsList can filter a name out and leave fewer
	// names than loans. The count still describes the basket, but the plural has to follow it.
	it.each([
		[2, ['Maria'], "Cover the cost of Maria's loan and 1 other?"],
		[3, ['Maria'], "Cover the cost of Maria's loan and 2 others?"],
	])('handles %i loans with only one borrower name', (loanCount, names, expected) => {
		expect(call('tipAskHeader', askContext({ names, loanCount }))).toBe(expected);
	});

	// A name already ending in s takes a bare apostrophe, via the same helper the upsell uses
	it('does not double up the possessive on a name ending in s', () => {
		const context = askContext({ names: ['Carlos'], loanCount: 1 });

		expect(call('basketDonationHeader', context)).toBe("Cover the cost of Carlos' loan?");
	});

	it('keeps the cents when the loan total is not whole', () => {
		const context = askContext({ names: ['Maria'], loanCount: 1, loanReservationTotal: 27.5 });

		expect(call('basketDonationTagline', context))
			.toBe("100% of your $27.50 goes to Maria's loan — your donation helps Kiva get it there.");
	});

	it.each([
		[
			'control',
			{ showTipFromBalanceVariant: false, names: ['Maria'], loanCount: 1 },
			'Help cover the cost of your loan',
		],
		[
			'no borrower name to use',
			{ showTipFromBalanceVariant: true, names: [], loanCount: 2 },
			'Help cover the cost of your loans',
		],
		[
			'a basket with no loans',
			{ showTipFromBalanceVariant: true, names: [], loanCount: 0 },
			'Donate to Kiva',
		],
	])('falls back to the existing copy for %s', (
		label,
		{ showTipFromBalanceVariant, ...overrides },
		expectedHeader,
	) => {
		const context = { ...askContext(overrides), showTipFromBalanceVariant };
		context.showTipAskVariant = call('showTipAskVariant', context);

		expect(call('basketDonationHeader', context)).toBe(expectedHeader);
		expect(call('donationDetailsLink', context)).toBe('Learn how Kiva uses your donation');
	});
});

// canHostTipFromBalanceToggle decides whether KivaCreditTipToggle mounts at all, and the
// toggle is what fires the experiment exposure event. A donation row that wrongly reports
// false costs exposure in both arms; one that wrongly reports true mounts a second toggle
// alongside the basket-list copy, double counting.
describe('DonationItem canHostTipFromBalanceToggle', () => {
	const canHost = context => DonationItem.computed.canHostTipFromBalanceToggle.call(context);

	it('hosts the toggle on an ordinary tip row', () => {
		expect(canHost({ isCampaignDonation: false, orderTotalVariant: false })).toBe(true);
	});

	it.each([
		['a campaign donation', { isCampaignDonation: true, orderTotalVariant: false }],
		['the order totals copy of the row', { isCampaignDonation: false, orderTotalVariant: true }],
	])('does not host the toggle on %s', (label, context) => {
		expect(canHost(context)).toBe(false);
	});
});

// Eligibility is computed once on the checkout page and injected, so this only decides where
// the compressed layout may apply â not who is in the experiment.
describe('DonationItem showTipFromBalanceVariant', () => {
	const showVariant = ({ tip = '3.75', ...context }) => DonationItem.computed
		.showTipFromBalanceVariant.call({ donation: { price: tip }, ...context });

	it('shows the variant styling for an eligible lender', () => {
		expect(showVariant({
			tipFromBalanceEligible: true,
			canHostTipFromBalanceToggle: true,
		})).toBe(true);
	});

	// One boolean now covers control, an unresolved assignment, no balance, no loans, a team
	// membership and the deposit ceiling â the page decides, this row just follows
	it('keeps the existing styling for anyone ineligible', () => {
		expect(showVariant({
			tipFromBalanceEligible: false,
			canHostTipFromBalanceToggle: true,
		})).toBe(false);
	});

	it('stays off wherever the toggle cannot be hosted, even when eligible', () => {
		expect(showVariant({
			tipFromBalanceEligible: true,
			canHostTipFromBalanceToggle: false,
		})).toBe(false);
	});

	// A zeroed tip keeps the treatment: the switch and its label go, but the copy and layout
	// staying put means the page never flips back to the control mid-checkout
	it('keeps the variant styling at a zero tip, where only the switch goes', () => {
		expect(showVariant({
			tipFromBalanceEligible: true,
			canHostTipFromBalanceToggle: true,
			tip: '0.00',
		})).toBe(true);
	});
});

// Exercised at the method level to keep the focus on the error branch rather than the rendered item.
describe('DonationItem.vue updating a donation while a checkout is running', () => {
	const createContext = errors => ({
		apollo: { mutate: vi.fn().mockResolvedValue({ errors }) },
		amount: '5.00',
		cachedAmount: '$3.00',
		donation: { isTip: true },
		editDonation: true,
		$emit: vi.fn(),
		$showTipMsg: vi.fn(),
		$kvTrackEvent: vi.fn(),
	});

	it.each([
		['checkout_in_progress'],
		['shop.checkoutInProgress'],
	])('shows the checkout in progress message for %s and reverts the amount', async code => {
		const { CHECKOUT_IN_PROGRESS_MESSAGE } = await import('#src/util/basketUtils');
		const context = createContext([{ message: 'engineer placeholder copy', extensions: { code } }]);

		DonationItem.methods.updateDonation.call(context);
		await flushPromises();

		expect(context.$showTipMsg).toHaveBeenCalledWith(CHECKOUT_IN_PROGRESS_MESSAGE, 'error');
		expect(context.amount).toBe('$3.00');
	});

	it('still shows the backend message for unrelated errors', async () => {
		const context = createContext([{ message: 'something else went wrong', extensions: { code: 'other' } }]);

		DonationItem.methods.updateDonation.call(context);
		await flushPromises();

		expect(context.$showTipMsg).toHaveBeenCalledWith('something else went wrong', 'error');
	});
});

describe('DonationItem checkout tip copy experiment', () => {
	const call = (name, context) => DonationItem.computed[name].call(context);

	const copyContext = ({
		experimentCopy = vi.fn(() => null),
		loanCount = 2,
		isCampaignDonation = false,
		showTipAskVariant = false,
		hasKivaCards = false,
	} = {}) => {
		const context = {
			experimentCopy,
			loanCount,
			isCampaignDonation,
			showTipAskVariant,
			hasKivaCards,
			hasLoans: loanCount > 0,
			tipAskHeader: 'Cover the cost of these loans?',
			tipAskTagline: '100% of your $50 goes toward these loans — your donation helps Kiva get it there.',
		};
		context.loanNoun = call('loanNoun', context);
		context.experimentTipTitle = call('experimentTipTitle', context);
		context.experimentTipTagline = call('experimentTipTagline', context);
		context.showsExperimentTipTitle = call('showsExperimentTipTitle', context);
		context.showsExperimentTipTagline = call('showsExperimentTipTagline', context);
		return context;
	};

	it('exposes the experiment copy helpers from setup', () => {
		const copy = vi.fn();
		const trackExposure = vi.fn();
		useCheckoutTipExperimentCopy.mockReturnValue({ copy, trackExposure });

		expect(DonationItem.setup()).toEqual({ experimentCopy: copy, trackCopyExposure: trackExposure });
	});

	it('asks for the headline with the plural placeholder for several loans', () => {
		const experimentCopy = vi.fn(() => 'A better tip title');
		const context = { experimentCopy, loanCount: 2 };
		context.loanNoun = call('loanNoun', context);

		expect(call('experimentTipTitle', context)).toBe('A better tip title');
		expect(experimentCopy).toHaveBeenCalledWith('headline', { loans: 'loans' });
	});

	it('asks for the headline with the singular placeholder for one loan', () => {
		const experimentCopy = vi.fn(() => null);
		const context = { experimentCopy, loanCount: 1 };
		context.loanNoun = call('loanNoun', context);

		call('experimentTipTitle', context);
		expect(experimentCopy).toHaveBeenCalledWith('headline', { loans: 'loan' });
	});

	it('renders the experiment title for a basket with loans', () => {
		const context = copyContext({ experimentCopy: vi.fn(() => 'A better tip title') });
		expect(call('basketDonationHeader', context)).toBe('A better tip title');
	});

	it('falls back to the hardcoded title when there is no experiment copy', () => {
		expect(call('basketDonationHeader', copyContext())).toBe('Help cover the cost of your loans');
		expect(call('basketDonationHeader', copyContext({ loanCount: 1 }))).toBe('Help cover the cost of your loan');
	});

	it('keeps the giving fund and no-loans titles', () => {
		const campaign = copyContext({ experimentCopy: vi.fn(() => 'A better tip title'), isCampaignDonation: true });
		expect(call('basketDonationHeader', campaign)).toBe('Donate to a giving fund');

		const noLoans = copyContext({ experimentCopy: vi.fn(() => 'A better tip title'), loanCount: 0 });
		expect(call('basketDonationHeader', noLoans)).toBe('Donate to Kiva');
	});

	it('lets the tip ask variant win over the experiment title', () => {
		const context = copyContext({ experimentCopy: vi.fn(() => 'A better tip title'), showTipAskVariant: true });
		expect(call('basketDonationHeader', context)).toBe(context.tipAskHeader);
	});

	describe('exposure tracking in created', () => {
		const createdContext = (overrides = {}) => {
			const context = {
				donation: { price: '25.00' },
				loanCount: 2,
				hasLoans: true,
				isCampaignDonation: false,
				showTipAskVariant: false,
				experimentTipTitle: 'A better tip title',
				experimentTipTagline: null,
				trackCopyExposure: vi.fn(),
				$kvTrackEvent: vi.fn(),
				...overrides,
			};
			// created() reads the computeds, so derive them from the context like the component would
			context.showsExperimentTipTitle = call('showsExperimentTipTitle', context);
			context.showsExperimentTipTagline = call('showsExperimentTipTagline', context);
			return context;
		};

		it('sends one exposure event when the experiment title is shown and the tip is above zero', () => {
			const context = createdContext();
			DonationItem.created.call(context);

			expect(context.trackCopyExposure).toHaveBeenCalledTimes(1);
			expect(context.trackCopyExposure).toHaveBeenCalledWith('basket', 'EXP-MP-3264-Oct2026');
		});

		it('sends one exposure event when only the tagline carries experiment copy', () => {
			const context = createdContext({ experimentTipTitle: null, experimentTipTagline: 'A better tagline' });
			DonationItem.created.call(context);

			expect(context.trackCopyExposure).toHaveBeenCalledTimes(1);
			expect(context.trackCopyExposure).toHaveBeenCalledWith('basket', 'EXP-MP-3264-Oct2026');
		});

		it.each([
			['a zero tip', { donation: { price: '0.00' } }],
			['a giving fund donation', { isCampaignDonation: true }],
			['the tip ask variant', { showTipAskVariant: true }],
			['a basket without loans', { hasLoans: false, loanCount: 0 }],
			['the hardcoded title', { experimentTipTitle: null }],
		])('sends no exposure for %s', (name, overrides) => {
			const context = createdContext(overrides);
			DonationItem.created.call(context);

			expect(context.trackCopyExposure).not.toHaveBeenCalled();
		});
	});

	it('builds the loan noun from the count', () => {
		expect(call('loanNoun', { loanCount: 1 })).toBe('loan');
		expect(call('loanNoun', { loanCount: 2 })).toBe('loans');
		expect(call('loanNoun', { loanCount: 0 })).toBe('loans');
	});

	it('asks for the subHeadline with the loans placeholder filled', () => {
		const experimentCopy = vi.fn(() => 'A better tagline');
		const context = copyContext({ experimentCopy });

		expect(context.experimentTipTagline).toBe('A better tagline');
		expect(experimentCopy).toHaveBeenCalledWith('subHeadline', { loans: 'loans' });
	});

	it('renders the experiment tagline for a basket with loans', () => {
		const context = copyContext({ experimentCopy: vi.fn(() => 'A better tagline') });
		expect(call('basketDonationTagline', context)).toBe('A better tagline');
	});

	it('falls back to the hardcoded tagline when there is no experiment copy', () => {
		expect(call('basketDonationTagline', copyContext())).toBe(
			// eslint-disable-next-line max-len
			'100% of your loan supports borrowers — we never take a fee. As a nonprofit, we rely on donations to advance our mission of expanding financial access.',
		);
	});

	it('keeps the no-loans tagline hardcoded even with experiment copy present', () => {
		const context = copyContext({ experimentCopy: vi.fn(() => 'A better tagline'), loanCount: 0 });
		expect(call('basketDonationTagline', context)).toBe(
			// eslint-disable-next-line max-len
			'100% of loans support borrowers — we never take a fee. As a nonprofit, we rely on donations to advance our mission of expanding financial access.',
		);
	});

	it('keeps the giving fund, tip ask and kiva card taglines', () => {
		const copy = vi.fn(() => 'A better tagline');
		const campaign = copyContext({ experimentCopy: copy, isCampaignDonation: true });
		// eslint-disable-next-line max-len
		expect(call('basketDonationTagline', campaign)).toBe('Your donation will be lent out to a critical impact area.');

		const tipAsk = copyContext({ experimentCopy: copy, showTipAskVariant: true });
		expect(call('basketDonationTagline', tipAsk)).toBe(tipAsk.tipAskTagline);

		const kivaCards = copyContext({ experimentCopy: copy, loanCount: 0, hasKivaCards: true });
		expect(call('basketDonationTagline', kivaCards)).toBe(
			// eslint-disable-next-line max-len
			'100% of your Kiva Card money goes to the people you support — we never take a fee. As a nonprofit, we rely on donations to advance our mission.',
		);
	});
});
