import AutolendProfile, {
	getCacheableProfile,
	getInputProfile,
	profilesAreEqual,
} from '../../../../../src/api/fixtures/AutolendProfile';

describe('AutolendProfile.js', () => {
	describe('AutolendProfile constructor', () => {
		it('should return an AutolendProfile object with default values', () => {
			const profile = AutolendProfile();

			expect(profile).toHaveProperty('__typename', 'AutolendProfile');
			expect(profile.id).toBeNull();
			expect(profile.isEnabled).toBe(false);
			expect(profile.donationPercentage).toBe(15);
			expect(profile.lendAfterDaysIdle).toBe(90);
			expect(profile.idleCreditOptIn).toBe(true);
			expect(profile.cIdleStartTime).toBeNull();
			expect(profile.enableAfter).toBe(0);
			expect(profile.kivaChooses).toBe(true);
			expect(profile.loanSearchCriteria).toBeDefined();
			expect(profile.loanSearchCriteria).toHaveProperty('__typename', 'LoanSearchCriteria');
		});
	});

	describe('getCacheableProfile', () => {
		it('should add __typename to profile object', () => {
			const profile = {
				id: '123',
				isEnabled: true,
				donationPercentage: 20,
			};
			const result = getCacheableProfile(profile);

			expect(result).toHaveProperty('__typename', 'AutolendProfile');
			expect(result.id).toBe('123');
			expect(result.isEnabled).toBe(true);
			expect(result.donationPercentage).toBe(20);
		});

		it('should process loanSearchCriteria if present', () => {
			const profile = {
				isEnabled: true,
				loanSearchCriteria: {
					queryString: 'women',
					filters: {
						gender: 'female',
					},
				},
			};
			const result = getCacheableProfile(profile);

			expect(result.loanSearchCriteria).toHaveProperty('__typename', 'LoanSearchCriteria');
			expect(result.loanSearchCriteria.queryString).toBe('women');
		});

		it('should preserve all properties', () => {
			const profile = {
				id: '456',
				isEnabled: false,
				donationPercentage: 10,
				lendAfterDaysIdle: 60,
				customProp: 'test',
			};
			const result = getCacheableProfile(profile);

			expect(result.customProp).toBe('test');
			expect(result.lendAfterDaysIdle).toBe(60);
		});
	});

	describe('getInputProfile', () => {
		it('should exclude id, cIdleStartTime, and __typename', () => {
			const profile = {
				id: '123',
				isEnabled: true,
				donationPercentage: 15,
				lendAfterDaysIdle: 90,
				idleCreditOptIn: true,
				cIdleStartTime: '2025-01-01',
				enableAfter: 0,
				kivaChooses: true,
				__typename: 'AutolendProfile',
				loanSearchCriteria: {
					queryString: '',
					filters: {},
				},
			};
			const result = getInputProfile(profile);

			expect(result).not.toHaveProperty('id');
			expect(result).not.toHaveProperty('cIdleStartTime');
			expect(result).not.toHaveProperty('__typename');
			expect(result.isEnabled).toBe(true);
			expect(result.donationPercentage).toBe(15);
			expect(result.lendAfterDaysIdle).toBe(90);
			expect(result.idleCreditOptIn).toBe(true);
			expect(result.enableAfter).toBe(0);
			expect(result.kivaChooses).toBe(true);
		});

		it('should process loanSearchCriteria', () => {
			const profile = {
				isEnabled: true,
				donationPercentage: 20,
				loanSearchCriteria: {
					queryString: 'agriculture',
					filters: {
						sector: 'Agriculture',
						gender: 'female',
					},
				},
			};
			const result = getInputProfile(profile);

			expect(result.loanSearchCriteria).toBeDefined();
			expect(result.loanSearchCriteria.queryString).toBe('agriculture');
			expect(result.loanSearchCriteria.filters).toBeDefined();
		});

		it('should handle minimal profile', () => {
			const profile = {
				isEnabled: false,
				loanSearchCriteria: {
					queryString: '',
					filters: {},
				},
			};
			const result = getInputProfile(profile);

			expect(result.isEnabled).toBe(false);
			expect(result.loanSearchCriteria).toBeDefined();
		});
	});

	describe('profilesAreEqual', () => {
		it('should return true for identical profiles', () => {
			const profileA = {
				isEnabled: true,
				enableAfter: 0,
				idleCreditOptIn: true,
				donationPercentage: 15,
				lendAfterDaysIdle: 90,
				kivaChooses: true,
				loanSearchCriteria: {
					queryString: 'women',
					filters: { gender: 'female' },
				},
			};
			const profileB = {
				isEnabled: true,
				enableAfter: 0,
				idleCreditOptIn: true,
				donationPercentage: 15,
				lendAfterDaysIdle: 90,
				kivaChooses: true,
				loanSearchCriteria: {
					queryString: 'women',
					filters: { gender: 'female' },
				},
			};

			expect(profilesAreEqual(profileA, profileB)).toBe(true);
		});

		it('should return true when both are undefined', () => {
			expect(profilesAreEqual(undefined, undefined)).toBe(true);
		});

		it('should return true when both are null', () => {
			expect(profilesAreEqual(null, null)).toBe(true);
		});

		it('should return false when only one is undefined', () => {
			const profile = {
				isEnabled: true,
				loanSearchCriteria: {},
			};

			expect(profilesAreEqual(profile, undefined)).toBe(false);
			expect(profilesAreEqual(undefined, profile)).toBe(false);
		});

		it('should return false when isEnabled differs', () => {
			const profileA = { isEnabled: true, loanSearchCriteria: {} };
			const profileB = { isEnabled: false, loanSearchCriteria: {} };

			expect(profilesAreEqual(profileA, profileB)).toBe(false);
		});

		it('should return false when enableAfter differs', () => {
			const profileA = { enableAfter: 0, loanSearchCriteria: {} };
			const profileB = { enableAfter: 5, loanSearchCriteria: {} };

			expect(profilesAreEqual(profileA, profileB)).toBe(false);
		});

		it('should return false when pauseUntil differs', () => {
			const profileA = { pauseUntil: null, loanSearchCriteria: {} };
			const profileB = { pauseUntil: '2025-12-31', loanSearchCriteria: {} };

			expect(profilesAreEqual(profileA, profileB)).toBe(false);
		});

		it('should return false when idleCreditOptIn differs', () => {
			const profileA = { idleCreditOptIn: true, loanSearchCriteria: {} };
			const profileB = { idleCreditOptIn: false, loanSearchCriteria: {} };

			expect(profilesAreEqual(profileA, profileB)).toBe(false);
		});

		it('should return false when donationPercentage differs', () => {
			const profileA = { donationPercentage: 15, loanSearchCriteria: {} };
			const profileB = { donationPercentage: 20, loanSearchCriteria: {} };

			expect(profilesAreEqual(profileA, profileB)).toBe(false);
		});

		it('should return false when lendAfterDaysIdle differs', () => {
			const profileA = { lendAfterDaysIdle: 90, loanSearchCriteria: {} };
			const profileB = { lendAfterDaysIdle: 60, loanSearchCriteria: {} };

			expect(profilesAreEqual(profileA, profileB)).toBe(false);
		});

		it('should return false when kivaChooses differs', () => {
			const profileA = { kivaChooses: true, loanSearchCriteria: {} };
			const profileB = { kivaChooses: false, loanSearchCriteria: {} };

			expect(profilesAreEqual(profileA, profileB)).toBe(false);
		});

		it('should return false when loanSearchCriteria differ', () => {
			const profileA = {
				isEnabled: true,
				loanSearchCriteria: {
					queryString: 'women',
					filters: { gender: 'female' },
				},
			};
			const profileB = {
				isEnabled: true,
				loanSearchCriteria: {
					queryString: 'men',
					filters: { gender: 'male' },
				},
			};

			expect(profilesAreEqual(profileA, profileB)).toBe(false);
		});

		it('should handle profiles without all fields', () => {
			const profileA = {
				isEnabled: true,
				donationPercentage: 15,
			};
			const profileB = {
				isEnabled: true,
				donationPercentage: 15,
			};

			expect(profilesAreEqual(profileA, profileB)).toBe(true);
		});
	});
});
