import DonationItem from '#src/components/Checkout/DonationItem';

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
			"100% of your $25 goes to Maria's loan — your tip helps Kiva get it there.",
		],
		[
			'two loans',
			{ names: ['Maria', 'Joice'], loanCount: 2, loanReservationTotal: 50 },
			"Cover the cost of Maria and Joice's loans?",
			'100% of your $50 goes toward these loans — your tip helps Kiva get it there.',
		],
		[
			'three loans',
			{ names: ['Maria', 'Joice', 'Ana'], loanCount: 3, loanReservationTotal: 75 },
			"Cover the cost of Maria's loan and 2 others?",
			'100% of your $75 goes toward these loans — your tip helps Kiva get it there.',
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
			.toBe("100% of your $27.50 goes to Maria's loan — your tip helps Kiva get it there.");
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

describe('DonationItem showTipFromBalanceVariant', () => {
	const showVariant = ({ tip = '3.75', ...context }) => DonationItem.computed
		.showTipFromBalanceVariant.call({ donation: { price: tip }, ...context });

	it('shows the variant styling in the treatment arm', () => {
		expect(showVariant({
			tipFromBalanceVersion: 'b',
			canHostTipFromBalanceToggle: true,
		})).toBe(true);
	});

	it.each([
		['control', 'a'],
		['an unassigned lender', null],
	])('keeps the existing styling for %s', (label, version) => {
		expect(showVariant({
			tipFromBalanceVersion: version,
			canHostTipFromBalanceToggle: true,
		})).toBe(false);
	});

	it('stays off wherever the toggle cannot be hosted, even in the variant', () => {
		expect(showVariant({
			tipFromBalanceVersion: 'b',
			canHostTipFromBalanceToggle: false,
		})).toBe(false);
	});

	// The compressed layout only earns its place when there is a switch to make room for, and
	// at a zero tip the row shares space with the donate-repayments prompt instead
	it('stays off at a zero tip, where there is no switch to make room for', () => {
		expect(showVariant({
			tipFromBalanceVersion: 'b',
			canHostTipFromBalanceToggle: true,
			tip: '0.00',
		})).toBe(false);
	});
});
