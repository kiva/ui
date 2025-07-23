import {
	describe, it, expect, vi
} from 'vitest';
import {
	createUserPreferences,
	updateUserPreferences,
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
	});
});
