/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import MyKivaFeaturedSlot from '#src/components/MyKiva/MyKivaFeaturedSlot';
import { GOAL_STATUS, GOALS_CURRENT_YEAR } from '#src/composables/useGoalData';
import { ID_US_ECONOMIC_EQUALITY } from '#src/composables/useBadgeData';

vi.mock('vue-router', () => ({
	useRouter: () => ({}),
}));

vi.mock('#src/util/logReadQueryError', () => ({
	default: vi.fn(),
}));

const FEATURED_CARD_STUB = {
	name: 'FeaturedGoalCard',
	props: ['state', 'loading', 'suppressCompletionConfetti'],
	template: '<div data-testid="featured-goal-card" :data-state="state" '
		+ ':data-suppress-confetti="String(suppressCompletionConfetti)" />',
};

const buildGoalData = ({
	status = null,
	hasViewedCompletedGoal = false,
	loading = false,
	target = 5,
	progress = 0,
	percentage = 0,
} = {}) => ({
	loading: ref(loading),
	userGoal: ref(status ? { category: ID_US_ECONOMIC_EQUALITY, target, status } : null),
	goalProgress: ref(progress),
	goalProgressPercentage: ref(percentage),
	getGoalDisplayName: vi.fn(() => 'US entrepreneurs'),
	getCtaHref: vi.fn(() => '/lend'),
	hasViewedCompletedGoalForYear: vi.fn(() => hasViewedCompletedGoal),
	setViewedGoalCompletePreference: vi.fn(() => Promise.resolve()),
});

const mountSlot = ({ goalData = buildGoalData(), props = {}, trackEvent = vi.fn() } = {}) => {
	const wrapper = mount(MyKivaFeaturedSlot, {
		props: {
			userFirstName: 'Ada',
			...props,
		},
		global: {
			provide: {
				goalData,
				$kvTrackEvent: trackEvent,
			},
			stubs: {
				FeaturedGoalCard: FEATURED_CARD_STUB,
				KvLoadingPlaceholder: { template: '<div data-testid="loading-placeholder" />' },
			},
		},
	});
	return { wrapper, goalData, trackEvent };
};

