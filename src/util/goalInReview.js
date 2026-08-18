import {
	format,
	getMonth,
} from 'date-fns';
import {
	getContentfulLevelData,
	ID_SUPPORT_ALL,
	ID_WOMENS_EQUALITY,
} from '#src/composables/useBadgeData';
import { GOAL_STATUS } from '#src/composables/useGoalData';
import { toValidDate } from '#src/util/dateUtils';
import { capitalize } from '#src/util/stringParserUtils';

// --- Automatic pop-up decision ---

/**
 * Whether the in-progress release date has arrived. Missing or unparseable dates
 * read as "not yet", so an unset setting holds the pop-up back rather than
 * releasing it to every in-progress goal setter at once.
 *
 * @param {Date|string|null} startDate The configured release date.
 * @param {Date} now The effective current date.
 * @returns {boolean} Whether in-progress goal setters are eligible yet.
 */
function hasInProgressReleaseStarted(startDate, now) {
	if (!startDate) {
		return false;
	}
	const start = startDate instanceof Date ? startDate : new Date(startDate);
	if (Number.isNaN(start.getTime())) {
		return false;
	}
	return now.getTime() >= start.getTime();
}

/**
 * Decides whether the recap should open by itself, for MyKiva and Portfolio alike.
 * Both pages call this so the pop-up happens once per user across the two, rather
 * than once per page.
 *
 * @param {object} options Trigger inputs.
 * @param {boolean} options.enabled The goal_in_review_enable setting.
 * @param {boolean} options.isEligible Whether the recap has a goal with progress.
 * @param {string} options.goalStatus The goal's status.
 * @param {number|string} options.goalYear The year the goal belongs to.
 * @param {number|string} options.currentGoalYear The goal year in progress now.
 * @param {boolean} options.hasViewedRecap Whether the recap has already been seen.
 * @param {boolean} options.completedThisSession Whether the goal completed during this
 *   browsing session, which means the recap waits for the next one.
 * @param {Date|string|null} options.inProgressStartDate The goal_in_review_in_progress_start
 *   setting, the date in-progress goal setters become eligible.
 * @param {Date} options.now The effective current date.
 * @returns {boolean} Whether to open the recap automatically.
 */
export function shouldAutoOpenRecap({
	enabled = false,
	isEligible = false,
	goalStatus = '',
	goalYear = null,
	currentGoalYear = null,
	hasViewedRecap = false,
	completedThisSession = false,
	inProgressStartDate = null,
	now = new Date(),
} = {}) {
	if (!enabled || !isEligible || hasViewedRecap) {
		return false;
	}

	// The pop-up is for this year's goal setters. A goal from a previous year is only
	// reachable through the goal card entry point.
	if (Number(goalYear) !== Number(currentGoalYear)) {
		return false;
	}

	// If the user arrives at MyKiva from the thanks page, the recap is not shown yet.
	// It waits for their next session.
	if (goalStatus === GOAL_STATUS.COMPLETED) {
		return !completedThisSession;
	}

	// Completed goal setters see the recap as soon as the feature is live; in-progress
	// ones wait for the configured release date so their goal has run most of its course.
	if (goalStatus === GOAL_STATUS.IN_PROGRESS) {
		return hasInProgressReleaseStarted(inProgressStartDate, now);
	}

	return false;
}

// --- Goal sign up ask ---

// Stop asking for a goal there is no year left to finish (MP-2993).
const SIGNUP_HIDE_LEAD_DAYS = 14;

/**
 * Whether to hide the goal sign up ask, from the lead time before the recap release
 * until the end of that goal year.
 *
 * @param {object} options Inputs.
 * @param {Date|string|null} [options.recapStartDate] The goal_in_review_in_progress_start setting.
 * @param {Date} [options.now] The effective current date.
 * @returns {boolean} Whether to hide the sign up ask.
 */
export function shouldHideGoalSignup({ recapStartDate = null, now = new Date() } = {}) {
	if (!recapStartDate) {
		return false;
	}
	const recapStart = recapStartDate instanceof Date ? recapStartDate : new Date(recapStartDate);
	if (Number.isNaN(recapStart.getTime())) {
		return false;
	}

	const hideFrom = new Date(recapStart);
	hideFrom.setDate(hideFrom.getDate() - SIGNUP_HIDE_LEAD_DAYS);
	const resumeAt = new Date(recapStart.getFullYear() + 1, 0, 1);

	return now.getTime() >= hideFrom.getTime() && now.getTime() < resumeAt.getTime();
}

