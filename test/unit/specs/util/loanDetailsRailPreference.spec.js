import store2 from 'store2';
import {
	RAIL_PREF_KEY,
	getLocalRailPreference,
	setLocalRailPreference,
	readAccountRailPreference,
	resolveRailPreference,
	persistRailPreference,
} from '#src/util/loanDetailsRailPreference';
import * as userPreferenceUtils from '#src/util/userPreferenceUtils';

vi.mock('#src/util/userPreferenceUtils', () => ({
	createUserPreferences: vi.fn().mockResolvedValue({}),
	updateUserPreferences: vi.fn().mockResolvedValue({}),
}));

afterEach(() => {
	store2.remove(RAIL_PREF_KEY);
	vi.clearAllMocks();
});

describe('loanDetailsRailPreference', () => {
	it('key is showLoanDetailsInRail', () => {
		expect(RAIL_PREF_KEY).toBe('showLoanDetailsInRail');
	});

	it('localStorage read returns null when unset, boolean when set', () => {
		expect(getLocalRailPreference()).toBe(null);
		setLocalRailPreference(true);
		expect(getLocalRailPreference()).toBe(true);
		setLocalRailPreference(false);
		expect(getLocalRailPreference()).toBe(false);
	});

	it('reads the account preference from a userPreferences node', () => {
		expect(readAccountRailPreference(null)).toBe(null);
		expect(readAccountRailPreference({ preferences: '{}' })).toBe(null);
		expect(readAccountRailPreference({ preferences: '{"showLoanDetailsInRail":true}' })).toBe(true);
		expect(readAccountRailPreference({ preferences: 'not json' })).toBe(null);
	});

	describe('resolveRailPreference precedence', () => {
		it('account preference wins over localStorage', () => {
			expect(resolveRailPreference({ accountPref: false, local: true })).toBe(false);
			expect(resolveRailPreference({ accountPref: true, local: false })).toBe(true);
		});

		it('falls back to localStorage when no account preference', () => {
			expect(resolveRailPreference({ accountPref: null, local: true })).toBe(true);
			expect(resolveRailPreference({ accountPref: null, local: false })).toBe(false);
		});

		it('defaults to false when nothing is set', () => {
			expect(resolveRailPreference({ accountPref: null, local: null })).toBe(false);
			expect(resolveRailPreference()).toBe(false);
		});
	});

	describe('persistRailPreference', () => {
		it('always writes localStorage and skips the account when there is no my context', async () => {
			await persistRailPreference(null, { value: true, my: null });
			expect(getLocalRailPreference()).toBe(true);
			expect(userPreferenceUtils.createUserPreferences).not.toHaveBeenCalled();
			expect(userPreferenceUtils.updateUserPreferences).not.toHaveBeenCalled();
		});

		it('creates account prefs when logged in with no existing record', async () => {
			const apollo = {};
			await persistRailPreference(apollo, { value: true, my: { id: 1, userPreferences: null } });
			expect(getLocalRailPreference()).toBe(true);
			expect(userPreferenceUtils.createUserPreferences)
				.toHaveBeenCalledWith(apollo, { showLoanDetailsInRail: true });
		});

		it('merge-updates account prefs when a record already exists', async () => {
			const apollo = {};
			const my = { id: 1, userPreferences: { id: 7, preferences: '{"goals":[1]}' } };
			await persistRailPreference(apollo, { value: false, my });
			expect(userPreferenceUtils.updateUserPreferences).toHaveBeenCalledWith(
				apollo,
				my.userPreferences,
				{ goals: [1] },
				{ showLoanDetailsInRail: false },
			);
		});
	});
});
