/* eslint-disable import/no-extraneous-dependencies -- devDependency used only in tests */
import { mount } from '@vue/test-utils';
import { KvLoadingPlaceholder } from '@kiva/kv-components';
import GoalEntrypoint from '#src/components/Thanks/SingleVersion/GoalEntrypoint';

// Stub the local children so the test focuses on GoalEntrypoint's own branching/wiring.
// KvLoadingPlaceholder is left real — it is a simple presentational component.
const RecommendLoanForGoalContainerStub = {
	name: 'RecommendLoanForGoalContainer',
	props: [
		'headerTitle', 'headerDetails', 'contentCardProps',
		'expressCheckoutEnabled', 'isAdding', 'isInBasket', 'loadedSetData',
	],
	emits: ['primary-cta-click'],
	methods: {
		// Mirrors the real component's exposed method.
		getSelectedAmount() {
			return 75;
		},
	},
	template: '<div />',
};

const GoalSelectorStub = {
	name: 'GoalSelector',
	emits: ['set-goal', 'set-goal-target', 'edit-goal'],
	template: '<div />',
};

function mountComponent(props = {}) {
	return mount(GoalEntrypoint, {
		props: {
			selectedCategory: { badgeId: 'womens-equality', name: 'Women' },
			...props,
		},
		global: {
			stubs: {
				RecommendLoanForGoalContainer: RecommendLoanForGoalContainerStub,
				GoalSelector: GoalSelectorStub,
			},
		},
	});
}

describe('GoalEntrypoint', () => {
	describe('rendering branches', () => {
		it('renders the loading placeholder while loading', () => {
			const wrapper = mountComponent({ loading: true });

			expect(wrapper.findComponent(KvLoadingPlaceholder).exists()).toBe(true);
			expect(wrapper.findComponent(GoalSelectorStub).exists()).toBe(false);
			expect(wrapper.findComponent(RecommendLoanForGoalContainerStub).exists()).toBe(false);
		});

		it('renders the goal selector when not loading and the recommend view is off', () => {
			const wrapper = mountComponent({ loading: false, showRecommendLoanAfterGoalView: false });

			expect(wrapper.findComponent(GoalSelectorStub).exists()).toBe(true);
			expect(wrapper.findComponent(RecommendLoanForGoalContainerStub).exists()).toBe(false);
		});

		it('renders the recommended loan container when the view is on and loans are available', () => {
			const wrapper = mountComponent({
				loading: false,
				showRecommendLoanAfterGoalView: true,
				hasRecommendedLoans: true,
			});

			expect(wrapper.findComponent(RecommendLoanForGoalContainerStub).exists()).toBe(true);
			expect(wrapper.findComponent(GoalSelectorStub).exists()).toBe(false);
		});

		it('falls back to the goal selector when recommend view is on but no recommended loans', () => {
			const wrapper = mountComponent({
				loading: false,
				showRecommendLoanAfterGoalView: true,
				hasRecommendedLoans: false,
			});

			expect(wrapper.findComponent(GoalSelectorStub).exists()).toBe(true);
			expect(wrapper.findComponent(RecommendLoanForGoalContainerStub).exists()).toBe(false);
		});

		it('keeps showing the placeholder while loading even if the recommend view is on', () => {
			const wrapper = mountComponent({ loading: true, showRecommendLoanAfterGoalView: true });

			expect(wrapper.findComponent(KvLoadingPlaceholder).exists()).toBe(true);
			expect(wrapper.findComponent(RecommendLoanForGoalContainerStub).exists()).toBe(false);
		});

		it('applies the responsive min-height class to the loading placeholder', () => {
			const wrapper = mountComponent({ loading: true });

			expect(wrapper.findComponent(KvLoadingPlaceholder).classes()).toContain('goal-entrypoint-loading');
		});
	});

	describe('goal selector events', () => {
		it('re-emits set-goal, set-goal-target and edit-goal', () => {
			const wrapper = mountComponent({ showRecommendLoanAfterGoalView: false });
			const selector = wrapper.findComponent(GoalSelectorStub);

			selector.vm.$emit('set-goal', { target: 5 });
			selector.vm.$emit('set-goal-target', 7);
			selector.vm.$emit('edit-goal');

			expect(wrapper.emitted('set-goal')[0]).toEqual([{ target: 5 }]);
			expect(wrapper.emitted('set-goal-target')[0]).toEqual([7]);
			expect(wrapper.emitted('edit-goal')).toHaveLength(1);
		});
	});

	describe('add to basket', () => {
		it('emits add-to-basket with the loan id and selected amount on primary CTA click', () => {
			const wrapper = mountComponent({
				showRecommendLoanAfterGoalView: true,
				hasRecommendedLoans: true,
				recommendLoanCardProps: { loanId: 999 },
			});

			wrapper.findComponent(RecommendLoanForGoalContainerStub).vm.$emit('primary-cta-click');

			expect(wrapper.emitted('add-to-basket')[0]).toEqual([{ loanId: 999, lendAmount: 75 }]);
		});

		it('does not emit add-to-basket when the recommended loan has no id', () => {
			const wrapper = mountComponent({
				showRecommendLoanAfterGoalView: true,
				hasRecommendedLoans: true,
				recommendLoanCardProps: {},
			});

			wrapper.findComponent(RecommendLoanForGoalContainerStub).vm.$emit('primary-cta-click');

			expect(wrapper.emitted('add-to-basket')).toBeUndefined();
		});
	});
});