// --- Goal card entry point decision ---

export const RECAP_CTA_LABEL = 'View goal recap';

// End of March is the product cutoff for looking back at last year's goal (MP-2944).
const MARCH = 2;
const CUTOFF_DAY = 31;

/**
 * The calendar year a goal belongs to, taken from the date it started.
 *
 * @param {object} goal A goal carrying a dateStarted.
 * @returns {number|null} The goal's year, or null when it has no start date.
 */
export function getGoalYear(goal) {
	return goal?.dateStarted ? new Date(goal.dateStarted).getFullYear() : null;
}

/**
 * Last moment a past goal's recap entry point is offered.
 *
 * @param {number|string} goalYear The year the goal ran.
 * @returns {Date} End of March 31 in the year after the goal.
 */
export function getRecapEntryCutoff(goalYear) {
	return new Date(Number(goalYear) + 1, MARCH, CUTOFF_DAY, 23, 59, 59, 999);
}

/**
 * Decides whether a goal card offers the "View goal recap" CTA. Shared by the
 * completed-goal next step card and the Impact Progress row, so both surfaces answer
 * the question the same way.
 *
 * @param {object} options Entry point inputs.
 * @param {boolean} options.enabled The goal_in_review_enable setting.
 * @param {string} options.goalStatus The goal's status.
 * @param {number|string} options.goalYear The year the goal ran.
 * @param {number|string} options.currentYear The current year.
 * @param {number} [options.loansTowardGoal] Loans made toward an unfinished goal.
 * @param {number|string|null} [options.activeGoalYear] The year of the goal the lender has
 *   set now, which ends a past goal's recap once it reaches the current year.
 * @param {Date} [options.now] The effective current date.
 * @returns {boolean} Whether to offer the recap from this card.
 */
export function shouldShowRecapEntryPoint({
	enabled = false,
	goalStatus = '',
	goalYear = null,
	currentYear = null,
	loansTowardGoal = 0,
	activeGoalYear = null,
	now = new Date(),
} = {}) {
	if (!enabled || !goalYear || !currentYear) {
		return false;
	}

	if (Number(goalYear) > Number(currentYear)) {
		return false;
	}

	// A goal still running keeps its card focused on finishing it.
	if (Number(goalYear) === Number(currentYear)) {
		return goalStatus === GOAL_STATUS.COMPLETED;
	}

	// A past goal's recap stays reachable into the new year, so lenders who never finished
	// still get to look back at what they did.
	if (Number(activeGoalYear) === Number(currentYear)
		|| now.getTime() > getRecapEntryCutoff(goalYear).getTime()) {
		return false;
	}
	return goalStatus === GOAL_STATUS.COMPLETED || Number(loansTowardGoal) > 0;
}

// --- Recap payload assembly ---

/**
 * Maps the category badge id ("womens-equality") to the name Contentful writes it
 * as ("Women's Equality"). The goal picker's own name wins where it has one, so the recap
 * calls a category what the lender was called it when they set the goal.
 *
 * @param {string} category The goal category badge id.
 * @param {Array} contentfulEntries Raw `challenge` entries from Contentful.
 * @param {Array} categories Goal categories from useGoalData's getCategories.
 * @returns {string} The display name for the goal category.
 */
