import { fireEvent, render } from '@testing-library/vue';
import { ref } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import ThanksPageSingleVersion from '#src/components/Thanks/ThanksPageSingleVersion';
import { GOAL_STATUS } from '#src/composables/useGoalData';
import { GOAL_SIGNUP_THANKS_VIEWS_COOKIE } from '#src/util/myKivaUtils';
import { globalOptions } from '../../../specUtils';

const router = createRouter({
	history: createMemoryHistory(),
	routes: [{ path: '/', component: { template: '<div />' } }],
});

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

// Mock myKivaUtils
vi.mock('#src/util/myKivaUtils', () => ({
	GOAL_SIGNUP_THANKS_VIEWS_COOKIE: 'kv_goal_signup_thanks_views',
	incrementGoalSignupThanksViewCount: vi.fn(cookieStore => {
		const current = Number(cookieStore?.get('kv_goal_signup_thanks_views')) || 0;
		cookieStore?.set('kv_goal_signup_thanks_views', String(Math.min(current + 1, 3)), {
			path: '/',
			expires: new Date(2027, 0, 1),
		});
		return Math.min(current + 1, 3);
	}),
	isGoalSignupThanksViewCapped: vi.fn(cookieStore => {
		return (Number(cookieStore?.get('kv_goal_signup_thanks_views')) || 0) >= 3;
	}),
	setGuestAssignmentCookie: vi.fn(),
	setPostLendingCardCookie: vi.fn(),
}));

// Default mock state for useGoalData
let mockUserGoal;
let mockUserGoalAchievedNow;
let mockLoading;
let mockHasContributingLoans;
let mockCheckCompletedGoal;

const {
	mockUseExpressCheckoutModal,
	mockHandleAddRecommendedLoanToBasket,
	mockHandleExpressCheckoutComplete,
	mockHandleExpressCheckoutClose,
	mockExpressCheckoutState,
} = vi.hoisted(() => ({
	mockUseExpressCheckoutModal: vi.fn(),
	mockHandleAddRecommendedLoanToBasket: vi.fn(),
	mockHandleExpressCheckoutComplete: vi.fn(),
	mockHandleExpressCheckoutClose: vi.fn(),
	mockExpressCheckoutState: {
		isRedirecting: false,
	},
}));

