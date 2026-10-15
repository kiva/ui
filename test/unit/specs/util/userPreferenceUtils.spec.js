import {
	getUserPreference,
	setUserPreference,
	setUserPreferenceKeys,
} from '#src/util/userPreferenceUtils';
import setUserPreferenceMutation from '#src/graphql/mutation/accountSettings/setUserPreference.graphql';

vi.mock('#src/util/logReadQueryError');

const setPreferenceDataMock = {
	my: {
		setUserPreference: {
			id: 1,
			preferences: '{"test":"test"}',
		},
	},
};

describe('userPreferenceUtils.js', () => {
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
		it('sends the key with its value JSON-encoded', async () => {
			const apolloMock = {
				mutate: vi.fn().mockResolvedValueOnce({ data: setPreferenceDataMock }),
			};

			const result = await setUserPreference(apolloMock, 'test', 'test');

			expect(result).toEqual({ data: setPreferenceDataMock });
			expect(apolloMock.mutate).toHaveBeenCalledTimes(1);
			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: setUserPreferenceMutation,
				variables: { key: 'test', value: '"test"' },
			});
		});

		it('encodes non-string values', async () => {
			const apolloMock = { mutate: vi.fn().mockResolvedValue({ data: {} }) };

			await setUserPreference(apolloMock, 'hideGoalCard', false);
			await setUserPreference(apolloMock, 'goals', [{ goalName: 'g' }]);

			expect(apolloMock.mutate).toHaveBeenNthCalledWith(1, {
				mutation: setUserPreferenceMutation,
				variables: { key: 'hideGoalCard', value: 'false' },
			});
			expect(apolloMock.mutate).toHaveBeenNthCalledWith(2, {
				mutation: setUserPreferenceMutation,
				variables: { key: 'goals', value: '[{"goalName":"g"}]' },
			});
		});

		it('logs and resolves undefined when the mutation fails', async () => {
			const { default: logReadQueryError } = await import('#src/util/logReadQueryError');
			const error = new Error('Set failed');
			const apolloMock = { mutate: vi.fn().mockRejectedValueOnce(error) };

			const result = await setUserPreference(apolloMock, 'test', 'test');

			expect(result).toBeUndefined();
			expect(logReadQueryError).toHaveBeenCalledWith(error, 'userPreferenceUtils setUserPreferenceMutation');
		});
	});

	describe('setUserPreferenceKeys', () => {
		it('sends each key one after the other', async () => {
			let pending = 0;
			let overlapped = false;
			const apolloMock = {
				mutate: vi.fn(async () => {
					pending += 1;
					if (pending > 1) overlapped = true;
					await Promise.resolve();
					pending -= 1;
					return { data: setPreferenceDataMock };
				}),
			};

			const result = await setUserPreferenceKeys(apolloMock, { goals: [], hideGoalCard: false });

			expect(overlapped).toBe(false);
			expect(result).toEqual({ data: setPreferenceDataMock });
			expect(apolloMock.mutate).toHaveBeenNthCalledWith(1, {
				mutation: setUserPreferenceMutation,
				variables: { key: 'goals', value: '[]' },
			});
			expect(apolloMock.mutate).toHaveBeenNthCalledWith(2, {
				mutation: setUserPreferenceMutation,
				variables: { key: 'hideGoalCard', value: 'false' },
			});
		});

		it('keeps sending the remaining keys after one fails', async () => {
			const apolloMock = {
				mutate: vi.fn()
					.mockRejectedValueOnce(new Error('Set failed'))
					.mockResolvedValueOnce({ data: setPreferenceDataMock }),
			};

			await setUserPreferenceKeys(apolloMock, { goals: [], hideGoalCard: false });

			expect(apolloMock.mutate).toHaveBeenCalledTimes(2);
		});
	});
});
