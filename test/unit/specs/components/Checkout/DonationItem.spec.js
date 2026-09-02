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

describe('DonationItem showTipFromBalanceVariant', () => {
	const showVariant = context => DonationItem.computed.showTipFromBalanceVariant.call(context);

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
});
