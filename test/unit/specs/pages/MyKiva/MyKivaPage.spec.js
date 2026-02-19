import MyKivaPage from '#src/pages/MyKiva/MyKivaPage';

describe('MyKivaPage', () => {
	const getTimestampMinutesAgo = minutesAgo => {
		const date = new Date();
		date.setTime(date.getTime() - (minutesAgo * 60 * 1000));
		return date.toISOString();
	};

	describe('mounted', () => {
		it('passes recent transaction loans to loadGoalData for fresh progress', async () => {
			const transactions = [
				{
					type: 'loan_purchase',
					effectiveTime: getTimestampMinutesAgo(12),
					loan: { id: 101 }
				},
				{
					type: 'loan_purchase',
					effectiveTime: getTimestampMinutesAgo(16),
					loan: { id: 102 }
				},
				{
					type: 'loan_purchase',
					effectiveTime: getTimestampMinutesAgo(2),
					loan: { id: 201 }
				}
			];
			const context = {
				apollo: {
					watchQuery: vi.fn(() => ({
						subscribe: vi.fn(),
					}))
				},
				$route: { query: {} },
				goalsV2Enabled: false,
				isNextStepsExpEnabled: true,
				loadGoalData: vi.fn().mockResolvedValue(),
				loans: [{ id: 999 }],
				currentYearTieredAchievements: [{ id: 'climate-action' }],
				transactions,
				userInfo: {},
			};

			await MyKivaPage.mounted.call(context);

			expect(context.loadGoalData).toHaveBeenCalledTimes(1);
			expect(context.loadGoalData).toHaveBeenCalledWith({
				year: expect.any(Number),
				yearlyProgress: false,
				freshProgressLoans: [{ id: 101 }, { id: 201 }],
				tieredAchievements: context.currentYearTieredAchievements,
				transactions: context.transactions
			});
		});
	});
});
