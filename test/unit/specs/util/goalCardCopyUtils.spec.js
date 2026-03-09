import { render } from '@testing-library/vue';
import {
	ID_SUPPORT_ALL,
	ID_CLIMATE_ACTION,
	ID_BASIC_NEEDS,
	ID_REFUGEE_EQUALITY,
	ID_US_ECONOMIC_EQUALITY,
	ID_WOMENS_EQUALITY,
} from '#src/composables/useBadgeData';
import GoalProgressRing from '#src/components/MyKiva/GoalProgressRing';

describe('GoalProgressRing.vue', () => {
	describe('modalDescriptionText computed property', () => {
		it('returns correct description for ID_SUPPORT_ALL category', () => {
			const testProps = {
				variant: 'modal',
				categoryId: ID_SUPPORT_ALL,
				goalLoans: 10,
				goalProgress: 0,
			};

			const { container } = render(GoalProgressRing, {
				props: testProps,
			});

			const description = container.querySelector('.modal-description-text');
			// eslint-disable-next-line max-len
			expect(description.innerHTML).toBe(`Your goal to support <span class="tw-text-brand">${testProps.goalLoans} loans</span> begins here.`);
		});

		it('returns correct description for ID_CLIMATE_ACTION category', () => {
			const testProps = {
				variant: 'modal',
				categoryId: ID_CLIMATE_ACTION,
				categoryName: 'Eco-Friendly',
				goalProgress: 0,
				goalLoans: 10,
			};

			const { container } = render(GoalProgressRing, {
				props: testProps,
			});

			const description = container.querySelector('.modal-description-text');
			// eslint-disable-next-line max-len
			expect(description.innerHTML).toBe(`Your goal to support <span class="tw-text-brand">${testProps.goalLoans} loans</span> to <span class="tw-text-brand"> ${testProps.categoryName.toLowerCase()}</span> begins here.`);
		});

		it('returns correct description for ID_BASIC_NEEDS category', () => {
			const testProps = {
				variant: 'modal',
				categoryId: ID_BASIC_NEEDS,
				categoryName: 'Basic Needs',
				goalProgress: 0,
				goalLoans: 8,
			};

			const { container } = render(GoalProgressRing, {
				props: testProps,
			});

			const description = container.querySelector('.modal-description-text');
			// eslint-disable-next-line max-len
			expect(description.innerHTML).toBe(`Your goal to support <span class="tw-text-brand">${testProps.goalLoans} loans</span> to <span class="tw-text-brand"> ${testProps.categoryName.toLowerCase()}</span> begins here.`);
		});

		it('returns correct description for ID_REFUGEE_EQUALITY category', () => {
			const testProps = {
				variant: 'modal',
				categoryId: ID_REFUGEE_EQUALITY,
				categoryName: 'Refugees',
				goalProgress: 0,
				goalLoans: 12,
			};

			const { container } = render(GoalProgressRing, {
				props: testProps,
			});

			const description = container.querySelector('.modal-description-text');
			// eslint-disable-next-line max-len
			expect(description.innerHTML).toBe(`Your goal to support <span class="tw-text-brand">${testProps.goalLoans} loans</span> to <span class="tw-text-brand"> ${testProps.categoryName.toLowerCase()}</span> begins here.`);
		});

		it('returns correct description for ID_US_ECONOMIC_EQUALITY category', () => {
			const testProps = {
				variant: 'modal',
				categoryId: ID_US_ECONOMIC_EQUALITY,
				categoryName: 'U.S entrepreneurs',
				goalProgress: 0,
				goalLoans: 6,
			};

			const { container } = render(GoalProgressRing, {
				props: testProps,
			});

			const description = container.querySelector('.modal-description-text');
			// eslint-disable-next-line max-len
			expect(description.innerHTML).toBe(`Your goal to support <span class="tw-text-brand">${testProps.goalLoans} loans</span> to <span class="tw-text-brand"> ${testProps.categoryName}</span> begins here.`);
		});

		it('returns correct description for ID_WOMENS_EQUALITY category', () => {
			const testProps = {
				variant: 'modal',
				categoryId: ID_WOMENS_EQUALITY,
				categoryName: 'Women',
				goalProgress: 0,
				goalLoans: 15,
			};

			const { container } = render(GoalProgressRing, {
				props: testProps,
			});

			const description = container.querySelector('.modal-description-text');
			// eslint-disable-next-line max-len
			expect(description.innerHTML).toBe(`Your goal to support <span class="tw-text-brand">${testProps.goalLoans} loans</span> to <span class="tw-text-brand"> ${testProps.categoryName.toLowerCase()}</span> begins here.`);
		});
	});
});