export function getCategoryName(category, contentfulEntries = [], categories = []) {
	if (!category) {
		return '';
	}

	const picked = (categories ?? []).find(entry => entry.badgeId === category);
	if (picked?.name) {
		return picked.name;
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
 * The goal's qualifying purchases for the recap year. A goal counts everything lent
 * to its category that year, including loans made before the goal was set.
 */
function getGoalAchievement(goalSummary, tieredLendingAchievements) {
	return (tieredLendingAchievements ?? []).find(entry => entry?.id === goalSummary?.category);
}

// Read in UTC: locally, purchases either side of new year land in the wrong one.
function getPurchaseYear(purchase) {
	const purchasedAt = new Date(purchase.purchaseTime);
	return Number.isNaN(purchasedAt.getTime()) ? null : purchasedAt.getUTCFullYear();
}

function getYearPurchases(goalSummary, tieredLendingAchievements, year) {
	// The year the recap asks the service for scopes progressForYear, not this list, so it
	// arrives carrying other years.
	// Most recent first, as the service returns them. Selecting the oldest instead would
	// mean pulling the whole year, and is not even reachable for lenders past the
	// rolling window, which retains only the most recent loans.
	return (getGoalAchievement(goalSummary, tieredLendingAchievements)?.loanPurchases ?? [])
		.filter(purchase => purchase?.loan)
		.filter(purchase => !Number.isFinite(year) || getPurchaseYear(purchase) === year);
}

function getYearLoans(goalSummary, tieredLendingAchievements, year) {
	return getYearPurchases(goalSummary, tieredLendingAchievements, year).map(purchase => purchase.loan);
}

/**
 * Loans bought in one checkout share a purchase time, so distinct times are sessions.
 */
function getSessionCount(purchases) {
	return new Set(purchases.map(purchase => purchase.purchaseTime).filter(Boolean)).size;
}

/**
 * Sums the lender's share of each loan. Null rather than 0 when no shares came back,
 * so the headline slide shows an em dash instead of "$0".
 */
function getAmountLent(loans) {
	const shares = loans
		.map(loan => Number(loan?.userProperties?.loanBalance?.totalAmountPurchased))
		.filter(share => share > 0);

	return shares.length ? shares.reduce((total, share) => total + share, 0) : null;
}

/**
 * `GoalSummary.countries` and `.sectors` are support-all only, so the global reach slide derives
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
 * Caps a category goal at its target and fills the fields the monolith only provides
 * for support-all. Support-all is already computed server-side, so it passes through.
 *
 * @param {object} goalSummary The merged goal summary.
 * @param {Array} tieredLendingAchievements Achievements for the recap year.
 * @param {number} year The goal's year. Purchases outside it are excluded.
 * @returns {object|null} The summary the slides read.
 */
export function scopeToGoalYear(goalSummary, tieredLendingAchievements = [], year = undefined) {
	if (!goalSummary || goalSummary.category === ID_SUPPORT_ALL) {
		return goalSummary;
	}

	const yearPurchases = getYearPurchases(goalSummary, tieredLendingAchievements, year);
	const achievement = getGoalAchievement(goalSummary, tieredLendingAchievements);
	// progressForYear is authoritative: the rolling window can trim loanPurchases.
	// Finite rather than truthy, so a real zero is not read as missing.
	const progress = achievement?.progressForYear;
	const lent = Number.isFinite(progress) ? progress : yearPurchases.length;
	const target = Number(goalSummary.target) || 0;
	const count = target > 0 ? Math.min(lent, target) : lent;

	// Every stat describes the same loans the grid shows, not a wider set.
	const countedPurchases = yearPurchases.slice(0, count);
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
 * Loans shown as borrower photos on the borrowers slide. Support-all goals carry their own
 * loans on the goal summary; category goals only exist in achievements-service,
 * where the qualifying loans hang off the achievement matching the category.
 *
 * @param {object} goalSummary The recap goal summary.
 * @param {Array} tieredLendingAchievements Achievements for the recap year.
 * @param {number} year The goal's year. Loans outside it are excluded.
 * @returns {Array} Loans, each `{ id, name, image { hash } }`.
 */
export function getGoalLoans(goalSummary, tieredLendingAchievements = [], year = undefined) {
	if (goalSummary?.category === ID_SUPPORT_ALL) {
		return goalSummary?.loans ?? [];
	}

	const loans = getYearLoans(goalSummary, tieredLendingAchievements, year);
	// scopeToGoalYear already capped `count`; the grid must not show more than it claims.
	const count = Number(goalSummary?.count);

	return Number.isFinite(count) ? loans.slice(0, count) : loans;
}

/**
 * The headline and thanks slides both read these, and the borrowers slide reconciles
 * its "+n more" against `borrowers`, so they resolve once here rather than per slide.
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

// --- Borrower cards ---

export const MAX_BORROWER_CARDS = 11;

/**
 * Normalizes goal loans into photo cards, capped at MAX_BORROWER_CARDS.
 *
 * @param {Array} loans Goal loans, each `{ id, name, image { hash } }`.
 * @param {number|string} [totalBorrowerCount] Borrower total from the headline slide.
 * @returns {{cards: Array<{id: string, name: string, imageHash: string}>, moreCount: number}}
 */
export function getBorrowerCards(loans = [], totalBorrowerCount = null) {
	const uniqueLoans = new Map(
		(loans ?? [])
			.filter(loan => loan?.id != null)
			.map(loan => [loan.id, loan]),
	);

	const cards = [...uniqueLoans.values()]
		.slice(0, MAX_BORROWER_CARDS)
		.map(loan => ({
			id: String(loan.id),
			name: loan.name ?? '',
			imageHash: loan.image?.hash ?? '',
		}));

	return {
		cards,
		moreCount: Math.max((Number(totalBorrowerCount) || 0) - cards.length, 0),
	};
}

// --- Sector chart ---

export const OTHER_SECTOR_LABEL = 'Other';

/**
 * Maps `GoalSummary.sectors` into chart-ready values, collapsing entries with no
 * sector name into a single "Other (n)" bucket flagged with `isOther`.
 *
 * @param {Array} sectors `{ sector { name }, loanCount }` entries, loan count descending.
 * @returns {Array<{label: string, value: number, isOther?: boolean}>} Sector entries.
 */
export function getSectorChartValues(sectors = []) {
	const named = [];
	let otherCount = 0;

	(sectors ?? []).forEach(entry => {
		const value = Number(entry?.loanCount) || 0;
		if (value <= 0) {
			return;
		}
		const label = entry?.sector?.name;
		if (label) {
			named.push({ label, value });
		} else {
			otherCount += value;
		}
	});

	return otherCount > 0
		? [...named, { label: `${OTHER_SECTOR_LABEL} (${otherCount})`, value: otherCount, isOther: true }]
		: named;
}

/**
 * Counts the named sectors, excluding the "Other" bucket.
 *
 * @param {Array<{isOther?: boolean}>} sectorValues Output of getSectorChartValues.
 * @returns {number} Number of named sectors.
 */
export function getNamedSectorCount(sectorValues = []) {
	return (sectorValues ?? []).filter(sector => !sector.isOther).length;
}

// --- Map centre ---

/** Centre used when no country has usable coordinates. */
export const DEFAULT_MAP_CENTER = { lat: 20, long: 10 };

const toRadians = degrees => (degrees * Math.PI) / 180;
const toDegrees = radians => (radians * 180) / Math.PI;

// 0 is a real latitude and longitude, so coordinates need a finite check rather
// than a truthiness one.
const getPoints = countries => (countries ?? [])
	.map(country => ({ lat: country?.geocode?.latitude, long: country?.geocode?.longitude }))
	.filter(point => Number.isFinite(point.lat) && Number.isFinite(point.long));

// Longitudes wrap at the antimeridian, so averaging Tonga (-175) with Fiji (177)
// arithmetically lands in Africa. Averaging them as unit vectors does not.
const getMeanLongitude = points => {
	const x = points.reduce((total, point) => total + Math.cos(toRadians(point.long)), 0);
	const y = points.reduce((total, point) => total + Math.sin(toRadians(point.long)), 0);
	return toDegrees(Math.atan2(y / points.length, x / points.length));
};

/**
 * Centres the global reach slide map on the countries the goal reached — the country itself
 * when there is only one, otherwise the average position of all of them.
 *
 * @param {Array} countries Countries with `geocode.latitude` / `geocode.longitude`.
 * @returns {{lat: number, long: number}} Map centre.
 */
export function getCountriesMapCenter(countries = []) {
	const points = getPoints(countries);
	if (!points.length) {
		return DEFAULT_MAP_CENTER;
	}

	return {
		lat: points.reduce((total, point) => total + point.lat, 0) / points.length,
		long: getMeanLongitude(points),
	};
}

// --- Copy variants ---

/**
 * Variant copy for GoalInReviewGivingInsights ("What your goal says about you").
 *
 * Each card resolves its own {title, content} from goal summary data:
 *  - Origin story: quarter of `dateStarted`
 *  - Impact identity: goal `category` (badge id)
 *  - Impact habit: `lifetimePercentile`, else `transactionSessionCount`
 */

/** Sessions with a transaction needed to reach the "Kiva champion" tier. */
export const KIVA_CHAMPION_MIN_SESSIONS = 5;

/** Lifetime percentile at/above which the "Top X%" habit variant applies. */
export const LIFETIME_PERCENTILE_THRESHOLD = 80;

// Wraps emphasized copy in a medium-weight <strong>. The base layer resets
// <strong> to normal weight, so the class restores emphasis. Rendered via v-html.
const bold = text => `<strong class="tw-font-medium">${text}</strong>`;

// Origin-story variants indexed by calendar quarter (Q1 = Jan–Mar … Q4 = Oct–Dec).
// `content` is a function so the real start month can be interpolated in.
const ORIGIN_STORY_VARIANTS = [
	{
		title: 'The spark starters',
		// eslint-disable-next-line max-len
		content: month => `You began in ${bold(capitalize(month))}. As a natural trailblazer, you aren’t afraid to go first. You don’t wait for change - you help create it, showing others what’s possible.`,
	},
	{
		title: 'The bloom chasers',
		// eslint-disable-next-line max-len
		content: month => `You began in ${bold(capitalize(month))}, a season of growth. Intentional and progress-driven, you believe small actions, nurtured over time, create lasting impact.`,
	},
	{
		title: 'The sun chasers',
		// eslint-disable-next-line max-len
		content: month => `You started in ${bold(capitalize(month))}, when long days inspire big dreams. Driven by possibility, you believe the future is shaped by the actions we take, and the impact we choose to make.`,
	},
	{
		title: 'The Reflectionist',
		// eslint-disable-next-line max-len
		content: month => `You started in ${bold(capitalize(month))}, a season of reflection and giving. Thoughtful and driven, you know the best time to make an impact is whenever you’re ready.`,
	},
];

const goalInReviewCopy = {
	/**
	 * Origin-story card copy, keyed to the quarter the goal started in.
	 *
	 * @param {string|number|Date} dateStarted The goal start date.
	 * @returns {{title: string, content: string}} Card title and body.
	 */
	getOriginStory(dateStarted) {
		const date = toValidDate(dateStarted);
		const monthIndex = date ? getMonth(date) : 0;
		const monthName = date ? format(date, 'MMMM') : 'January';
		const variant = ORIGIN_STORY_VARIANTS[Math.floor(monthIndex / 3)];
		return {
			title: variant.title,
			content: variant.content(monthName),
		};
	},

	/**
	 * Impact-identity card copy, keyed to the goal category (badge id).
	 *
	 * @param {string} categoryId The goal category badge id.
	 * @returns {{title: string, content: string}} Card title and body.
	 */
	getImpactIdentity(categoryId) {
		if (categoryId === ID_WOMENS_EQUALITY) {
			return {
				title: 'Barrier Breaker',
				// eslint-disable-next-line max-len
				content: `You chose to support ${bold('women entrepreneurs')}, helping break down barriers to opportunity, financial independence, and brighter futures.`,
			};
		}
		if (categoryId === ID_SUPPORT_ALL) {
			return {
				title: 'Opportunity Spotter',
				// eslint-disable-next-line max-len
				content: 'You create your own path to impact. You keep your heart and mind open, believing anyone with the drive to build a better future deserves a chance.',
			};
		}
		return {
			title: 'Cause advocate',
			// eslint-disable-next-line max-len
			content: 'You stood behind a cause that is close to your heart. Every loan helped turn your values into real-world impact.',
		};
	},

	/**
	 * Impact-habit card copy. Top-percentile lenders take precedence; everyone
	 * else is keyed to lending sessions during the year.
	 *
	 * @param {object} data Habit inputs.
	 * @param {number} [data.transactionSessionCount] Sessions with a transaction.
	 * @param {number} [data.lifetimePercentile] The lender's lifetime percentile.
	 * @returns {{title: string, content: string}} Card title and body.
	 */
	getImpactHabit({ transactionSessionCount, lifetimePercentile } = {}) {
		const percentile = Number(lifetimePercentile);
		if (Number.isFinite(percentile) && percentile >= LIFETIME_PERCENTILE_THRESHOLD) {
			return this.getImpactHabitTopPercentile(percentile);
		}

		const count = Number(transactionSessionCount) || 0;
		const timeWord = count === 1 ? 'time' : 'times';
		if (count >= KIVA_CHAMPION_MIN_SESSIONS) {
			return {
				title: 'Kiva champion',
				// eslint-disable-next-line max-len
				content: `You showed up ${bold(`${count} ${timeWord}`)} this year, turning your commitment to impact into a lasting habit.`,
			};
		}
		return {
			title: 'Rising Kiva champion',
			content: `You showed up ${bold(`${count} ${timeWord}`)} this year and started building a habit of impact.`,
		};
	},

	/**
	 * Impact-habit card copy for top-percentile lenders (>= threshold).
	 *
	 * @param {number} lifetimePercentile The lender's lifetime percentile.
	 * @returns {{title: string, content: string}} Card title and body.
	 */
	getImpactHabitTopPercentile(lifetimePercentile) {
		const topPercent = Math.max(100 - lifetimePercentile, 1);
		return {
			title: `Top ${topPercent}%`,
			content: `Your lending places you among the top ${topPercent}% of goal setters this year.`,
		};
	},
};

export default goalInReviewCopy;
