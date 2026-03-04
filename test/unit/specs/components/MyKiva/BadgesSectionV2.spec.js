/* eslint-disable vue/one-component-per-file */
import { render, fireEvent } from '@testing-library/vue';
import { ref, defineComponent } from 'vue';
import BadgesSectionV2 from '#src/components/MyKiva/BadgesSectionV2';
import { globalOptions } from '../../../specUtils';

vi.mock('vue-router', () => ({
	useRouter: () => ({
		push: vi.fn(),
		currentRoute: { value: { path: '/portfolio' } },
	}),
}));

vi.mock('@kiva/kv-components', () => ({
	KvCarousel: defineComponent({
		name: 'KvCarousel',
		template: '<div data-testid="carousel"><slot v-for="n in 10" :name="\'slide\' + n" /></div>',
	}),
	KvLoadingPlaceholder: defineComponent({
		name: 'KvLoadingPlaceholder',
		template: '<div data-testid="loading-placeholder" />',
	}),
}));

vi.mock('#src/components/MyKiva/MyKivaProgressCard', () => ({
	default: defineComponent({
		name: 'MyKivaProgressCard',
		// eslint-disable-next-line vue/require-prop-types
		props: ['goal', 'isAnnualGoal', 'goalProgress'],
		template: '<div data-testid="progress-card">{{ goal?.name }}</div>',
	}),
}));

vi.mock('#src/composables/useBadgeData', async importOriginal => {
	const actual = await importOriginal();
	return {
		...actual,
		default: () => ({
			getActiveTierData: badge => ({
				target: badge?.achievementData?.tiers?.[0]?.target ?? 0,
				level: 1,
			}),
		}),
	};
});

const createBadgeData = (id, { totalProgress = 5, tierCount = 7, level = 1 } = {}) => ({
	id,
	challengeName: `${id} challenge`,
	level,
	hasStarted: totalProgress > 0,
	contentfulData: Array.from({ length: tierCount }, (_, i) => ({
		id,
		level: i + 1,
		levelName: `${i + 1}`,
		challengeName: `${id} challenge`,
		imageUrl: '',
	})),
	achievementData: {
		id,
		totalProgressToAchievement: totalProgress,
		tiers: Array.from({ length: tierCount }, (_, i) => ({
			target: (i + 1) * 2,
			level: i + 1,
			completedDate: null,
		})),
	},
});

const defaultBadgeData = [
	createBadgeData('womens-equality', { totalProgress: 10, level: 3 }),
	createBadgeData('us-economic-equality', { totalProgress: 5, level: 2 }),
	createBadgeData('climate-action', { totalProgress: 3, level: 1 }),
	createBadgeData('refugee-equality', { totalProgress: 1, level: 0 }),
	createBadgeData('basic-needs', { totalProgress: 7, level: 2 }),
];

const createGoalData = (overrides = {}) => ({
	getCtaHref: vi.fn(() => '/lend'),
	goalProgress: ref(overrides.goalProgress ?? 0),
	goalProgressPercentage: ref(overrides.goalProgressPercentage ?? 0),
	loading: ref(overrides.loading ?? true),
	userGoal: ref(overrides.userGoal ?? null),
	userGoalAchieved: ref(overrides.userGoalAchieved ?? false),
});

const renderComponent = (props = {}, goalData = createGoalData()) => {
	return render(BadgesSectionV2, {
		props: {
			badgeData: [],
			...props,
		},
		global: {
			...globalOptions,
			provide: {
				...globalOptions.provide,
				$kvTrackEvent: vi.fn(),
				goalData,
			},
		},
	});
};

describe('BadgesSectionV2', () => {
	describe('loading state', () => {
		it('shows loading placeholders while goal data is loading', async () => {
			const goalData = createGoalData({ loading: true });
			const { getAllByTestId, queryByTestId } = await renderComponent({
				badgeData: defaultBadgeData,
			}, goalData);
			expect(getAllByTestId('loading-placeholder').length).toBeGreaterThan(0);
			expect(queryByTestId('carousel')).toBeNull();
		});

		it('shows carousel once goal data has loaded', async () => {
			const goalData = createGoalData({ loading: false });
			const { getByTestId, queryByTestId } = await renderComponent({
				badgeData: defaultBadgeData,
			}, goalData);
			expect(queryByTestId('loading-placeholder')).toBeNull();
			expect(getByTestId('carousel')).toBeTruthy();
		});

		it('shows carousel after goal data loads even when user has no goal', () => {
			const goalData = createGoalData({ loading: false, userGoal: null });
			const { getByTestId, queryByTestId } = renderComponent({
				badgeData: defaultBadgeData,
			}, goalData);
			expect(queryByTestId('loading-placeholder')).toBeNull();
			expect(getByTestId('carousel')).toBeTruthy();
		});
	});

	describe('annual goal card', () => {
		it('includes annual goal card when user has a goal', async () => {
			const goalData = createGoalData({
				loading: false,
				userGoal: { target: 10, name: 'My Goal', category: 'womens-equality' },
				goalProgress: 3,
			});
			const { getAllByTestId } = await renderComponent(
				{ badgeData: defaultBadgeData },
				goalData,
			);

			const cards = getAllByTestId('progress-card');
			expect(cards.length).toBeGreaterThan(defaultBadgeData.length);
		});

		it('does not include annual goal card when user has no goal', async () => {
			const goalData = createGoalData({ loading: false });
			const { getAllByTestId } = await renderComponent(
				{ badgeData: defaultBadgeData },
				goalData,
			);

			const cards = getAllByTestId('progress-card');
			expect(cards.length).toBeLessThanOrEqual(defaultBadgeData.length);
		});

		it('renders goal card and badges together in a single render', async () => {
			const goalData = createGoalData({
				loading: false,
				userGoal: { target: 10, name: 'My Goal', category: 'womens-equality' },
				goalProgress: 3,
			});
			const { getAllByTestId, queryByTestId } = await renderComponent(
				{ badgeData: defaultBadgeData },
				goalData,
			);

			expect(queryByTestId('loading-placeholder')).toBeNull();
			expect(getAllByTestId('progress-card').length).toBe(defaultBadgeData.length + 1);
		});
	});

	describe('badge click tracking', () => {
		it('emits badge-clicked for non-annual-goal badges', async () => {
			const goalData = createGoalData({ loading: false });
			const { emitted, getAllByTestId } = await renderComponent(
				{ badgeData: defaultBadgeData },
				goalData,
			);

			const cards = getAllByTestId('progress-card');
			await fireEvent.click(cards[0].closest('[class*="cursor-pointer"]'));

			expect(emitted()['badge-clicked']).toBeTruthy();
		});
	});
});
