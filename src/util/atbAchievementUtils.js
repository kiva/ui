import { defaultBadges } from '#src/util/achievementUtils';

export const splitAchievements = (loanAchievements, tierTable) => {
	const contributingLoanAchievements = [];
	const nonContributingAchievements = [];

	loanAchievements.forEach(achievement => {
		const isNonContributing = achievement.preCheckoutTier === achievement.postCheckoutTier
			|| (
				!!tierTable[achievement.achievementId]
				&& tierTable[achievement.achievementId] === achievement.postCheckoutTier
			);
		if (isNonContributing) {
			nonContributingAchievements.push(achievement);
		} else {
			contributingLoanAchievements.push(achievement);
		}
	});

	return {
		contributingLoanAchievements,
		nonContributingAchievements,
	};
};

export const filterAchievementData = (nonContributingAchievements, badgeAchievementData) => {
	const filteredAchievementsData = [];
	nonContributingAchievements.forEach(achievement => {
		const filteredAchievement = badgeAchievementData.find(badgeData => achievement.achievementId === badgeData.id); // eslint-disable-line max-len
		const activeTier = filteredAchievement?.tiers?.find(tier => !tier.completedDate);
		filteredAchievementsData.push({ ...filteredAchievement, ...activeTier });
	});

	filteredAchievementsData.sort((a, b) => defaultBadges.indexOf(a.id) - defaultBadges.indexOf(b.id));

	return filteredAchievementsData;
};

export const getOneLoanAwayAchievement = (addedLoanId, filteredAchievementsData, loanAchievements) => {
	let currentTarget = null;
	const oneLoanAwayAchievement = filteredAchievementsData.find(achievement => {
		// eslint-disable-next-line max-len
		const progressInBasket = loanAchievements.find(loanAchievement => loanAchievement.achievementId === achievement.id);
		const contributingLoanIds = progressInBasket?.contributingLoanIds ?? [];
		const addedLoanInContributingLoans = contributingLoanIds.includes(addedLoanId.toString());
		const loansProgressCount = achievement.totalProgressToAchievement + contributingLoanIds.length;
		currentTarget = achievement?.tiers?.find(tier => tier.target - 1 === loansProgressCount)?.target ?? null;

		return addedLoanInContributingLoans && currentTarget;
	});

	if (oneLoanAwayAchievement) {
		return {
			...oneLoanAwayAchievement,
			target: currentTarget,
		};
	}

	return null;
};
