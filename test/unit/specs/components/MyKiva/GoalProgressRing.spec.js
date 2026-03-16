import { render } from '@testing-library/vue';
import GoalProgressRing from '#src/components/MyKiva/GoalProgressRing';
import {
	ID_SUPPORT_ALL,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
	ID_US_ECONOMIC_EQUALITY,
	ID_WOMENS_EQUALITY,
} from '#src/composables/useBadgeData';
import { globalOptions } from '../../../specUtils';

vi.mock('vue-router', () => ({
	useRouter: () => ({
		currentRoute: { value: { path: '/goal-setting' } },
	}),
}));

const GOAL_LOANS = 4;

const defaultProps = {
	goalLoans: GOAL_LOANS,
	goalProgress: 0,
	goalProgressPercentage: 0,
	variant: 'modal',
	categoryId: ID_WOMENS_EQUALITY,
	categoryName: 'Women',
	goToUrl: '/lend/filter',
	isGoalCompleted: false,
	isUpdatingGoal: false,
};

const renderRing = props => render(GoalProgressRing, {
	global: globalOptions,
	props: { ...defaultProps, ...props },
});

describe('GoalProgressRing', () => {
	describe('titleText', () => {
		it('shows completed title when isGoalCompleted and variant is modal', () => {
			const { getAllByRole } = renderRing({ isGoalCompleted: true });
			// eslint-disable-next-line max-len
			expect(getAllByRole('heading', { level: 2 })[0].textContent).toBe('You did it! You reached your annual goal');
		});

		it('shows "Goal updated!" when isUpdatingGoal is true', () => {
			const { getAllByRole } = renderRing({ isUpdatingGoal: true });
			expect(getAllByRole('heading', { level: 2 })[0].textContent).toBe('Goal updated!');
		});

		it('shows "Goal set!" for modal variant when not completed or updating', () => {
			const { getAllByRole } = renderRing({});
			expect(getAllByRole('heading', { level: 2 })[0].textContent).toBe('Goal set!');
		});

		it('isGoalCompleted takes precedence over isUpdatingGoal', () => {
			const { getAllByRole } = renderRing({ isGoalCompleted: true, isUpdatingGoal: true });
			// eslint-disable-next-line max-len
			expect(getAllByRole('heading', { level: 2 })[0].textContent).toBe('You did it! You reached your annual goal');
		});
	});

	describe('modalVariantDescriptionText - completed state', () => {
		/* eslint-disable max-len */
		const completedCases = [
			[ID_WOMENS_EQUALITY, 'Women', `Thank you for supporting ${GOAL_LOANS} women and turning your commitment into impact.`],
			[ID_SUPPORT_ALL, 'Choose as I go', `Thank you for supporting ${GOAL_LOANS} borrowers and turning your commitment into impact.`],
			[ID_CLIMATE_ACTION, 'Climate Action', `Thank you for supporting ${GOAL_LOANS} eco-friendly loans and turning your commitment into impact.`],
			[ID_REFUGEE_EQUALITY, 'Refugees', `Thank you for supporting ${GOAL_LOANS} refugees and turning your commitment into impact.`],
			[ID_BASIC_NEEDS, 'Basic Needs', `Thank you for supporting ${GOAL_LOANS} basic needs loans and turning your commitment into impact.`],
			[ID_US_ECONOMIC_EQUALITY, 'U.S. Entrepreneurs', `Thank you for supporting ${GOAL_LOANS} U.S. entrepreneurs and turning your commitment into impact.`],
		];
		/* eslint-enable max-len */

		it.each(completedCases)('shows correct copy for %s', (categoryId, categoryName, expectedText) => {
			const { container } = renderRing({ isGoalCompleted: true, categoryId, categoryName });
			expect(container.querySelector('.modal-description-text').textContent).toBe(expectedText);
		});
	});

	describe('modalVariantDescriptionText - in-progress state', () => {
		/* eslint-disable max-len */
		const inProgressCases = [
			[ID_WOMENS_EQUALITY, 'Women', `You're already on your way to making ${GOAL_LOANS} loans to women this year`],
			[ID_SUPPORT_ALL, 'Choose as I go', `You're already on your way to making ${GOAL_LOANS} loans this year`],
			[ID_CLIMATE_ACTION, 'Climate Action', `You're already on your way to making ${GOAL_LOANS} eco-friendly loans this year`],
			[ID_REFUGEE_EQUALITY, 'Refugees', `You're already on your way to making ${GOAL_LOANS} loans to refugees this year`],
			[ID_BASIC_NEEDS, 'Basic Needs', `You're already on your way to making ${GOAL_LOANS} loans to basic needs this year`],
			[ID_US_ECONOMIC_EQUALITY, 'U.S. Entrepreneurs', `You're already on your way to making ${GOAL_LOANS} loans to U.S. entrepreneurs this year`],
		];
		/* eslint-enable max-len */

		it.each(inProgressCases)('shows correct copy for %s', (categoryId, categoryName, expectedText) => {
			const { container } = renderRing({ goalProgress: 2, categoryId, categoryName });
			expect(container.querySelector('.modal-description-text').textContent).toBe(expectedText);
		});
	});

	describe('modalVariantDescriptionText - goal just set (no progress)', () => {
		it('shows "begins here" copy for support-all', () => {
			const { container } = renderRing({ categoryId: ID_SUPPORT_ALL, categoryName: 'Choose as I go' });
			expect(container.querySelector('.modal-description-text').textContent)
				.toBe(`Your goal to support ${GOAL_LOANS} loans begins here.`);
		});

		it('shows "begins here" copy with category for women', () => {
			const { container } = renderRing({});
			expect(container.querySelector('.modal-description-text').textContent)
				.toBe(`Your goal to support ${GOAL_LOANS} loans to women begins here.`);
		});
	});

	describe('buttonText', () => {
		it('shows "Continue my impact" when goal is completed', () => {
			const { getByRole } = renderRing({ isGoalCompleted: true });
			expect(getByRole('button', { name: 'Continue my impact' })).toBeTruthy();
		});

		it('shows "Track my progress" for mykiva url with existing progress', () => {
			const { getByRole } = renderRing({ goToUrl: '/mykiva', goalProgress: 2 });
			expect(getByRole('button', { name: 'Track my progress' })).toBeTruthy();
		});

		it('shows "Let\'s do this" for modal with no progress', () => {
			const { getByRole } = renderRing({});
			expect(getByRole('button', { name: "Let's do this" })).toBeTruthy();
		});

		it('shows "View impact progress" for card variant at 100%', () => {
			const { getByRole } = renderRing({ variant: 'card', goalProgressPercentage: 100 });
			expect(getByRole('button', { name: 'View impact progress' })).toBeTruthy();
		});

		it('shows "Work towards your goal" for card variant below 100%', () => {
			const { getByRole } = renderRing({ variant: 'card', goalProgressPercentage: 50 });
			expect(getByRole('button', { name: 'Work towards your goal' })).toBeTruthy();
		});
	});
});
