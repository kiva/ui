import KvClassicLoanCardContainer from '#src/components/LoanCards/KvClassicLoanCardContainer';

// Verify AI pills flow into the loan card's callouts. Exercised at the computed
// level to keep the focus on the callout logic rather than the full card mount.
describe('KvClassicLoanCardContainer.vue AI pills', () => {
	const { showAiLoanPills, customCallouts } = KvClassicLoanCardContainer.computed;

	it('surfaces AI pills as custom callouts when present', () => {
		const context = { aiPills: ['Woman-led', 'Agriculture'] };
		context.showAiLoanPills = showAiLoanPills.call(context);

		expect(context.showAiLoanPills).toBe(true);
		expect(customCallouts.call(context)).toEqual(['Woman-led', 'Agriculture']);
	});

	it('renders no custom callouts when there are no AI pills', () => {
		const context = { aiPills: [] };
		context.showAiLoanPills = showAiLoanPills.call(context);

		expect(context.showAiLoanPills).toBe(false);
		expect(customCallouts.call(context)).toEqual([]);
	});
});
