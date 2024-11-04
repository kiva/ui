import useUserPreferences from '#src/composables/useUserPreferences';
import { userPreferenceDataMock, updatedPreferenceDataMock } from '../../fixtures/useUserPreferenceDataMock';

describe('useUserPreferences.js', () => {
	describe('createUserPreferences', () => {
		it('should create user preferences expected', async () => {
			const apolloMock = {
				mutate: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: userPreferenceDataMock }))
			};

			const { createUserPreferences } = useUserPreferences(apolloMock);
			const newUserPreference = await createUserPreferences();

			expect(newUserPreference).toEqual({
				data: userPreferenceDataMock
			});
		});
	});

	describe('updateUserPreferences', () => {
		it('should update user preferences expected', async () => {
			const apolloMock = {
				mutate: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: updatedPreferenceDataMock }))
			};

			const { updateUserPreferences } = useUserPreferences(apolloMock);
			const newUserPreference = await updateUserPreferences(
				{
					userPreferences: userPreferenceDataMock,
					newPreference: {
						test: 'test'
					}
				}
			);

			expect(newUserPreference).toEqual({
				data: updatedPreferenceDataMock
			});
		});
	});

	describe('saveUserPreferences', () => {
		it('should save user preferences expected', async () => {
			const apolloMock = {
				mutate: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: updatedPreferenceDataMock }))
			};

			const {
				saveUserPreferences,
			} = useUserPreferences(apolloMock);

			const newUserPreference = await saveUserPreferences({
				userPreferences: userPreferenceDataMock?.my?.userPreference,
				newPreference: {
					test: 'test'
				}
			});

			expect(newUserPreference).toEqual({
				data: updatedPreferenceDataMock
			});
		});
	});
});
