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
import { SAME_AS_LAST_YEAR_LIMIT } from '#src/composables/useGoalData';
import { globalOptions } from '../../../specUtils';

const getExpectedGoalOptions = ({ lastYear = 0, ytd, useDefault = false }) => {
	if (useDefault) {
		return [3, 4, 5];
	}

	let suggestion1;
	let suggestion2;
	let suggestion3;

	if (ytd >= SAME_AS_LAST_YEAR_LIMIT) {
		suggestion1 = ytd + 3;
		suggestion2 = Math.max(Math.ceil(suggestion1 * 1.5), suggestion1 + 1);
		suggestion3 = Math.max(suggestion1 * 2, suggestion2 + 1);
	} else if (lastYear >= SAME_AS_LAST_YEAR_LIMIT) {
		suggestion1 = lastYear;
		suggestion2 = Math.max(Math.ceil(lastYear * 1.5), suggestion1 + 1);
		suggestion3 = Math.max(lastYear * 2, suggestion2 + 1);
	}

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

	it('renders the selected category name in the title when the user changes category', async () => {
		const tieredAchievements = [
			{
				id: ID_WOMENS_EQUALITY,
				progressForYear: 2,
			},
			{
				id: ID_REFUGEE_EQUALITY,
				progressForYear: 3,
			},
		];

		const user = userEvent.setup();
		const { getByRole, getByTestId } = render(TestWrapper, {
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

		const getTitleText = () => getByRole('heading', { level: 2 }).innerHTML;

		// Initial category is Women
		expect(getTitleText()).toContain('women');

		// Refugees
		await user.click(getByTestId('category-refugees'));
		await flushPromises();
		expect(getTitleText()).toContain('refugees');

		// Climate Action
		await user.click(getByTestId('category-climate'));
		await flushPromises();
		expect(getTitleText()).toContain('climate action');

		// U.S. Entrepreneurs
		await user.click(getByTestId('category-us'));
		await flushPromises();
		expect(getTitleText()).toContain('u.s. entrepreneurs');

		// Basic Needs
		await user.click(getByTestId('category-basic-needs'));
		await flushPromises();
		expect(getTitleText()).toContain('basic needs');

		// Choose as I go (support all)
		await user.click(getByTestId('category-support-all'));
		await flushPromises();
		expect(getTitleText()).toBe('How many loans will you make this year?');
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
