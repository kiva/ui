import {
	createUserPreferences,
	updateUserPreferences,
	getUserPreference,
	setUserPreference,
	createUserPreferencesMutation,
	updateUserPreferencesMutation,
} from '#src/util/userPreferenceUtils';

vi.mock('#src/util/logReadQueryError');

const userPreferenceDataMock = {
	my: {
		userPreference: {
			id: 1,
			preferences: ''
		}
	}
};

const createPreferenceDataMock = {
	my: {
		createUserPreferences: {
			id: 1,
			preferences: ''
		}
	}
};

const updatedPreferenceDataMock = {
	my: {
		userPreference: {
			id: 1,
			preferences: {
				test: 'test'
			}
		}
	}
};

describe('userPreferenceUtils.ts', () => {
	describe('createUserPreferences', () => {
		it('should create user preferences as expected', async () => {
			const apolloMock = {
				mutate: vi.fn().mockReturnValueOnce(Promise.resolve({ data: createPreferenceDataMock }))
			};
			const preferences = { test: 'test' };

			const newUserPreference = await createUserPreferences(apolloMock, preferences);

			expect(newUserPreference).toEqual({
				data: createPreferenceDataMock
			});
			expect(apolloMock.mutate).toHaveBeenCalledTimes(1);
			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: createUserPreferencesMutation,
				variables: { preferences: JSON.stringify(preferences) },
			});
		});

		it('should handle errors when creating user preferences', async () => {
			const { default: logReadQueryError } = await import('#src/util/logReadQueryError');
			const error = new Error('Create failed');
			const apolloMock = {
				mutate: vi.fn().mockRejectedValueOnce(error)
			};
			const preferences = { test: 'test' };

			const result = await createUserPreferences(apolloMock, preferences);

			expect(result).toBeUndefined();
			expect(logReadQueryError).toHaveBeenCalledWith(error, 'userPreferenceUtils createUserPreferencesMutation');
		});
	});

	describe('updateUserPreferences', () => {
		it('should update user preferences as expected', async () => {
			const apolloMock = {
				mutate: vi.fn()
					.mockReturnValueOnce(Promise.resolve({ data: updatedPreferenceDataMock }))
			};

			const newUserPreference = await updateUserPreferences(
				apolloMock,
				userPreferenceDataMock.my.userPreference,
				// Pass existing preferences to ensure they are merged correctly
				{ test: 'test' },
				{ new: 'new' },
			);

			expect(newUserPreference).toEqual({
				data: updatedPreferenceDataMock
			});
			expect(apolloMock.mutate).toHaveBeenCalledTimes(1);
			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: updateUserPreferencesMutation,
				variables: {
					updateUserPreferencesId: userPreferenceDataMock.my.userPreference.id,
					preferences: JSON.stringify({ test: 'test', new: 'new' }),
				},
			});
		});

		it('should handle errors when updating user preferences', async () => {
			const { default: logReadQueryError } = await import('#src/util/logReadQueryError');
			const error = new Error('Update failed');
			const apolloMock = {
				mutate: vi.fn().mockRejectedValueOnce(error)
			};

			const result = await updateUserPreferences(
				apolloMock,
				userPreferenceDataMock.my.userPreference,
				{ test: 'test' },
				{ new: 'new' },
			);

			expect(result).toBeUndefined();
			expect(logReadQueryError).toHaveBeenCalledWith(error, 'userPreferenceUtils updateUserPreferencesMutation');
		});
	});

	describe('getUserPreference', () => {
		it('returns null for a missing node, missing key, or unparseable blob', () => {
			expect(getUserPreference(null, 'showLoanDetailsInRail')).toBe(null);
			expect(getUserPreference({ preferences: '{}' }, 'showLoanDetailsInRail')).toBe(null);
			expect(getUserPreference({ preferences: 'not json' }, 'showLoanDetailsInRail')).toBe(null);
		});

		it('returns the stored value when the key is present', () => {
			expect(getUserPreference({ preferences: '{"showLoanDetailsInRail":true}' }, 'showLoanDetailsInRail'))
				.toBe(true);
		});
	});

	describe('setUserPreference', () => {
		it('creates a record (single key) when there is no existing id', async () => {
			const apolloMock = { mutate: vi.fn().mockResolvedValueOnce({ data: {} }) };

			await setUserPreference(apolloMock, null, 'showLoanDetailsInRail', true);

			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: createUserPreferencesMutation,
				variables: { preferences: JSON.stringify({ showLoanDetailsInRail: true }) },
			});
		});

		it('merge-updates the existing blob when a record id is present', async () => {
			const apolloMock = { mutate: vi.fn().mockResolvedValueOnce({ data: {} }) };
			const userPreferences = { id: 7, preferences: '{"goals":[1]}' };

			await setUserPreference(apolloMock, userPreferences, 'showLoanDetailsInRail', false);

			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: updateUserPreferencesMutation,
				variables: {
					updateUserPreferencesId: 7,
					preferences: JSON.stringify({ goals: [1], showLoanDetailsInRail: false }),
				},
			});
		});
	});
});