describe('MyKivaFeaturedSlot', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('state resolution', () => {
		it('renders no-goal state when the lender has no goal', () => {
			const { wrapper } = mountSlot({ goalData: buildGoalData({ status: null }) });
			const card = wrapper.find('[data-testid="featured-goal-card"]');
			expect(card.exists()).toBe(true);
			expect(card.attributes('data-state')).toBe('no-goal');
		});

		it('renders active-goal state when the lender has an in-progress goal', () => {
			const { wrapper } = mountSlot({
				goalData: buildGoalData({ status: GOAL_STATUS.IN_PROGRESS, progress: 2, percentage: 40 }),
			});
			const card = wrapper.find('[data-testid="featured-goal-card"]');
			expect(card.attributes('data-state')).toBe('active-goal');
		});

		it('renders active-goal state when the lender has a completed goal not yet viewed', () => {
			const { wrapper } = mountSlot({
				goalData: buildGoalData({
					status: GOAL_STATUS.COMPLETED,
					hasViewedCompletedGoal: false,
					progress: 5,
					percentage: 100,
				}),
			});
			expect(wrapper.find('[data-testid="featured-goal-card"]').exists()).toBe(true);
		});

		it('renders nothing when the lender has already viewed the completed goal this year', () => {
			const { wrapper } = mountSlot({
				goalData: buildGoalData({
					status: GOAL_STATUS.COMPLETED,
					hasViewedCompletedGoal: true,
					progress: 5,
					percentage: 100,
				}),
			});
			expect(wrapper.find('[data-testid="featured-goal-card"]').exists()).toBe(false);
		});
	});

	describe('viewedGoalComplete persistence', () => {
		it('persists the flag exactly once when first showing the completed state', async () => {
			const { goalData } = mountSlot({
				goalData: buildGoalData({
					status: GOAL_STATUS.COMPLETED,
					hasViewedCompletedGoal: false,
					percentage: 100,
				}),
			});
			await nextTick();
			expect(goalData.setViewedGoalCompletePreference).toHaveBeenCalledTimes(1);
			expect(goalData.setViewedGoalCompletePreference).toHaveBeenCalledWith(GOALS_CURRENT_YEAR);
		});

		it('does not persist the flag when the user has already viewed the completion', async () => {
			const { goalData } = mountSlot({
				goalData: buildGoalData({
					status: GOAL_STATUS.COMPLETED,
					hasViewedCompletedGoal: true,
					percentage: 100,
				}),
			});
			await nextTick();
			expect(goalData.setViewedGoalCompletePreference).not.toHaveBeenCalled();
		});

		it('does not persist the flag for in-progress goals', async () => {
			const { goalData } = mountSlot({
				goalData: buildGoalData({ status: GOAL_STATUS.IN_PROGRESS, percentage: 50 }),
			});
			await nextTick();
			expect(goalData.setViewedGoalCompletePreference).not.toHaveBeenCalled();
		});

		it('snapshot is sticky — the slot stays visible if the underlying flag flips after mount', async () => {
			// Mount in COMPLETED + not-viewed state — slot renders, persistence kicks in.
			const goalData = buildGoalData({
				status: GOAL_STATUS.COMPLETED,
				hasViewedCompletedGoal: false,
				percentage: 100,
			});
			const { wrapper } = mountSlot({ goalData });

			expect(wrapper.find('[data-testid="featured-goal-card"]').exists()).toBe(true);

			// Simulate the mutation completing: hasViewedCompletedGoalForYear would now return true.
			goalData.hasViewedCompletedGoalForYear.mockReturnValue(true);
			// Trigger a reactive cycle by toggling loading — watcher re-runs but bails because the
			// snapshot was already taken on mount.
			goalData.loading.value = true;
			await nextTick();
			goalData.loading.value = false;
			await nextTick();

			expect(wrapper.find('[data-testid="featured-goal-card"]').exists()).toBe(true);
		});
	});

	describe('confetti suppression prop', () => {
		it('passes suppressCompletionConfetti=false when first viewing the completed state', () => {
			const { wrapper } = mountSlot({
				goalData: buildGoalData({
					status: GOAL_STATUS.COMPLETED,
					hasViewedCompletedGoal: false,
					percentage: 100,
				}),
			});
			const card = wrapper.find('[data-testid="featured-goal-card"]');
			expect(card.attributes('data-suppress-confetti')).toBe('false');
		});
	});

	describe('event emission', () => {
		it('emits set-goal-click without navigating', async () => {
			const { wrapper } = mountSlot();
			await wrapper.findComponent(FEATURED_CARD_STUB).vm.$emit('set-goal-click');
			expect(wrapper.emitted('set-goal-click')).toHaveLength(1);
		});

		it('emits edit-click without navigating', async () => {
			const { wrapper } = mountSlot({
				goalData: buildGoalData({ status: GOAL_STATUS.IN_PROGRESS, percentage: 25 }),
			});
			await wrapper.findComponent(FEATURED_CARD_STUB).vm.$emit('edit-click');
			expect(wrapper.emitted('edit-click')).toHaveLength(1);
		});
	});

	describe('impression tracking on loading→loaded transition', () => {
		it('fires `view`/`set-annual-goal` when the slot resolves to the no-goal state', async () => {
			const goalData = buildGoalData({ status: null, loading: true });
			const trackEvent = vi.fn();
			mountSlot({ goalData, trackEvent });
			// Flip loading off after first render to trigger the watcher.
			goalData.loading.value = false;
			await nextTick();
			expect(trackEvent).toHaveBeenCalledWith('portfolio', 'view', 'set-annual-goal');
		});

		it('fires `show`/`goal-set` with category + target for in-progress goals', async () => {
			const goalData = buildGoalData({
				status: GOAL_STATUS.IN_PROGRESS,
				loading: true,
				target: 5,
				percentage: 40,
			});
			const trackEvent = vi.fn();
			mountSlot({ goalData, trackEvent });
			goalData.loading.value = false;
			await nextTick();
			expect(trackEvent).toHaveBeenCalledWith(
				'portfolio',
				'show',
				'goal-set',
				ID_US_ECONOMIC_EQUALITY,
				5,
			);
		});

		it('does not fire impression events for completed goals', async () => {
			const goalData = buildGoalData({
				status: GOAL_STATUS.COMPLETED,
				loading: true,
				percentage: 100,
			});
			const trackEvent = vi.fn();
			mountSlot({ goalData, trackEvent });
			goalData.loading.value = false;
			await nextTick();
			expect(trackEvent).not.toHaveBeenCalledWith(
				'portfolio',
				'view',
				'set-annual-goal',
			);
			expect(trackEvent).not.toHaveBeenCalledWith(
				'portfolio',
				'show',
				'goal-set',
				expect.anything(),
				expect.anything(),
			);
		});

		it('fires the impression event only once even if loading toggles again', async () => {
			const goalData = buildGoalData({ status: null, loading: true });
			const trackEvent = vi.fn();
			mountSlot({ goalData, trackEvent });
			goalData.loading.value = false;
			await nextTick();
			goalData.loading.value = true;
			await nextTick();
			goalData.loading.value = false;
			await nextTick();
			const impressionCalls = trackEvent.mock.calls.filter(
				([category, action, label]) => category === 'portfolio'
					&& action === 'view'
					&& label === 'set-annual-goal',
			);
			expect(impressionCalls).toHaveLength(1);
		});
	});

	describe('title copy', () => {
		it('renders "Start by setting an impact goal" in the no-goal state', () => {
			const { wrapper } = mountSlot({ goalData: buildGoalData({ status: null }) });
			expect(wrapper.text()).toContain('Start by setting an impact goal');
		});

		it('renders "Continue making progress on your impact goal" in the in-progress state', () => {
			const { wrapper } = mountSlot({
				goalData: buildGoalData({ status: GOAL_STATUS.IN_PROGRESS, percentage: 40 }),
			});
			expect(wrapper.text()).toContain('Continue making progress on your impact goal');
		});

		it('renders "Goal Achieved!" in the completed (first-view) state', () => {
			const { wrapper } = mountSlot({
				goalData: buildGoalData({
					status: GOAL_STATUS.COMPLETED,
					hasViewedCompletedGoal: false,
					percentage: 100,
				}),
			});
			expect(wrapper.text()).toContain('Goal Achieved!');
		});
	});
});
