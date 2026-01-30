import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import GoalSelector from '#src/components/MyKiva/GoalSetting/GoalSelector';
import {
	ID_BASIC_NEEDS,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_SUPPORT_ALL,
	ID_US_ECONOMIC_EQUALITY,
	ID_WOMENS_EQUALITY,
} from '#src/composables/useBadgeData';
import { globalOptions } from '../../../specUtils';

const getExpectedGoalOptions = ({ lastYear = 0, ytd, useDefault = false }) => {
	if (useDefault) {
		return [3, 4, 5];
	}

	const useYtdAsBase = typeof ytd === 'number' && ytd >= lastYear;
	const base = useYtdAsBase ? ytd : lastYear;

	if (base <= 1) {
		return [3, 4, 5];
	}

	const suggestion1 = useYtdAsBase ? base + 1 : base;
	const suggestion2 = Math.max(Math.ceil(base * 1.5), suggestion1 + 1);
	const suggestion3 = Math.max(base * 2, suggestion2 + 1);

	return [suggestion1, suggestion2, suggestion3];
};

describe('GoalSelector', () => {
	const flushPromises = () => new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const TestWrapper = {
		components: { GoalSelector },
		props: {
			tieredAchievements: {
				type: Array,
				default: () => [],
			},
		},
		data() {
			return {
				selectedCategoryId: ID_WOMENS_EQUALITY,
				selectedCategoryName: 'Women',
			};
		},
		methods: {
			selectWomen() {
				this.selectedCategoryId = ID_WOMENS_EQUALITY;
				this.selectedCategoryName = 'Women';
			},
			selectRefugees() {
				this.selectedCategoryId = ID_REFUGEE_EQUALITY;
				this.selectedCategoryName = 'Refugees';
			},
			selectClimateAction() {
				this.selectedCategoryId = ID_CLIMATE_ACTION;
				this.selectedCategoryName = 'Climate Action';
			},
			selectUsEntrepreneurs() {
				this.selectedCategoryId = ID_US_ECONOMIC_EQUALITY;
				this.selectedCategoryName = 'U.S. Entrepreneurs';
			},
			selectBasicNeeds() {
				this.selectedCategoryId = ID_BASIC_NEEDS;
				this.selectedCategoryName = 'Basic Needs';
			},
			selectSupportAll() {
				this.selectedCategoryId = ID_SUPPORT_ALL;
				this.selectedCategoryName = 'Choose as I go';
			},
		},
		template: `
			<div>
				<button data-testid="category-women" @click="selectWomen">Women</button>
				<button data-testid="category-refugees" @click="selectRefugees">Refugees</button>
				<button data-testid="category-climate" @click="selectClimateAction">Climate Action</button>
				<button data-testid="category-us" @click="selectUsEntrepreneurs">U.S. Entrepreneurs</button>
				<button data-testid="category-basic-needs" @click="selectBasicNeeds">Basic Needs</button>
				<button data-testid="category-support-all" @click="selectSupportAll">Choose as I go</button>
				<GoalSelector
					:is-goal-set="false"
					:categories-loan-count="{}"
					tracking-category="post-checkout"
					:tiered-achievements="tieredAchievements"
					:selected-category-id="selectedCategoryId"
					:selected-category-name="selectedCategoryName"
				/>
			</div>
		`,
	};

	it('updates loan number options when the user selects a different category', async () => {
		const tieredAchievements = [
			{
				id: ID_WOMENS_EQUALITY,
				progressForYear: 2,
			},
			{
				id: ID_REFUGEE_EQUALITY,
				progressForYear: 3,
			},
			{
				id: ID_CLIMATE_ACTION,
				progressForYear: 4,
			},
			{
				id: ID_US_ECONOMIC_EQUALITY,
				progressForYear: 5,
			},
			{
				id: ID_BASIC_NEEDS,
				progressForYear: 6,
			},
		];

		const user = userEvent.setup();
		const { container, getByTestId } = render(TestWrapper, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					$kvTrackEvent: vi.fn(),
				},
			},
			props: { tieredAchievements },
		});

		await flushPromises();

		const getLoanNumbers = () => Array.from(
			container.querySelectorAll('span.tw-text-h1')
		).map(el => Number(el.textContent.trim()));

		// Helper to click a category and assert expected goal options
		const expectCategoryOptions = async (testId, expected) => {
			await user.click(getByTestId(testId));
			await flushPromises();
			expect(getLoanNumbers()).toEqual(expected);
		};

		// Initial category: Women (base = 2)
		expect(getLoanNumbers()).toEqual(getExpectedGoalOptions({ lastYear: 2 }));

		// Refugees (base = 3)
		await expectCategoryOptions('category-refugees', getExpectedGoalOptions({ lastYear: 3 }));

		// Climate Action (base = 4)
		await expectCategoryOptions('category-climate', getExpectedGoalOptions({ lastYear: 4 }));

		// U.S. Entrepreneurs (base = 5)
		await expectCategoryOptions('category-us', getExpectedGoalOptions({ lastYear: 5 }));

		// Basic Needs (base = 6)
		await expectCategoryOptions('category-basic-needs', getExpectedGoalOptions({ lastYear: 6 }));

		// Choose as I go (support all) -> default options
		await expectCategoryOptions('category-support-all', getExpectedGoalOptions({ useDefault: true }));
	});

	it('uses YTD loans as base when they exceed last year', async () => {
		const tieredAchievements = [
			{
				id: ID_WOMENS_EQUALITY,
				progressForYear: 1,
				progressForCurrentYear: 3,
			},
			{
				id: ID_REFUGEE_EQUALITY,
				progressForYear: 1,
				progressForCurrentYear: 4,
			},
			{
				id: ID_CLIMATE_ACTION,
				progressForYear: 2,
				progressForCurrentYear: 5,
			},
			{
				id: ID_US_ECONOMIC_EQUALITY,
				progressForYear: 2,
				progressForCurrentYear: 6,
			},
			{
				id: ID_BASIC_NEEDS,
				progressForYear: 3,
				progressForCurrentYear: 7,
			},
		];

		const user = userEvent.setup();
		const { container, getByTestId } = render(TestWrapper, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					$kvTrackEvent: vi.fn(),
				},
			},
			props: { tieredAchievements },
		});

		await flushPromises();

		const getLoanNumbers = () => Array.from(
			container.querySelectorAll('span.tw-text-h1')
		).map(el => Number(el.textContent.trim()));

		const expectCategoryOptions = async (testId, expected) => {
			await user.click(getByTestId(testId));
			await flushPromises();
			expect(getLoanNumbers()).toEqual(expected);
		};

		// Women: last year = 1, YTD = 3
		expect(getLoanNumbers()).toEqual(getExpectedGoalOptions({ lastYear: 1, ytd: 3 }));

		// Refugees: last year = 1, YTD = 4
		await expectCategoryOptions('category-refugees', getExpectedGoalOptions({ lastYear: 1, ytd: 4 }));

		// Climate Action: last year = 2, YTD = 5
		await expectCategoryOptions('category-climate', getExpectedGoalOptions({ lastYear: 2, ytd: 5 }));

		// U.S. Entrepreneurs: last year = 2, YTD = 6
		await expectCategoryOptions('category-us', getExpectedGoalOptions({ lastYear: 2, ytd: 6 }));

		// Basic Needs: last year = 3, YTD = 7
		await expectCategoryOptions('category-basic-needs', getExpectedGoalOptions({ lastYear: 3, ytd: 7 }));
	});

	it('uses last year loans as base when they exceed YTD', async () => {
		const tieredAchievements = [
			{
				id: ID_WOMENS_EQUALITY,
				progressForYear: 3,
				progressForCurrentYear: 1,
			},
			{
				id: ID_REFUGEE_EQUALITY,
				progressForYear: 4,
				progressForCurrentYear: 2,
			},
			{
				id: ID_CLIMATE_ACTION,
				progressForYear: 5,
				progressForCurrentYear: 3,
			},
			{
				id: ID_US_ECONOMIC_EQUALITY,
				progressForYear: 6,
				progressForCurrentYear: 4,
			},
			{
				id: ID_BASIC_NEEDS,
				progressForYear: 7,
				progressForCurrentYear: 5,
			},
		];

		const user = userEvent.setup();
		const { container, getByTestId } = render(TestWrapper, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					$kvTrackEvent: vi.fn(),
				},
			},
			props: { tieredAchievements },
		});

		await flushPromises();

		const getLoanNumbers = () => Array.from(
			container.querySelectorAll('span.tw-text-h1')
		).map(el => Number(el.textContent.trim()));

		const expectCategoryOptions = async (testId, expected) => {
			await user.click(getByTestId(testId));
			await flushPromises();
			expect(getLoanNumbers()).toEqual(expected);
		};

		// Women: last year = 3, YTD = 1
		expect(getLoanNumbers()).toEqual(getExpectedGoalOptions({ lastYear: 3, ytd: 1 }));

		// Refugees: last year = 4, YTD = 2
		await expectCategoryOptions('category-refugees', getExpectedGoalOptions({ lastYear: 4, ytd: 2 }));

		// Climate Action: last year = 5, YTD = 3
		await expectCategoryOptions('category-climate', getExpectedGoalOptions({ lastYear: 5, ytd: 3 }));

		// U.S. Entrepreneurs: last year = 6, YTD = 4
		await expectCategoryOptions('category-us', getExpectedGoalOptions({ lastYear: 6, ytd: 4 }));

		// Basic Needs: last year = 7, YTD = 5
		await expectCategoryOptions('category-basic-needs', getExpectedGoalOptions({ lastYear: 7, ytd: 5 }));
	});

	it('fetches support-all loan count via apollo when selecting Choose as I go', async () => {
		const apolloQueryMock = vi.fn().mockResolvedValue({
			data: {
				my: {
					lendingStats: {
						loanStatsByYear: {
							count: 10,
							amount: 0,
						},
					},
				},
			},
		});

		const user = userEvent.setup();
		const { container, getByTestId } = render(TestWrapper, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					apollo: {
						...globalOptions.provide.apollo,
						query: apolloQueryMock,
					},
					$kvTrackEvent: vi.fn(),
				},
			},
			props: { tieredAchievements: [] },
		});

		await flushPromises();

		const getLoanNumbers = () => Array.from(
			container.querySelectorAll('span.tw-text-h1')
		).map(el => Number(el.textContent.trim()));

		// Initial category (Women) with no history falls back to default options
		expect(getLoanNumbers()).toEqual(getExpectedGoalOptions({ useDefault: true }));

		await user.click(getByTestId('category-support-all'));
		await flushPromises();

		expect(apolloQueryMock).toHaveBeenCalled();
		expect(getLoanNumbers()).toEqual(getExpectedGoalOptions({ lastYear: 0, ytd: 10 }));
	});
});
