import DonationItem from '#src/components/Checkout/DonationItem';

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

	// The compressed layout only earns its place when there is a switch to make room for, and
	// at a zero tip the row shares space with the donate-repayments prompt instead
	it('stays off at a zero tip, where there is no switch to make room for', () => {
		expect(showVariant({
			tipFromBalanceEligible: true,
			canHostTipFromBalanceToggle: true,
			tip: '0.00',
		})).toBe(false);
	});
});
