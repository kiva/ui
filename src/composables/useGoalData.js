import { ref } from 'vue';

import thankYouPageQuery from '#src/graphql/query/thankYouPage.graphql';

/**
 * Vue composable for loading user profile goal data
 *
 * @param {Object} apollo - Apollo Client instance
 * @returns Goal data and utilities
 */
export default async function useGoalData(apollo, loans) {
	if (!apollo) throw new Error('ApolloClient is required');

	const goalData = ref();

	const response = await apollo.query({ query: thankYouPageQuery });
	const userPreferencesData = response.data?.my?.userPreferences?.preferences || {};
	const currentYear = new Date().getFullYear();

	goalData.value = JSON.parse(userPreferencesData || '{}');
	const goalMap = new Map(
		goalData.value.map(goal => {
			const year = new Date(goal.dateStarted).getFullYear();
			if (year < currentYear) return null;
			return [
				goal.category,
				{
					count: 0,
					target: goal.target,
				}
			];
		})
	);

	// Mechanism to measure goal progress based on year and existing user loans still pending
	// Specifically, a created at field to determine the year of the loan is still pending

	// Should completed goals be toggled as "done" in this page or in the previous checkout page?

	loans.forEach(loan => {
		(loan.tags || []).forEach(tag => {
			// TODO: The line below does not actually work. Loan date is not obtained this way
			if (loan?.date && new Date(loan.date).getFullYear() < new Date().getFullYear()) return;
			switch (tag) {
				case 'basic_needs':
					goalMap.get('basic_needs').count += 1;
					break;
				case 'climate_action':
					goalMap.get('climate_action').count += 1;
					break;
				case 'refugee_support':
					goalMap.get('refugee_support').count += 1;
					break;
				case 'us_entrepreneurs':
					goalMap.get('us_entrepreneurs').count += 1;
					break;
				case 'women':
				case '#Woman-Owned Business':
					goalMap.get('women').count += 1;
					break;
				default:
					break;
			}
		});
	});

	const basicNeedsGoalAchieved = goalMap.get('basic_needs')
		.count >= goalMap.get('basic_needs').target;
	const climateActionGoalAchieved = goalMap.get('climate_action')
		.count >= goalMap.get('climate_action').target;
	const refugeeSupportGoalAchieved = goalMap.get('refugee_support')
		.count >= goalMap.get('refugee_support').target;
	const usEntrepreneursGoalAchieved = goalMap.get('us_entrepreneurs')
		.count >= goalMap.get('us_entrepreneurs').target;
	const womenGoalAchieved = goalMap.get('women')
		.count >= goalMap.get('women').target;

	return {
		basicNeedsGoalAchieved,
		climateActionGoalAchieved,
		refugeeSupportGoalAchieved,
		usEntrepreneursGoalAchieved,
		userPreferencesData,
		womenGoalAchieved,
	};
}
