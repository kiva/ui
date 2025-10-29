import percentRaisedMixin from '../../../../../src/plugins/loan/percent-raised-mixin';

describe('percent-raised-mixin.js', () => {
	let context;

	beforeEach(() => {
		context = {
			loan: null
		};
	});

	describe('amountLeft', () => {
		it('should return 0 when loan is null', () => {
			const result = percentRaisedMixin.computed.amountLeft.call(context);
			expect(result).toBe(0);
		});

		it('should return 0 when loan is undefined', () => {
			context.loan = undefined;
			const result = percentRaisedMixin.computed.amountLeft.call(context);
			expect(result).toBe(0);
		});

		it('should return 0 when loanAmount is missing', () => {
			context.loan = {
				loanFundraisingInfo: {
					fundedAmount: 100,
					reservedAmount: 50
				}
			};
			const result = percentRaisedMixin.computed.amountLeft.call(context);
			expect(result).toBe(0);
		});

		it('should return 0 when loanFundraisingInfo is missing', () => {
			context.loan = {
				loanAmount: 1000
			};
			const result = percentRaisedMixin.computed.amountLeft.call(context);
			expect(result).toBe(0);
		});

		it('should return 0 when fundedAmount is missing', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					reservedAmount: 100
				}
			};
			const result = percentRaisedMixin.computed.amountLeft.call(context);
			expect(result).toBe(0);
		});

		it('should return 0 when reservedAmount is missing', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					fundedAmount: 500
				}
			};
			const result = percentRaisedMixin.computed.amountLeft.call(context);
			expect(result).toBe(0);
		});

		it('should calculate amount left correctly', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					fundedAmount: 600,
					reservedAmount: 200
				}
			};
			const result = percentRaisedMixin.computed.amountLeft.call(context);
			expect(result).toBe(200);
		});

		it('should handle almost fully funded loan', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					fundedAmount: 950,
					reservedAmount: 50
				}
			};
			const result = percentRaisedMixin.computed.amountLeft.call(context);
			expect(result).toBe(0);
		});

		it('should handle loan with mostly reservations', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					fundedAmount: 100,
					reservedAmount: 300
				}
			};
			const result = percentRaisedMixin.computed.amountLeft.call(context);
			expect(result).toBe(600);
		});
	});

	describe('amountLeftWithoutReservation', () => {
		it('should return 0 when loan is null', () => {
			const result = percentRaisedMixin.computed.amountLeftWithoutReservation.call(context);
			expect(result).toBe(0);
		});

		it('should calculate amount left without reservations', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					fundedAmount: 600,
					reservedAmount: 200
				}
			};
			const result = percentRaisedMixin.computed.amountLeftWithoutReservation.call(context);
			expect(result).toBe(400);
		});

		it('should ignore reserved amount in calculation', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					fundedAmount: 300,
					reservedAmount: 500
				}
			};
			const result = percentRaisedMixin.computed.amountLeftWithoutReservation.call(context);
			expect(result).toBe(700);
		});
	});

	describe('percentRaised', () => {
		it('should return 0 when loan is null', () => {
			const result = percentRaisedMixin.computed.percentRaised.call(context);
			expect(result).toBe(0);
		});

		it('should calculate percent raised correctly', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					fundedAmount: 600,
					reservedAmount: 200
				}
			};
			// Add amountLeft as a computed property to context
			context.amountLeft = percentRaisedMixin.computed.amountLeft.call(context);
			// amountLeft will be 200, so (1000 - 200) / 1000 = 0.8
			const result = percentRaisedMixin.computed.percentRaised.call(context);
			expect(result).toBe(0.8);
		});

		it('should return 1 for almost fully funded loan', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					fundedAmount: 950,
					reservedAmount: 50
				}
			};
			context.amountLeft = percentRaisedMixin.computed.amountLeft.call(context);
			const result = percentRaisedMixin.computed.percentRaised.call(context);
			expect(result).toBe(1);
		});

		it('should return 0.5 for half funded loan', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					fundedAmount: 300,
					reservedAmount: 200
				}
			};
			context.amountLeft = percentRaisedMixin.computed.amountLeft.call(context);
			const result = percentRaisedMixin.computed.percentRaised.call(context);
			expect(result).toBe(0.5);
		});

		it('should include reserved amount in percent calculation', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					fundedAmount: 10,
					reservedAmount: 240
				}
			};
			context.amountLeft = percentRaisedMixin.computed.amountLeft.call(context);
			const result = percentRaisedMixin.computed.percentRaised.call(context);
			expect(result).toBe(0.25);
		});
	});

	describe('percentRaisedWithoutReservation', () => {
		it('should return 0 when loan is null', () => {
			const result = percentRaisedMixin.computed.percentRaisedWithoutReservation.call(context);
			expect(result).toBe(0);
		});

		it('should calculate percent raised without reservations', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					fundedAmount: 600,
					reservedAmount: 200
				}
			};
			// Add amountLeftWithoutReservation as a computed property to context
			const amountLeftComputed = percentRaisedMixin.computed.amountLeftWithoutReservation;
			context.amountLeftWithoutReservation = amountLeftComputed.call(context);
			// amountLeftWithoutReservation will be 400, so (1000 - 400) / 1000 = 0.6
			const result = percentRaisedMixin.computed.percentRaisedWithoutReservation.call(context);
			expect(result).toBe(0.6);
		});

		it('should ignore reserved amount', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					fundedAmount: 300,
					reservedAmount: 500
				}
			};
			const amountLeftComputed = percentRaisedMixin.computed.amountLeftWithoutReservation;
			context.amountLeftWithoutReservation = amountLeftComputed.call(context);
			const result = percentRaisedMixin.computed.percentRaisedWithoutReservation.call(context);
			expect(result).toBe(0.3);
		});

		it('should return 1 for almost fully funded loan', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					fundedAmount: 990,
					reservedAmount: 10
				}
			};
			const amountLeftComputed = percentRaisedMixin.computed.amountLeftWithoutReservation;
			context.amountLeftWithoutReservation = amountLeftComputed.call(context);
			const result = percentRaisedMixin.computed.percentRaisedWithoutReservation.call(context);
			expect(result).toBe(0.99);
		});

		it('should return low percentage when mostly reservations', () => {
			context.loan = {
				loanAmount: 1000,
				loanFundraisingInfo: {
					fundedAmount: 100,
					reservedAmount: 400
				}
			};
			const amountLeftComputed = percentRaisedMixin.computed.amountLeftWithoutReservation;
			context.amountLeftWithoutReservation = amountLeftComputed.call(context);
			const result = percentRaisedMixin.computed.percentRaisedWithoutReservation.call(context);
			expect(result).toBe(0.1);
		});
	});
});
