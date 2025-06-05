import { userBalanceData } from '#src/esiTags/globalData/userBalance';

describe('userBalanceData', () => {
	it('returns formatted balance for normal value', () => {
		const data = { my: { userAccount: { balance: '123.45' } } };
		const result = userBalanceData(data);
		expect(result['user-balance']).toBe('"$123"');
	});

	it('returns $0 for missing balance', () => {
		const data = { my: { userAccount: {} } };
		const result = userBalanceData(data);
		expect(result['user-balance']).toBe('"$0"');
	});

	it('returns $0 for missing userAccount', () => {
		const data = { my: {} };
		const result = userBalanceData(data);
		expect(result['user-balance']).toBe('"$0"');
	});

	it('returns $0 for missing my', () => {
		const data = {};
		const result = userBalanceData(data);
		expect(result['user-balance']).toBe('"$0"');
	});
});
