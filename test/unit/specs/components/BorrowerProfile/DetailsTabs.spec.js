import DetailsTabs from '#src/components/BorrowerProfile/DetailsTabs';

describe('DetailsTabs condensed prefixes', () => {
	const callComputed = (name, condensed) => DetailsTabs.computed[name].call({ condensed });

	it('uses default prefixes when not condensed', () => {
		expect(callComputed('tabIdPrefix', false)).toBe('tab-panel');
		expect(callComputed('testidPrefix', false)).toBe('bp-detail');
		expect(callComputed('trackPrefix', false)).toBe('click');
	});

	it('uses rail prefixes when condensed', () => {
		expect(callComputed('tabIdPrefix', true)).toBe('rail-tab-panel');
		expect(callComputed('testidPrefix', true)).toBe('bp-detail-rail');
		expect(callComputed('trackPrefix', true)).toBe('click-rail');
	});

	it('composes prefix + name into tab panel ids (so main and rail never collide)', () => {
		expect(DetailsTabs.computed.loanTabId.call({ tabIdPrefix: 'tab-panel', name: 'bp-details' }))
			.toBe('tab-panel-bp-details-loan-details');
		expect(DetailsTabs.computed.loanTabId.call({ tabIdPrefix: 'rail-tab-panel', name: 'bp-rail-details' }))
			.toBe('rail-tab-panel-bp-rail-details-loan-details');
	});
});

describe('DetailsTabs discriminator', () => {
	const { computed } = DetailsTabs;

	it('treats a LoanPartner as a partner loan', () => {
		expect(computed.isPartnerLoan.call({ loanType: 'LoanPartner' })).toBe(true);
		expect(computed.isPartnerLoan.call({ loanType: 'LoanDirect' })).toBe(false);
	});

	it('shows the trustee tab only for a direct loan with a trustee', () => {
		expect(computed.hasTrustee.call({ loanType: 'LoanDirect', trusteeName: 'Accion' })).toBe(true);
		expect(computed.hasTrustee.call({ loanType: 'LoanDirect', trusteeName: '' })).toBe(false);
		expect(computed.hasTrustee.call({ loanType: 'LoanPartner', trusteeName: 'Accion' })).toBe(false);
	});

	it('detects the no-trustee endorsement state', () => {
		expect(computed.noTrusteeState.call({ trusteeName: 'No Trustee Endorsement' })).toBe(true);
		expect(computed.noTrusteeState.call({ trusteeName: 'Accion' })).toBe(false);
	});
});

describe('DetailsTabs showDefinition', () => {
	it('forwards cid/sfid to the injected opener with forceSalesforce and a tracking tuple', () => {
		const openDefinition = vi.fn();
		DetailsTabs.methods.showDefinition.call(
			{ openDefinition, useSalesForce: true },
			{
				cid: 'bp-def-loan-length', sfid: 'sf-1', panelName: 'Loan-Details', linkText: 'Loan length',
			},
		);

		expect(openDefinition).toHaveBeenCalledWith({
			cid: 'bp-def-loan-length',
			sfid: 'sf-1',
			forceSalesforce: true,
			track: ['Borrower Profile', 'click-Loan-Details-tab-definition-link', 'Loan length'],
		});
	});
});
