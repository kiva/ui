import {
	format,
	getMonth,
	isValid,
	parseISO,
} from 'date-fns';
import {
	ID_SUPPORT_ALL,
	ID_WOMENS_EQUALITY,
} from '#src/composables/useBadgeData';

/**
 * Variant copy for GoalInReviewSlide4 ("What your goal says about you").
 *
 * Each card resolves its own {title, content} from goal summary data:
 *  - Origin story  -> quarter of `dateStarted`
 *  - Impact identity -> goal `category` (badge id)
 *  - Impact habit  -> `transactionSessionCount` (percentile branch is scaffolded
 *    but not wired yet; see getImpactHabitTopPercentile).
 */

/** Sessions with a transaction needed to reach the "Kiva champion" tier. */
export const KIVA_CHAMPION_MIN_SESSIONS = 5;

/** Lifetime percentile at/above which the "Top X%" habit variant applies. */
export const LIFETIME_PERCENTILE_THRESHOLD = 80;

// Origin-story variants indexed by calendar quarter (Q1 = Jan–Mar … Q4 = Oct–Dec).
// `content` is a function so the real start month can be interpolated in.
const ORIGIN_STORY_VARIANTS = [
	{
		title: 'The spark starters',
		// eslint-disable-next-line max-len
		content: month => `You began in ${month}. As a natural trailblazer, you aren’t afraid to go first. You don’t wait for change - you help create it, showing others what’s possible.`,
	},
	{
		title: 'The bloom chasers',
		// eslint-disable-next-line max-len
		content: month => `You began in ${month}, a season of growth. Intentional and progress-driven, you believe small actions, nurtured over time, create lasting impact.`,
	},
	{
		title: 'The sun chasers',
		// eslint-disable-next-line max-len
		content: month => `You started in ${month}, when long days inspire big dreams. Driven by possibility, you believe the future is shaped by the actions we take, and the impact we choose to make.`,
	},
	{
		title: 'The Reflectionist',
		// eslint-disable-next-line max-len
		content: month => `You started in ${month}, a season of reflection and giving. Thoughtful and driven, you know the best time to make an impact is whenever you’re ready.`,
	},
];

/**
 * Parses the goal start date into a valid Date, or null when unusable.
 *
 * @param {string|number|Date} dateStarted The goal start date.
 * @returns {Date|null} A valid Date, or null.
 */
const parseStartDate = dateStarted => {
	if (!dateStarted) {
		return null;
	}
	const parsed = typeof dateStarted === 'string' ? parseISO(dateStarted) : new Date(dateStarted);
	return isValid(parsed) ? parsed : null;
};

const goalInReviewCopy = {
	/**
	 * Origin-story card copy, keyed to the quarter the goal started in.
	 *
	 * @param {string|number|Date} dateStarted The goal start date.
	 * @returns {{title: string, content: string}} Card title and body.
	 */
	getOriginStory(dateStarted) {
		const date = parseStartDate(dateStarted);
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
				content: 'You chose to support women, helping break down barriers to opportunity, financial independence, and brighter futures.',
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
	 * Impact-habit card copy based on lending sessions during the year.
	 *
	 * @param {number} transactionSessionCount Sessions with a transaction.
	 * @returns {{title: string, content: string}} Card title and body.
	 */
	getImpactHabit(transactionSessionCount) {
		const count = Number(transactionSessionCount) || 0;
		const timeWord = count === 1 ? 'time' : 'times';
		if (count >= KIVA_CHAMPION_MIN_SESSIONS) {
			return {
				title: 'Kiva champion',
				// eslint-disable-next-line max-len
				content: `You showed up ${count} ${timeWord} this year, turning your commitment to impact into a lasting habit.`,
			};
		}
		return {
			title: 'Rising Kiva champion',
			content: `You showed up ${count} ${timeWord} this year and started building a habit of impact.`,
		};
	},

	/**
	 * Impact-habit card copy for top-percentile lenders.
	 *
	 * TODO(next step): percentile data isn't fetched yet — wire this into
	 * getImpactHabit and confirm the copy/threshold semantics once available.
	 *
	 * @param {number} lifetimePercentile The lender's lifetime percentile.
	 * @returns {{title: string, content: string}} Card title and body.
	 */
	getImpactHabitTopPercentile(lifetimePercentile) {
		return {
			title: `Top ${lifetimePercentile}%`,
			content: `Your lending places you among the top ${lifetimePercentile}% of goal setters this year.`,
		};
	},
};

export default goalInReviewCopy;
