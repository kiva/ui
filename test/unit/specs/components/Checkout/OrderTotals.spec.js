import OrderTotals from '#src/components/Checkout/OrderTotals';

// The displayed Kiva Credit total states the net hit to the lender's balance, so it plus the amount
// due comes to the basket total. When the lender pays the tip with new money, the backend floors the
// amount due at the tip, and that deposit is spent again as credit - so the balance only funds the
// non-tip items. Every other case shows the applied credit as-is.
describe('OrderTotals appliedKivaCredit', () => {
	const appliedKivaCredit = context => OrderTotals.computed.appliedKivaCredit.call(context);

	// $25 loan + $5 tip
	const totals = ({ applied, loans = '25.00', kivaCards = '0.00' }) => ({
		kivaCreditAppliedTotal: applied,
		loanReservationTotal: loans,
		kivaCardTotal: kivaCards,
	});

	it('shows the applied credit when the lender pays the tip from their balance', () => {
		const context = { totals: totals({ applied: '30.00' }), applyKivaCreditToDonation: true };

		expect(appliedKivaCredit(context)).toBe(30);
	});

	it('shows the applied credit when the lender has never chosen', () => {
		const context = { totals: totals({ applied: '30.00' }), applyKivaCreditToDonation: null };

		expect(appliedKivaCredit(context)).toBe(30);
	});

	it('excludes the deposited tip when the lender pays it with new money', () => {
		const context = { totals: totals({ applied: '30.00' }), applyKivaCreditToDonation: false };

		// $5 arrives as a deposit and is spent again as credit, so only the $25 loan comes off the balance
		expect(appliedKivaCredit(context)).toBe(25);
	});

	it('excludes only the floored part when the balance nearly covers the basket', () => {
		const context = { totals: totals({ applied: '27.00' }), applyKivaCreditToDonation: false };

		expect(appliedKivaCredit(context)).toBe(25);
	});

	it('leaves a real shortfall alone', () => {
		// Balance below the loan total, so the amount due is a genuine shortfall rather than the tip floor
		const context = { totals: totals({ applied: '20.00' }), applyKivaCreditToDonation: false };

		expect(appliedKivaCredit(context)).toBe(20);
	});

	it('counts kiva cards alongside loans as non-tip items', () => {
		const context = {
			totals: totals({ applied: '55.00', kivaCards: '25.00' }),
			applyKivaCreditToDonation: false,
		};

		expect(appliedKivaCredit(context)).toBe(50);
	});

	it('reports no balance spent on a donation-only basket', () => {
		const context = {
			totals: totals({ applied: '5.00', loans: '0.00' }),
			applyKivaCreditToDonation: false,
		};

		// The whole tip is deposited and spent again, so the balance is untouched
		expect(appliedKivaCredit(context)).toBe(0);
	});

	it('treats missing totals as zero rather than NaN', () => {
		const context = { totals: {}, applyKivaCreditToDonation: false };

		expect(appliedKivaCredit(context)).toBe(0);
	});
});
