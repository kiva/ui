import { render } from '@testing-library/vue';
import { ref } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import ThanksPageSingleVersion from '#src/components/Thanks/ThanksPageSingleVersion';
import { GOAL_STATUS } from '#src/composables/useGoalData';
import { globalOptions } from '../../../specUtils';

const router = createRouter({
	history: createMemoryHistory(),
	routes: [{ path: '/', component: { template: '<div />' } }],
});

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

// Mock myKivaUtils
vi.mock('#src/util/myKivaUtils', () => ({
	setGuestAssignmentCookie: vi.fn(),
	setPostLendingCardCookie: vi.fn(),
}));

// Default mock state for useGoalData
let mockUserGoal;
let mockUserGoalAchievedNow;
let mockLoading;
let mockHasContributingLoans;

vi.mock('#src/composables/useGoalData', async importOriginal => {
	const actual = await importOriginal();
	return {
		...actual,
		default: () => ({
			checkCompletedGoal: vi.fn(),
			getPostCheckoutProgressByLoans: vi.fn().mockImplementation(() => ({
				totalProgress: 5,
				hasContributingLoans: mockHasContributingLoans,
			})),
			goalProgressPercentage: ref(50),
			loadGoalData: vi.fn(),
			loading: mockLoading,
			storeGoalPreferences: vi.fn(),
			userGoal: mockUserGoal,
			userGoalAchievedNow: mockUserGoalAchievedNow,
			getCategories: () => [{ id: 'womens-equality', name: 'Women' }],
		}),
	};
});

vi.mock('#src/composables/useBadgeData', async importOriginal => {
	const actual = await importOriginal();
	return {
		...actual,
		default: () => ({
			getAllCategoryLoanCounts: vi.fn().mockReturnValue({}),
		}),
	};
});

// Stub child components with data-testid preserved
const stubs = {
	GoalCompleted: { template: '<div data-testid="goal-completed"><slot /></div>' },
	GoalInProgress: {
		template: '<div :data-testid="$attrs[\'data-testid\']"><slot /></div>',
		props: ['isOptedIn', 'loan', 'currentGoal', 'targetLoansAmount'],
	},
	BadgeMilestone: {
		template: '<div :data-testid="$attrs[\'data-testid\']"><slot /></div>',
		props: [
			'isGuest', 'isOptedIn', 'badgeAchievedIds', 'onlyKivaCardsAndDonations',
			'loans', 'loanCommentModuleShown', 'kivaCardsModuleShown', 'achievementsCompleted',
		],
	},
	GoalEntrypoint: {
		template: '<div data-testid="goal-entrypoint"><slot /></div>',
		props: [
			'loading', 'totalLoans', 'categoriesLoanCount', 'isGoalSet',
			'tieredAchievements', 'selectedCategory', 'isEditing',
			'goalLoans', 'goalProgress', 'goalProgressPercentage', 'goToUrl',
		],
	},
	OptInModule: { template: '<div data-testid="opt-in-module"><slot /></div>' },
	JourneyGeneralPrompt: { template: '<div data-testid="journey-general-prompt"><slot /></div>' },
	KivaCards: { template: '<div data-testid="kiva-cards"><slot /></div>' },
	AccountReceiptShare: { template: '<div data-testid="account-receipt-share"><slot /></div>' },
	GoalSettingModal: { template: '<div data-testid="goal-setting-modal"><slot /></div>' },
	KvLightbox: { template: '<div><slot /></div>' },
	GuestAccountCreation: { template: '<div><slot /></div>' },
};

const tieredBadge = { achievementId: 'badge-1', preCheckoutTier: 1 };
const nonTieredBadge = { achievementId: 'badge-2', preCheckoutTier: null };
const inProgressGoal = { status: GOAL_STATUS.IN_PROGRESS, target: 10 };

const MODULE_IDS = [
	'badge-milestone',
	'goal-entrypoint',
	'goal-completed',
	'goal-in-progress',
	'opt-in-module',
];

