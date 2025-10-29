import activeLoanMixin from '../../../../src/plugins/active-loan-mixin';

// Mock the GraphQL mutation
vi.mock('#src/graphql/mutation/updateActiveLoan.graphql', () => ({
	default: 'MOCK_UPDATE_ACTIVE_LOAN_MUTATION'
}));

vi.mock('#src/util/injectionCheck', () => ({
	default: vi.fn()
}));

describe('active-loan-mixin.js', () => {
	let context;
	let mockApollo;

	beforeEach(() => {
		mockApollo = {
			mutate: vi.fn().mockResolvedValue({})
		};

		// Create a mock context simulating a Vue component
		context = {
			apollo: mockApollo,
		};

		// Apply mixin data - create a new copy each time to avoid mutation issues
		if (activeLoanMixin.data) {
			const data = activeLoanMixin.data.call(context);
			// Deep copy the activeLoan to avoid shared object mutations
			context.activeLoan = JSON.parse(JSON.stringify(data.activeLoan));
		}

		// Bind computed properties
		if (activeLoanMixin.computed) {
			Object.keys(activeLoanMixin.computed).forEach(key => {
				Object.defineProperty(context, key, {
					get: activeLoanMixin.computed[key].bind(context),
					enumerable: true,
					configurable: true
				});
			});
		}

		// Bind methods
		Object.assign(context, activeLoanMixin.methods);
	});

	describe('data', () => {
		it('should initialize with empty activeLoan object', () => {
			expect(context.activeLoan).toBeDefined();
			expect(context.activeLoan.xCoordinate).toBe(0);
			expect(context.activeLoan.yCoordinate).toBe(0);
			expect(context.activeLoan.hoverLoanId).toBe(0);
		});

		it('should have loan as stringified JSON', () => {
			expect(typeof context.activeLoan.loan).toBe('string');
			const parsed = JSON.parse(context.activeLoan.loan);
			expect(parsed).toHaveProperty('activity');
			expect(parsed).toHaveProperty('userProperties');
			expect(parsed).toHaveProperty('loanFundraisingInfo');
			expect(parsed).toHaveProperty('geocode');
			expect(parsed).toHaveProperty('image');
		});

		it('should have tracking as stringified JSON', () => {
			expect(typeof context.activeLoan.tracking).toBe('string');
			const parsed = JSON.parse(context.activeLoan.tracking);
			expect(parsed).toEqual({});
		});
	});

	describe('computed properties', () => {
		it('hoverLoan should parse loan JSON string', () => {
			const loanData = {
				id: 123,
				name: 'Test Loan',
				activity: { name: 'Farming' }
			};
			context.activeLoan.loan = JSON.stringify(loanData);

			expect(context.hoverLoan).toEqual(loanData);
		});

		it('hoverLoan should return empty object for invalid JSON', () => {
			context.activeLoan.loan = 'invalid json';

			expect(context.hoverLoan).toEqual({});
		});

		it('hoverLoanId should return hoverLoanId from activeLoan', () => {
			context.activeLoan.hoverLoanId = 456;

			expect(context.hoverLoanId).toBe(456);
		});

		it('hoverLoanXCoordinate should return xCoordinate from activeLoan', () => {
			context.activeLoan.xCoordinate = 100;

			expect(context.hoverLoanXCoordinate).toBe(100);
		});

		it('hoverLoanYCoordinate should return yCoordinate from activeLoan', () => {
			context.activeLoan.yCoordinate = 200;

			expect(context.hoverLoanYCoordinate).toBe(200);
		});

		it('tracking should parse tracking JSON string', () => {
			const trackingData = { source: 'map', category: 'agriculture' };
			context.activeLoan.tracking = JSON.stringify(trackingData);

			expect(context.tracking).toEqual(trackingData);
		});

		it('tracking should return empty object for invalid JSON', () => {
			context.activeLoan.tracking = 'invalid json';

			expect(context.tracking).toEqual({});
		});
	});

	describe('methods', () => {
		describe('setHoverLoan', () => {
			it('should call apollo.mutate with correct variables', () => {
				const params = {
					xCoordinate: 150,
					yCoordinate: 250,
					hoverLoanId: 789,
					loan: JSON.stringify({ name: 'New Loan' }),
					tracking: JSON.stringify({ source: 'search' })
				};

				context.setHoverLoan(params);

				expect(mockApollo.mutate).toHaveBeenCalledWith({
					mutation: 'MOCK_UPDATE_ACTIVE_LOAN_MUTATION',
					variables: {
						xCoordinate: 150,
						yCoordinate: 250,
						hoverLoanId: 789,
						loan: params.loan,
						tracking: params.tracking
					}
				});
			});
		});

		describe('clearHoverLoan', () => {
			it('should call apollo.mutate with empty activeLoan variables', () => {
				context.clearHoverLoan();

				const call = mockApollo.mutate.mock.calls[0][0];

				expect(call.mutation).toBe('MOCK_UPDATE_ACTIVE_LOAN_MUTATION');
				expect(call.variables.xCoordinate).toBe(0);
				expect(call.variables.yCoordinate).toBe(0);
				expect(call.variables.hoverLoanId).toBe(0);

				// Verify the loan structure is empty
				const loanData = JSON.parse(call.variables.loan);
				expect(loanData.activity).toEqual({});
				expect(loanData.userProperties).toEqual({});
				expect(loanData.loanFundraisingInfo).toEqual({});
				expect(loanData.geocode).toEqual({ country: {} });
				expect(loanData.image).toEqual({});

				// Verify tracking is empty
				const trackingData = JSON.parse(call.variables.tracking);
				expect(trackingData).toEqual({});
			});
		});
	});
});
