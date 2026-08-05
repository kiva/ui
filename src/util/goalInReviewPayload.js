import { getContentfulLevelData, ID_SUPPORT_ALL } from '#src/composables/useBadgeData';

/**
 * Maps the category badge id ("womens-equality") to the name Contentful writes it
 * as ("Women's Equality"), falling back to the id.
 *
 * @param {string} category The goal category badge id.
 * @param {Array} contentfulEntries Raw `challenge` entries from Contentful.
 * @returns {string} The display name for the goal category.
 */
export function getCategoryName(category, contentfulEntries = []) {
	if (!category) {
		return '';
	}

	const match = (contentfulEntries ?? [])
		.map(getContentfulLevelData)
		.find(entry => entry.id === category);

	return match?.challengeName || category;
}

/**
 * Layers the monolith's recap-only fields onto a summary that may have come from
 * achievements-service instead.
 *
 * @param {object} summary The goal summary, whichever service produced it.
 * @param {object} [monolithSummary] `my.goalSummary`, absent for category goals.
 * @returns {object|null} The summary the slides read, or null without a goal.
 */
export function mergeRecapExtras(summary, monolithSummary) {
	if (!summary) {
		return null;
	}
	return {
		...summary,
		// The monolith totals every loan in the window regardless of category, which only
		// equals the goal for support-all.
		amount: summary.category === ID_SUPPORT_ALL
			? summary.amount ?? monolithSummary?.amount ?? null
			: summary.amount ?? null,
		transactionSessionCount: monolithSummary?.transactionSessionCount ?? null,
		sectors: monolithSummary?.sectors ?? [],
		countries: monolithSummary?.countries ?? [],
		loans: monolithSummary?.loans ?? [],
	};
}

/**
 * Narrows a category goal's purchases to its own window, since achievements-service
 * reports the whole calendar year.
 */
function getGoalWindowPurchases(goalSummary, tieredLendingAchievements) {
	const achievement = (tieredLendingAchievements ?? [])
		.find(entry => entry?.id === goalSummary?.category);
	const startedAt = Date.parse(goalSummary?.dateStarted) || 0;

	// Oldest first, so later lending cannot displace the loans that met the target.
	return (achievement?.loanPurchases ?? [])
		.filter(purchase => purchase?.loan && (Date.parse(purchase.purchaseTime) || 0) >= startedAt)
		.sort((a, b) => (Date.parse(a.purchaseTime) || 0) - (Date.parse(b.purchaseTime) || 0));
}

function getGoalWindowLoans(goalSummary, tieredLendingAchievements) {
	return getGoalWindowPurchases(goalSummary, tieredLendingAchievements).map(purchase => purchase.loan);
}

/**
 * Loans bought in one checkout share a purchase time, so distinct times are sessions.
 */
function getSessionCount(purchases) {
	return new Set(purchases.map(purchase => purchase.purchaseTime).filter(Boolean)).size;
}

/**
 * Sums the lender's share of each loan. Null rather than 0 when no shares came back,
 * so slide 1 shows an em dash instead of "$0".
 */
function getAmountLent(loans) {
	const shares = loans
		.map(loan => Number(loan?.userProperties?.loanBalance?.totalAmountPurchased))
		.filter(share => share > 0);

	return shares.length ? shares.reduce((total, share) => total + share, 0) : null;
}

/**
 * `GoalSummary.countries` and `.sectors` are support-all only, so slide 3 derives
 * them from the goal's own loans for every other category.
 */
function getGoalCountries(loans) {
	const byId = new Map();

	loans.forEach(loan => {
		const country = loan?.geocode?.country;
		// id is nullable, so fall back to whatever identifies the country.
		const key = country?.id ?? country?.isoCode ?? country?.name;
		if (key != null && !byId.has(key)) {
			byId.set(key, country);
		}
	});

	return [...byId.values()];
}

function getGoalSectors(loans) {
	const byName = new Map();

	loans.forEach(loan => {
		const sector = loan?.sector;
		if (!sector?.name) {
			return;
		}
		const entry = byName.get(sector.name) ?? { sector, loanCount: 0 };
		byName.set(sector.name, { ...entry, loanCount: entry.loanCount + 1 });
	});

	return [...byName.values()].sort((a, b) => b.loanCount - a.loanCount);
}

/**
 * Re-counts a category goal over its own window. Support-all is already scoped by
 * the monolith, so it passes through untouched.
 *
 * @param {object} goalSummary The merged goal summary.
 * @param {Array} tieredLendingAchievements Achievements for the recap year.
 * @returns {object|null} The summary with goal-window counts.
 */
export function scopeToGoalWindow(goalSummary, tieredLendingAchievements = []) {
	if (!goalSummary || goalSummary.category === ID_SUPPORT_ALL) {
		return goalSummary;
	}

	const windowPurchases = getGoalWindowPurchases(goalSummary, tieredLendingAchievements);
	const lent = windowPurchases.length;
	const target = Number(goalSummary.target) || 0;
	const count = target > 0 ? Math.min(lent, target) : lent;

	// Every stat describes the same loans the grid shows, not a wider set.
	const countedPurchases = windowPurchases.slice(0, count);
	const countedLoans = countedPurchases.map(purchase => purchase.loan);

	return {
		...goalSummary,
		count,
		borrowerCount: count,
		amount: getAmountLent(countedLoans),
		transactionSessionCount: goalSummary.transactionSessionCount ?? getSessionCount(countedPurchases),
		countries: goalSummary.countries?.length ? goalSummary.countries : getGoalCountries(countedLoans),
		sectors: goalSummary.sectors?.length ? goalSummary.sectors : getGoalSectors(countedLoans),
		percent: target > 0 ? Math.min(100, Math.round((lent / target) * 100)) : goalSummary.percent,
	};
}

/**
 * Loans shown as borrower photos on slide 2. Support-all goals carry their own
 * loans on the goal summary; category goals only exist in achievements-service,
 * where the qualifying loans hang off the achievement matching the category.
 *
 * @param {object} goalSummary The recap goal summary.
 * @param {Array} tieredLendingAchievements Achievements for the recap year.
 * @returns {Array} Loans, each `{ id, name, image { hash } }`.
 */
export function getGoalLoans(goalSummary, tieredLendingAchievements = []) {
	if (goalSummary?.category === ID_SUPPORT_ALL) {
		return goalSummary?.loans ?? [];
	}

	const loans = getGoalWindowLoans(goalSummary, tieredLendingAchievements);
	const target = Number(goalSummary?.target) || 0;

	return target > 0 ? loans.slice(0, target) : loans;
}

/**
 * Slide 1 and slide 7 both read these, and slide 2 reconciles its "+n more"
 * against `borrowers`, so they resolve once here rather than per slide.
 *
 * @param {object} goalSummary The recap goal summary.
 * @returns {{totalLent: number, borrowers: number, percentComplete: number}} Headline stats.
 */
export function getLoanStats(goalSummary) {
	return {
		totalLent: goalSummary?.amount ?? null,
		borrowers: goalSummary?.borrowerCount ?? goalSummary?.count ?? null,
		percentComplete: goalSummary?.percent ?? null,
	};
}

/**
 * A recap needs a goal that has actually been lent against — an untouched goal
 * would render every slide empty.
 *
 * @param {object} goalSummary The recap goal summary.
 * @returns {boolean} Whether the recap should open.
 */
export function getIsEligible(goalSummary) {
	return Boolean(goalSummary?.goalName) && (Number(goalSummary?.count) || 0) > 0;
}