vi.mock('#src/composables/useGoalData', async importOriginal => {
	const actual = await importOriginal();
	return {
		...actual,
		default: () => ({
			checkCompletedGoal: mockCheckCompletedGoal,
			getPostCheckoutProgressByLoans: vi.fn().mockImplementation(() => ({
				totalProgress: 5,
				hasContributingLoans: mockHasContributingLoans,
			})),
			getCtaHref: vi.fn(),
			getRecommendedLoans: vi.fn().mockResolvedValue([]),
			goalProgress: ref(0),
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

vi.mock('#src/composables/useExpressCheckoutModal', async () => {
	const { ref: vueRef } = await import('vue');
	return {
		default: deps => {
			mockUseExpressCheckoutModal(deps);
			return {
				expressCheckoutModalRef: vueRef(null),
				expressCheckoutLoan: vueRef(null),
				isRedirecting: vueRef(mockExpressCheckoutState.isRedirecting),
				handleAddRecommendedLoanToBasket: mockHandleAddRecommendedLoanToBasket,
				handleExpressCheckoutComplete: mockHandleExpressCheckoutComplete,
				handleExpressCheckoutClose: mockHandleExpressCheckoutClose,
			};
		},
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
		template: `
			<button
				data-testid="goal-entrypoint"
				:data-is-redirecting="String(isRedirecting)"
				@click="$emit('add-to-basket', { loanId: 123, loan: { id: 123 } })"
			>
				<slot />
			</button>
		`,
		emits: ['add-to-basket'],
		props: [
			'loading', 'totalLoans', 'categoriesLoanCount', 'isGoalSet',
			'tieredAchievements', 'selectedCategory', 'isEditing',
			'goalLoans', 'goalProgress', 'goalProgressPercentage', 'goToUrl',
			'showRecommendLoanAfterGoalView', 'hasRecommendedLoans', 'recommendLoanCardProps',
			'recommendLoanHeaderDetails', 'recommendLoanIsInBasket',
			'loadedSetData', 'isAdding', 'isRedirecting',
		],
	},
	OptInModule: { template: '<div data-testid="opt-in-module"><slot /></div>' },
	JourneyGeneralPrompt: { template: '<div data-testid="journey-general-prompt"><slot /></div>' },
	KivaCards: { template: '<div data-testid="kiva-cards"><slot /></div>' },
	AccountReceiptShare: { template: '<div data-testid="account-receipt-share"><slot /></div>' },
	GoalSettingModal: { template: '<div data-testid="goal-setting-modal"><slot /></div>' },
	KvLightbox: { template: '<div><slot /></div>' },
	GuestAccountCreation: { template: '<div><slot /></div>' },
	ExpressCheckoutModal: { template: '<div data-testid="express-checkout-modal" />' },
};

// Minimal stub for the provide bridge ThanksPage exposes — the tests don't
// exercise the express-checkout flow, but the setup destructures these values.
const thanksPageBasketStub = {
	basketItems: ref([]),
	isAdding: ref(false),
	addToBasket: vi.fn(),
	loadInitialBasketItems: vi.fn(),
	resetIsAdding: vi.fn(),
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
	'donation-opt-in-module',
];

function renderComponent(propsOverrides = {}, options = {}) {
	const kvTrackEvent = options.kvTrackEvent ?? vi.fn();
	const cookieValues = propsOverrides.cookieValues ?? {};
	const thanksPageBasket = options.thanksPageBasket ?? thanksPageBasketStub;
	const props = { ...propsOverrides };
	delete props.cookieValues;
	const cookieStore = {
		get: vi.fn(name => cookieValues[name]),
		set: vi.fn((name, value) => {
			cookieValues[name] = value;
		}),
		remove: vi.fn(),
	};

	const renderResult = render(ThanksPageSingleVersion, {
		global: {
			...globalOptions,
			plugins: [router],
			provide: {
				...globalOptions.provide,
				$kvTrackEvent: kvTrackEvent,
				cookieStore,
				thanksPageBasket,
			},
			stubs,
		},
		props: {
			isGuest: false,
			isOptedIn: true,
			loans: [{ id: 1, unreservedAmount: '25.00' }],
			receipt: {
				items: { values: [{ basketItemType: 'loan' }] },
				totals: { itemTotal: '25.00', donationTotal: '0.00' },
			},
			...props,
		},
	});

	return {
		...renderResult,
		cookieStore,
		cookieValues,
		kvTrackEvent,
		thanksPageBasket
	};
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
		mockCheckCompletedGoal = vi.fn();
		mockUseExpressCheckoutModal.mockClear();
		mockHandleAddRecommendedLoanToBasket.mockClear();
		mockHandleExpressCheckoutComplete.mockClear();
		mockHandleExpressCheckoutClose.mockClear();
		mockExpressCheckoutState.isRedirecting = false;
		thanksPageBasketStub.addToBasket.mockClear();
		thanksPageBasketStub.loadInitialBasketItems.mockClear();
		thanksPageBasketStub.resetIsAdding.mockClear();
	});

	it('checks completed goals without persisting the MyKiva hide preference', async () => {
		mockUserGoal.value = inProgressGoal;

		renderComponent({
			badgesAchieved: [],
		});

		await vi.waitFor(() => {
			expect(mockCheckCompletedGoal).toHaveBeenCalledWith({
				currentGoalProgress: 5,
				persistHideGoalCard: false,
			});
		});
	});

	describe('express checkout modal', () => {
		it('passes $kvTrackEvent to useExpressCheckoutModal', () => {
			const kvTrackEvent = vi.fn();

			renderComponent({}, { kvTrackEvent });

			expect(mockUseExpressCheckoutModal).toHaveBeenCalledWith(expect.objectContaining({
				kvTrackEvent,
			}));
		});

		it('does not render ExpressCheckoutModal when the flag is disabled', () => {
			const { queryByTestId } = renderComponent({
				isExpressCheckoutModalEnabled: false,
			});

			expect(queryByTestId('express-checkout-modal')).toBeNull();
		});

		it('renders ExpressCheckoutModal for signed-in users when the flag is enabled', () => {
			const { queryByTestId } = renderComponent({
				isExpressCheckoutModalEnabled: true,
			});

			expect(queryByTestId('express-checkout-modal')).toBeTruthy();
		});

		it('does not render ExpressCheckoutModal for guests even when the flag is enabled', () => {
			const { queryByTestId } = renderComponent({
				isGuest: true,
				isExpressCheckoutModalEnabled: true,
			});

			expect(queryByTestId('express-checkout-modal')).toBeNull();
		});

		it('forwards composable isRedirecting to GoalEntrypoint', async () => {
			mockExpressCheckoutState.isRedirecting = true;
			mockUserGoal.value = null;

			const { findByTestId } = renderComponent();
			const goalEntrypoint = await findByTestId('goal-entrypoint');

			expect(goalEntrypoint.getAttribute('data-is-redirecting')).toBe('true');
		});

		it('routes GoalEntrypoint add-to-basket through useExpressCheckoutModal', async () => {
			mockUserGoal.value = null;

			const { findByTestId } = renderComponent();
			await fireEvent.click(await findByTestId('goal-entrypoint'));

			expect(mockHandleAddRecommendedLoanToBasket).toHaveBeenCalledWith(expect.objectContaining({
				loanId: 123,
				loan: { id: 123 },
				onError: expect.any(Function),
			}));
		});
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

		it('shows donation opt-in before GoalInProgress when donation-only and not opted in', async () => {
			mockUserGoal.value = inProgressGoal;

			const { container } = renderComponent({
				badgesAchieved: [],
				isOptedIn: false,
				receipt: {
					items: { values: [{ basketItemType: 'donation' }] },
					totals: { itemTotal: '25.00', donationTotal: '25.00' },
				},
			});

			await vi.waitFor(() => {
				const ids = getOrderedModules(container);
				expect(ids).toEqual(['donation-opt-in-module', 'goal-in-progress']);
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

		it('increments the thank you goal signup view counter when the ask renders', async () => {
			mockUserGoal.value = null;

			const { cookieStore, getByTestId } = renderComponent({
				badgesAchieved: [],
			});

			await vi.waitFor(() => {
				expect(getByTestId('goal-entrypoint')).toBeTruthy();
				expect(cookieStore.set).toHaveBeenCalledWith(GOAL_SIGNUP_THANKS_VIEWS_COOKIE, '1', {
					path: '/',
					expires: expect.any(Date),
				});
			});
		});

		it('allows the third thank you goal signup view and stores the capped count', async () => {
			mockUserGoal.value = null;

			const { cookieStore, getByTestId } = renderComponent({
				badgesAchieved: [],
				cookieValues: {
					[GOAL_SIGNUP_THANKS_VIEWS_COOKIE]: '2',
				},
			});

			await vi.waitFor(() => {
				expect(getByTestId('goal-entrypoint')).toBeTruthy();
				expect(cookieStore.set).toHaveBeenCalledWith(GOAL_SIGNUP_THANKS_VIEWS_COOKIE, '3', {
					path: '/',
					expires: expect.any(Date),
				});
			});
		});

		it('hides the thank you goal signup ask after the view cap and shows fallback content', async () => {
			mockUserGoal.value = null;

			const { queryByTestId, getByTestId, cookieStore } = renderComponent({
				badgesAchieved: [],
				cookieValues: {
					[GOAL_SIGNUP_THANKS_VIEWS_COOKIE]: '3',
				},
			});

			await vi.waitFor(() => {
				expect(queryByTestId('goal-entrypoint')).toBeNull();
				expect(getByTestId('journey-general-prompt')).toBeTruthy();
				expect(cookieStore.set).not.toHaveBeenCalledWith(
					GOAL_SIGNUP_THANKS_VIEWS_COOKIE,
					expect.anything(),
					expect.anything()
				);
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
