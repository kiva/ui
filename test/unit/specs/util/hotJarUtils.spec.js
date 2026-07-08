import { setHotJarUserAttributes, fireHotJarEvent, fireNewUserHotJarEvent } from '#src/util/hotJarUtils';

describe('hotJarUtils.js', () => {
	let mockHj;

	beforeEach(() => {
		mockHj = vi.fn();
		global.window = {
			hj: mockHj,
		};
	});

	describe('setHotJarUserAttributes', () => {
		it('should call window.hj with user identification data', () => {
			const userData = {
				userId: '12345',
				hasEverLoggedIn: true,
				hasLentBefore: true,
				hasDepositBefore: false,
			};

			setHotJarUserAttributes(userData);

			expect(mockHj).toHaveBeenCalledWith('identify', '12345', {
				'Has ever logged in': true,
				'Has lent before': true,
				'Has deposit before': false,
			});
		});

		it('should call window.hj twice when isFirstLoan is defined', () => {
			const userData = {
				userId: '67890',
				hasEverLoggedIn: true,
				hasLentBefore: false,
				hasDepositBefore: true,
				isFirstLoan: true,
				hasDirectLoan: true,
				hasCoreLoan: false,
			};

			setHotJarUserAttributes(userData);

			expect(mockHj).toHaveBeenCalledTimes(2);
			expect(mockHj).toHaveBeenNthCalledWith(1, 'identify', '67890', {
				'Has ever logged in': true,
				'Has lent before': false,
				'Has deposit before': true,
			});
			expect(mockHj).toHaveBeenNthCalledWith(2, 'identify', '67890', {
				'First loan': true,
				'Has direct loan': true,
				'Has core loan': false,
			});
		});

		it('should not call window.hj twice when isFirstLoan is undefined', () => {
			const userData = {
				userId: '11111',
				hasEverLoggedIn: false,
				hasLentBefore: false,
				hasDepositBefore: false,
			};

			setHotJarUserAttributes(userData);

			expect(mockHj).toHaveBeenCalledTimes(1);
		});

		it('should not throw when window is undefined', () => {
			delete global.window;

			expect(() => setHotJarUserAttributes({ userId: '123' })).not.toThrow();
		});

		it('should not throw when window.hj is undefined', () => {
			global.window.hj = undefined;

			expect(() => setHotJarUserAttributes({ userId: '123' })).not.toThrow();
		});

		it('should handle isFirstLoan being false', () => {
			const userData = {
				userId: '99999',
				hasEverLoggedIn: true,
				hasLentBefore: true,
				hasDepositBefore: true,
				isFirstLoan: false,
				hasDirectLoan: false,
				hasCoreLoan: true,
			};

			setHotJarUserAttributes(userData);

			expect(mockHj).toHaveBeenCalledTimes(2);
			expect(mockHj).toHaveBeenNthCalledWith(2, 'identify', '99999', {
				'First loan': false,
				'Has direct loan': false,
				'Has core loan': true,
			});
		});

		it('should coerce undefined hasEverLoggedIn to false', () => {
			const userData = {
				userId: '22222',
				hasLentBefore: true,
				hasDepositBefore: true,
			};

			setHotJarUserAttributes(userData);

			expect(mockHj).toHaveBeenCalledWith('identify', '22222', {
				'Has ever logged in': false,
				'Has lent before': true,
				'Has deposit before': true,
			});
		});

		it('should coerce all user attributes to false when undefined', () => {
			const userData = { userId: '33333' };

			setHotJarUserAttributes(userData);

			expect(mockHj).toHaveBeenCalledWith('identify', '33333', {
				'Has ever logged in': false,
				'Has lent before': false,
				'Has deposit before': false,
			});
		});

		it('should coerce loan attributes to false when undefined', () => {
			const userData = {
				userId: '44444',
				hasEverLoggedIn: true,
				hasLentBefore: true,
				hasDepositBefore: true,
				isFirstLoan: true,
			};

			setHotJarUserAttributes(userData);

			expect(mockHj).toHaveBeenCalledTimes(2);
			expect(mockHj).toHaveBeenNthCalledWith(2, 'identify', '44444', {
				'First loan': true,
				'Has direct loan': false,
				'Has core loan': false,
			});
		});

		it('should coerce null attributes to false', () => {
			const userData = {
				userId: '55555',
				hasEverLoggedIn: null,
				hasLentBefore: null,
				hasDepositBefore: null,
				isFirstLoan: true,
				hasDirectLoan: null,
				hasCoreLoan: null,
			};

			setHotJarUserAttributes(userData);

			expect(mockHj).toHaveBeenCalledTimes(2);
			expect(mockHj).toHaveBeenNthCalledWith(1, 'identify', '55555', {
				'Has ever logged in': false,
				'Has lent before': false,
				'Has deposit before': false,
			});
			expect(mockHj).toHaveBeenNthCalledWith(2, 'identify', '55555', {
				'First loan': true,
				'Has direct loan': false,
				'Has core loan': false,
			});
		});
	});

	describe('fireHotJarEvent', () => {
		it('should call window.hj with event name', () => {
			fireHotJarEvent('loan_checkout');

			expect(mockHj).toHaveBeenCalledWith('event', 'loan_checkout');
		});

		it('should handle different event names', () => {
			fireHotJarEvent('basket_add');

			expect(mockHj).toHaveBeenCalledWith('event', 'basket_add');
		});

		it('should not throw when window is undefined', () => {
			delete global.window;

			expect(() => fireHotJarEvent('test_event')).not.toThrow();
		});

		it('should not throw when window.hj is undefined', () => {
			global.window.hj = undefined;

			expect(() => fireHotJarEvent('test_event')).not.toThrow();
		});
	});

	describe('fireNewUserHotJarEvent', () => {
		it('should fire the new_user event when the user has never logged in', () => {
			fireNewUserHotJarEvent(false);

			expect(mockHj).toHaveBeenCalledWith('event', 'new_user');
		});

		it('should not fire the event when the user has logged in before', () => {
			fireNewUserHotJarEvent(true);

			expect(mockHj).not.toHaveBeenCalled();
		});

		it('should not fire the event when hasEverLoggedIn is unknown (undefined)', () => {
			fireNewUserHotJarEvent(undefined);

			expect(mockHj).not.toHaveBeenCalled();
		});

		it('should not throw when window.hj is undefined', () => {
			global.window.hj = undefined;

			expect(() => fireNewUserHotJarEvent(false)).not.toThrow();
		});
	});
});
