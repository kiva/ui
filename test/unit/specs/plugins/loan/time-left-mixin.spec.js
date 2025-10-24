import timeLeftMixin from '#src/plugins/loan/time-left-mixin';

describe('time-left-mixin.js', () => {
	let context;
	let mockNow;

	beforeEach(() => {
		// Set mock current time to 2024-01-01 12:00:00
		mockNow = new Date('2024-01-01T12:00:00Z').getTime();
		vi.spyOn(Date, 'now').mockReturnValue(mockNow);

		context = {
			loan: null
		};
	});

	describe('timeLeftMessage', () => {
		it('should return empty string when loan is null', () => {
			const result = timeLeftMixin.computed.timeLeftMessage.call(context);
			expect(result).toBe('');
		});

		it('should return empty string when loan is undefined', () => {
			context.loan = undefined;
			const result = timeLeftMixin.computed.timeLeftMessage.call(context);
			expect(result).toBe('');
		});

		it('should return empty string when plannedExpirationDate is missing', () => {
			context.loan = {};
			const result = timeLeftMixin.computed.timeLeftMessage.call(context);
			expect(result).toBe('');
		});

		it('should return "{days} days left" when >= 6 days remaining', () => {
			// 7 days in the future
			const expirationDate = new Date('2024-01-08T12:00:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			const result = timeLeftMixin.computed.timeLeftMessage.call(context);
			expect(result).toBe('7 days left');
		});

		it('should return "{days} days left" when exactly 6 days remaining', () => {
			const expirationDate = new Date('2024-01-07T12:00:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			const result = timeLeftMixin.computed.timeLeftMessage.call(context);
			expect(result).toBe('6 days left');
		});

		it('should return "Only {days} days left! " when 5 days remaining', () => {
			const expirationDate = new Date('2024-01-06T12:00:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			const result = timeLeftMixin.computed.timeLeftMessage.call(context);
			expect(result).toBe('Only 5 days left! ');
		});

		it('should return "Only {days} days left! " when 2 days remaining', () => {
			const expirationDate = new Date('2024-01-03T12:00:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			const result = timeLeftMixin.computed.timeLeftMessage.call(context);
			expect(result).toBe('Only 2 days left! ');
		});

		it('should return "Only {hours} hours left! " when 23 hours remaining', () => {
			// 1 day and 11 hours in the future (23 hours from the 12-hour mark)
			const expirationDate = new Date('2024-01-02T11:00:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			const result = timeLeftMixin.computed.timeLeftMessage.call(context);
			expect(result).toBe('Only 23 hours left! ');
		});

		it('should return "Only {hours} hours left! " when 2 hours remaining', () => {
			const expirationDate = new Date('2024-01-01T14:00:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			const result = timeLeftMixin.computed.timeLeftMessage.call(context);
			expect(result).toBe('Only 2 hours left! ');
		});

		it('should return "Only {minutes} minutes left! " when 59 minutes remaining', () => {
			const expirationDate = new Date('2024-01-01T12:59:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			const result = timeLeftMixin.computed.timeLeftMessage.call(context);
			expect(result).toBe('Only 59 minutes left! ');
		});

		it('should return "Only {minutes} minutes left! " when 2 minutes remaining', () => {
			const expirationDate = new Date('2024-01-01T12:02:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			const result = timeLeftMixin.computed.timeLeftMessage.call(context);
			expect(result).toBe('Only 2 minutes left! ');
		});

		it('should return "Ending now!" when 1 minute remaining', () => {
			const expirationDate = new Date('2024-01-01T12:01:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			const result = timeLeftMixin.computed.timeLeftMessage.call(context);
			expect(result).toBe('Ending now!');
		});

		it('should return "Ending now!" when less than 1 minute remaining', () => {
			const expirationDate = new Date('2024-01-01T12:00:30Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			const result = timeLeftMixin.computed.timeLeftMessage.call(context);
			expect(result).toBe('Ending now!');
		});

		it('should return "Ending now!" when date is in the past', () => {
			const expirationDate = new Date('2023-12-31T12:00:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			const result = timeLeftMixin.computed.timeLeftMessage.call(context);
			expect(result).toBe('Ending now!');
		});
	});

	describe('expiringSoonMessage', () => {
		it('should return empty string when loan is null', () => {
			const result = timeLeftMixin.computed.expiringSoonMessage.call(context);
			expect(result).toBe('');
		});

		it('should return empty string when >= 6 days remaining', () => {
			const expirationDate = new Date('2024-01-07T12:00:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			const result = timeLeftMixin.computed.expiringSoonMessage.call(context);
			expect(result).toBe('');
		});

		it('should return empty string when > 6 days remaining', () => {
			const expirationDate = new Date('2024-01-10T12:00:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			const result = timeLeftMixin.computed.expiringSoonMessage.call(context);
			expect(result).toBe('');
		});

		it('should return timeLeftMessage when < 6 days remaining', () => {
			const expirationDate = new Date('2024-01-06T12:00:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			// Add timeLeftMessage as a computed property to context
			context.timeLeftMessage = timeLeftMixin.computed.timeLeftMessage.call(context);
			const result = timeLeftMixin.computed.expiringSoonMessage.call(context);
			expect(result).toBe('Only 5 days left! ');
		});

		it('should return timeLeftMessage when only hours remaining', () => {
			const expirationDate = new Date('2024-01-01T14:00:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			// Add timeLeftMessage as a computed property to context
			context.timeLeftMessage = timeLeftMixin.computed.timeLeftMessage.call(context);
			const result = timeLeftMixin.computed.expiringSoonMessage.call(context);
			expect(result).toBe('Only 2 hours left! ');
		});

		it('should return "Ending now!" when expired', () => {
			const expirationDate = new Date('2023-12-31T12:00:00Z').toISOString();
			context.loan = {
				plannedExpirationDate: expirationDate
			};
			// Add timeLeftMessage as a computed property to context
			context.timeLeftMessage = timeLeftMixin.computed.timeLeftMessage.call(context);
			const result = timeLeftMixin.computed.expiringSoonMessage.call(context);
			expect(result).toBe('Ending now!');
		});
	});
});