function renderComponent(propsOverrides = {}) {
	return render(ThanksPageSingleVersion, {
		global: {
			...globalOptions,
			plugins: [router],
			provide: {
				...globalOptions.provide,
				$kvTrackEvent: vi.fn(),
			},
			stubs,
		},
		props: {
			isGuest: false,
			isOptedIn: true,
			loans: [{ id: 1, unreservedAmount: '25.00' }],
			isNextStepsExpEnabled: true,
			receipt: { items: { values: [{ basketItemType: 'loan' }] } },
			...propsOverrides,
		},
	});
}

function getOrderedModules(container) {
	const selector = MODULE_IDS.map(id => `[data-testid="${id}"]`).join(', ');
	const elements = container.querySelectorAll(selector);
	return Array.from(elements).map(el => el.getAttribute('data-testid'));
}

describe('ThanksPageSingleVersion', () => {
	beforeEach(() => {
		mockUserGoal = ref(null);
		mockUserGoalAchievedNow = ref(false);
		mockLoading = ref(false);
		mockHasContributingLoans = true;
	});

	describe('tiered badge ordering', () => {
		// eslint-disable-next-line max-len
		it('shows GoalInProgress before opt-in before BadgeMilestone when active goal + only tiered badges', async () => {
			mockUserGoal.value = inProgressGoal;

			const { container } = renderComponent({
				badgesAchieved: [tieredBadge],
				isOptedIn: false,
			});

			await vi.waitFor(() => {
				const ids = getOrderedModules(container);
				expect(ids).toEqual(['goal-in-progress', 'opt-in-module', 'badge-milestone']);
			});
		});

		it('shows GoalCompleted before BadgeMilestone when goal completed + tiered badge', async () => {
			mockUserGoal.value = { status: GOAL_STATUS.COMPLETED, target: 10 };
			mockUserGoalAchievedNow.value = true;

			const { container } = renderComponent({
				badgesAchieved: [tieredBadge],
			});

			await vi.waitFor(() => {
				const ids = getOrderedModules(container);
				expect(ids).toEqual(['goal-completed', 'badge-milestone']);
			});
		});
	});

	describe('non-tiered badge ordering', () => {
		it('shows BadgeMilestone before GoalInProgress when active goal + non-tiered badge', async () => {
			mockUserGoal.value = inProgressGoal;

			const { container } = renderComponent({
				badgesAchieved: [nonTieredBadge],
			});

			await vi.waitFor(() => {
				const ids = getOrderedModules(container);
				expect(ids).toEqual(['badge-milestone', 'goal-in-progress']);
			});
		});

		it('shows BadgeMilestone before GoalCompleted when goal completed + non-tiered badge', async () => {
			mockUserGoal.value = { status: GOAL_STATUS.COMPLETED, target: 10 };
			mockUserGoalAchievedNow.value = true;

			const { container } = renderComponent({
				badgesAchieved: [nonTieredBadge],
			});

			await vi.waitFor(() => {
				const ids = getOrderedModules(container);
				expect(ids).toEqual(['badge-milestone', 'goal-completed']);
			});
		});

		it('shows BadgeMilestone before GoalEntrypoint when no goal set + non-tiered badge', async () => {
			// userGoal is null (empty) so isEmptyGoal will be true, showing GoalEntrypoint
			mockUserGoal.value = null;

			const { container } = renderComponent({
				badgesAchieved: [nonTieredBadge],
			});

			await vi.waitFor(() => {
				const ids = getOrderedModules(container);
				expect(ids).toEqual(['badge-milestone', 'goal-entrypoint']);
			});
		});
	});

	describe('mixed badge ordering', () => {
		it('shows BadgeMilestone before GoalInProgress when active goal + mixed tiered and non-tiered', async () => {
			mockUserGoal.value = inProgressGoal;

			const { container } = renderComponent({
				badgesAchieved: [tieredBadge, nonTieredBadge],
			});

			await vi.waitFor(() => {
				const ids = getOrderedModules(container);
				expect(ids).toEqual(['badge-milestone', 'goal-in-progress']);
			});
		});

		it('shows BadgeMilestone before GoalEntrypoint when no goal set + mixed badges', async () => {
			mockUserGoal.value = null;

			const { container } = renderComponent({
				badgesAchieved: [tieredBadge, nonTieredBadge],
			});

			await vi.waitFor(() => {
				const ids = getOrderedModules(container);
				expect(ids).toEqual(['badge-milestone', 'goal-entrypoint']);
			});
		});

		it('shows BadgeMilestone before GoalCompleted when goal completed + mixed badges', async () => {
			mockUserGoal.value = { status: GOAL_STATUS.COMPLETED, target: 10 };
			mockUserGoalAchievedNow.value = true;

			const { container } = renderComponent({
				badgesAchieved: [tieredBadge, nonTieredBadge],
			});

			await vi.waitFor(() => {
				const ids = getOrderedModules(container);
				expect(ids).toEqual(['badge-milestone', 'goal-completed']);
			});
		});
	});

	describe('opt-in module ordering', () => {
		it('shows opt-in between GoalInProgress and tiered BadgeMilestone when not opted in', async () => {
			mockUserGoal.value = inProgressGoal;

			const { container } = renderComponent({
				badgesAchieved: [tieredBadge],
				isOptedIn: false,
			});

			await vi.waitFor(() => {
				const ids = getOrderedModules(container);
				expect(ids).toEqual(['goal-in-progress', 'opt-in-module', 'badge-milestone']);
			});
		});

		it('shows opt-in after GoalInProgress when no badge and not opted in', async () => {
			mockUserGoal.value = inProgressGoal;

			const { container } = renderComponent({
				badgesAchieved: [],
				isOptedIn: false,
			});

			await vi.waitFor(() => {
				const ids = getOrderedModules(container);
				expect(ids).toEqual(['goal-in-progress', 'opt-in-module']);
			});
		});

		it('shows opt-in after non-tiered BadgeMilestone and GoalInProgress when not opted in', async () => {
			mockUserGoal.value = inProgressGoal;

			const { container } = renderComponent({
				badgesAchieved: [nonTieredBadge],
				isOptedIn: false,
			});

			await vi.waitFor(() => {
				const ids = getOrderedModules(container);
				expect(ids).toEqual(['badge-milestone', 'goal-in-progress', 'opt-in-module']);
			});
		});
	});

	describe('single module cases', () => {
		it('shows only GoalInProgress when active goal + no badge', async () => {
			mockUserGoal.value = inProgressGoal;

			const { container } = renderComponent({
				badgesAchieved: [],
			});

			await vi.waitFor(() => {
				const ids = getOrderedModules(container);
				expect(ids).toEqual(['goal-in-progress']);
			});
		});

		it('shows GoalEntrypoint and BadgeMilestone when no goal set + tiered badge', async () => {
			mockUserGoal.value = null;

			const { container } = renderComponent({
				badgesAchieved: [tieredBadge],
			});

			await vi.waitFor(() => {
				const ids = getOrderedModules(container);
				expect(ids).toEqual(['goal-entrypoint', 'badge-milestone']);
			});
		});

		it('shows BadgeMilestone for guest user with no goal modules', async () => {
			const { container, queryByTestId } = renderComponent({
				isGuest: true,
				badgesAchieved: [nonTieredBadge],
			});

			await vi.waitFor(() => {
				expect(queryByTestId('badge-milestone')).toBeTruthy();
				const goalElements = container.querySelectorAll(
					'[data-testid="goal-in-progress"], [data-testid="goal-completed"], [data-testid="goal-entrypoint"]'
				);
				expect(goalElements.length).toBe(0);
			});
		});
	});
});
