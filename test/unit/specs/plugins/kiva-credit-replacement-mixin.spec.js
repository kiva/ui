import kivaCreditReplacementMixin from '#src/plugins/kiva-credit-replacement-mixin';

describe('kiva-credit-replacement-mixin.js', () => {
	describe('props', () => {
		it('should define isKivaCreditReplacementExpEnabled prop with default false', () => {
			expect(kivaCreditReplacementMixin.props.isKivaCreditReplacementExpEnabled).toBeDefined();
			expect(kivaCreditReplacementMixin.props.isKivaCreditReplacementExpEnabled.type).toBe(Boolean);
			expect(kivaCreditReplacementMixin.props.isKivaCreditReplacementExpEnabled.default).toBe(false);
		});
	});

	describe('computed', () => {
		describe('isKivaCreditText', () => {
			it('should return "Account balance" when replacement experiment is enabled', () => {
				const context = {
					isKivaCreditReplacementExpEnabled: true
				};

				const result = kivaCreditReplacementMixin.computed.isKivaCreditText.call(context);

				expect(result).toBe('Account balance');
			});

			it('should return "Kiva Credit" when replacement experiment is disabled', () => {
				const context = {
					isKivaCreditReplacementExpEnabled: false
				};

				const result = kivaCreditReplacementMixin.computed.isKivaCreditText.call(context);

				expect(result).toBe('Kiva Credit');
			});
		});
	});
});
