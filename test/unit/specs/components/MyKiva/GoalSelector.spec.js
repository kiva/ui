import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import GoalSelector from '#src/components/MyKiva/GoalSetting/GoalSelector';
import goalCopy from '#src/util/goalCopy';
import {
	ID_BASIC_NEEDS,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_SUPPORT_ALL,
	ID_US_ECONOMIC_EQUALITY,
	ID_WOMENS_EQUALITY,
} from '#src/composables/useBadgeData';
import { globalOptions } from '../../../specUtils';

const stripHtml = html => html.replace(/<[^>]*>/g, '');

const getExpectedGoalOptions = ({ lastYear = 0, ytd = 0, useDefault = false }) => {
	if (useDefault) {
		return [3, 4, 5];
	}

	let suggestion1;
	let suggestion2;
	let suggestion3;

	if (lastYear > ytd && lastYear > 2) {
		suggestion1 = lastYear;
		suggestion2 = Math.max(Math.ceil(suggestion1 * 1.25), suggestion1 + 1);
		suggestion3 = Math.max(suggestion1 * 2, suggestion2 + 1);
	} else if (ytd) {
		suggestion1 = ytd + 3;
		suggestion2 = Math.max(Math.ceil(suggestion1 * 1.25), suggestion1 + 1);
		suggestion3 = Math.max(suggestion1 * 2, suggestion2 + 1);
	}

	if (suggestion1 === undefined) {
		return [3, 4, 5];
	}

	return [suggestion1, suggestion2, suggestion3];
};

describe('GoalSelector', () => {
	const flushPromises = () => new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	afterEach(() => {
		vi.useRealTimers();
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
			container.querySelectorAll('span.tw-text-display')
		).map(el => Number(el.textContent.trim())).filter(Number.isFinite);

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
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-01-15T12:00:00'));
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

		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
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

		await vi.runAllTimersAsync();

		const getTitleText = () => getByRole('heading', { level: 2 }).innerHTML;

		// Initial category is Women
		expect(getTitleText()).toContain('women');

		// Refugees
		await user.click(getByTestId('category-refugees'));
		await vi.runAllTimersAsync();
		expect(getTitleText()).toContain('refugees');

		// Climate Action
		await user.click(getByTestId('category-climate'));
		await vi.runAllTimersAsync();
		expect(getTitleText()).toContain('climate action');

		// U.S. Entrepreneurs
		await user.click(getByTestId('category-us'));
		await vi.runAllTimersAsync();
		expect(getTitleText()).toContain('U.S. entrepreneurs');

		// Basic Needs
		await user.click(getByTestId('category-basic-needs'));
		await vi.runAllTimersAsync();
		expect(getTitleText()).toContain('basic needs');

		// Choose as I go (support all)
		await user.click(getByTestId('category-support-all'));
		await vi.runAllTimersAsync();
		expect(getTitleText()).toBe(goalCopy.TITLE_HOW_MANY_LOANS_GENERIC);
		vi.useRealTimers();
	});

	it('shows original last-year copy from January 1 through March 31', async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-03-31T12:00:00'));

		const tieredAchievements = [
			{
				id: ID_WOMENS_EQUALITY,
				progressForYear: 2,
				progressForCurrentYear: 0,
			},
		];

		const { getByRole, queryByText } = render(TestWrapper, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					$kvTrackEvent: vi.fn(),
				},
			},
			props: { tieredAchievements },
		});

		await vi.runAllTimersAsync();

		expect(getByRole('heading', { level: 2 }).textContent)
			.toContain('Last year, you helped 2 women shape their futures!');
		expect(queryByText(goalCopy.CARD_NO_GOAL_YET_EXPERIMENT)).toBeNull();
	});

	it('shows no-goal-yet copy starting April 1', async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-04-01T12:00:00'));

		const tieredAchievements = [
			{
				id: ID_WOMENS_EQUALITY,
				progressForYear: 0,
				progressForCurrentYear: 1,
			},
		];

		const { container, getByRole } = render(TestWrapper, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					$kvTrackEvent: vi.fn(),
				},
			},
			props: { tieredAchievements },
		});

		await vi.runAllTimersAsync();

		expect(getByRole('heading', { level: 2 }).textContent)
			.toBe(goalCopy.CARD_NO_GOAL_YET_EXPERIMENT);
		expect(container.textContent).toContain('How many loans will you make this year?');
		expect(container.textContent).toContain(stripHtml(goalCopy.subtitleLoansAlreadyMade(1)));
	});

	it('shows requested goal question and current-year progress copy', async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-04-01T12:00:00'));

		const tieredAchievements = [
			{
				id: ID_WOMENS_EQUALITY,
				progressForYear: 0,
				progressForCurrentYear: 1,
			},
		];

		const ValuePropsWrapper = {
			components: { GoalSelector },
			props: {
				tieredAchievements: { type: Array, default: () => [] },
			},
			template: `
				<GoalSelector
					:is-goal-set="false"
					:categories-loan-count="{}"
					tracking-category="post-checkout"
					:tiered-achievements="tieredAchievements"
					selected-category-id="${ID_WOMENS_EQUALITY}"
					selected-category-name="Women"
					show-goal-value-props-copy
				/>
			`,
		};

		const { container, getByRole } = render(ValuePropsWrapper, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					$kvTrackEvent: vi.fn(),
				},
			},
			props: { tieredAchievements },
		});

		await vi.runAllTimersAsync();

		expect(getByRole('heading', { level: 2 }).textContent)
			.toBe(goalCopy.CARD_NO_GOAL_YET_EXPERIMENT);
		expect(container.textContent).toContain('How many loans will you make this year?');
		expect(container.textContent).toContain(stripHtml(goalCopy.subtitleLoansAlreadyMade(1)));
	});

	it('shows current-year progress copy after the user selects a new category', async () => {
		const tieredAchievements = [
			{ id: ID_WOMENS_EQUALITY, progressForYear: 0, progressForCurrentYear: 1 },
			{ id: ID_BASIC_NEEDS, progressForYear: 0, progressForCurrentYear: 2 },
		];

		const EditCategoryWrapper = {
			components: { GoalSelector },
			props: {
				tieredAchievements: { type: Array, default: () => [] },
			},
			data() {
				return {
					selectedCategoryId: ID_WOMENS_EQUALITY,
					selectedCategoryName: 'Women',
				};
			},
			methods: {
				selectBasicNeeds() {
					this.selectedCategoryId = ID_BASIC_NEEDS;
					this.selectedCategoryName = 'Basic Needs';
				},
			},
			template: `
				<div>
					<button data-testid="category-basic-needs" @click="selectBasicNeeds">Basic Needs</button>
					<GoalSelector
						:is-goal-set="false"
						:categories-loan-count="{}"
						tracking-category="post-checkout"
						:tiered-achievements="tieredAchievements"
						:selected-category-id="selectedCategoryId"
						:selected-category-name="selectedCategoryName"
						show-goal-value-props-copy
					/>
				</div>
			`,
		};

		const user = userEvent.setup();
		const { container, getByTestId, getByText } = render(EditCategoryWrapper, {
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

		await user.click(getByText('Edit goal category'));
		await user.click(getByTestId('category-basic-needs'));
		await flushPromises();

		expect(container.textContent).toContain(stripHtml(goalCopy.subtitleLoansAlreadyMade(2)));
	});

	it('shows default goal options when user has 2 or fewer loans from last year and none this year', async () => {
		const tieredAchievements = [
			{
				id: ID_WOMENS_EQUALITY,
				progressForYear: 1,
			},
			{
				id: ID_REFUGEE_EQUALITY,
				progressForYear: 2,
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
			container.querySelectorAll('span.tw-text-display')
		).map(el => Number(el.textContent.trim())).filter(Number.isFinite);

		// Women category: 1 loan last year, 0 this year -> default options
		expect(getLoanNumbers()).toEqual([3, 4, 5]);

		// Refugees category: 2 loans last year, 0 this year -> default options
		await user.click(getByTestId('category-refugees'));
		await flushPromises();
		expect(getLoanNumbers()).toEqual([3, 4, 5]);
	});

	it('validates a custom goal amount entered by the user', async () => {
		// progressForCurrentYear drives loansThisYear (5) -> minCustomAmount = 6
		const tieredAchievements = [
			{ id: ID_WOMENS_EQUALITY, progressForYear: 2, progressForCurrentYear: 5 },
		];

		const CustomTestWrapper = {
			components: { GoalSelector },
			props: {
				tieredAchievements: { type: Array, default: () => [] },
			},
			template: `
				<GoalSelector
					:is-goal-set="false"
					:categories-loan-count="{}"
					tracking-category="post-checkout"
					:tiered-achievements="tieredAchievements"
					selected-category-id="${ID_WOMENS_EQUALITY}"
					selected-category-name="Women"
				/>
			`,
		};

		const user = userEvent.setup();
		const {
			container,
			getAllByPlaceholderText,
			getAllByText,
		} = render(CustomTestWrapper, {
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

		// Select the Custom option
		await user.click(getAllByText('Custom')[0]);
		await flushPromises();

		const [input] = getAllByPlaceholderText('Add number');

		// Invalid: below minCustomAmount (loansThisYear=5 -> min = 6)
		await user.type(input, '3');
		await flushPromises();
		expect(container.textContent).toContain(stripHtml(goalCopy.customAmountBelowYearProgress(5, 'loans')));
	});

	it('error when a custom goal amount entered by the user is invalid or 1', async () => {
		const tieredAchievements = [
			{ id: ID_WOMENS_EQUALITY, progressForYear: 0, progressForCurrentYear: 0 },
		];

		const CustomTestWrapper = {
			components: { GoalSelector },
			props: {
				tieredAchievements: { type: Array, default: () => [] },
			},
			template: `
				<GoalSelector
					:is-goal-set="false"
					:categories-loan-count="{}"
					tracking-category="post-checkout"
					:tiered-achievements="tieredAchievements"
					selected-category-id="${ID_WOMENS_EQUALITY}"
					selected-category-name="Women"
				/>
			`,
		};

		const user = userEvent.setup();
		const {
			container,
			getAllByPlaceholderText,
			getAllByText,
		} = render(CustomTestWrapper, {
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

		// Select the Custom option
		await user.click(getAllByText('Custom')[0]);
		await flushPromises();

		const [input] = getAllByPlaceholderText('Add number');

		// Valid: above minCustomAmount
		await user.clear(input);
		await user.type(input, '1');
		await flushPromises();
		expect(container.textContent).not.toContain(stripHtml(goalCopy.customAmountBelowYearProgress(0, 'loans')));
		expect(container.textContent).toContain(goalCopy.CUSTOM_AMOUNT_INVALID);

		// Invalid: cleared input (empty string)
		await user.clear(input);
		await flushPromises();
		expect(container.textContent).toContain(goalCopy.CUSTOM_AMOUNT_INVALID);
	});

	it('accepts a valid custom goal amount with no error shown', async () => {
		// progressForCurrentYear drives loansThisYear (5) -> minCustomAmount = 6
		const tieredAchievements = [
			{ id: ID_WOMENS_EQUALITY, progressForYear: 2, progressForCurrentYear: 5 },
		];

		const CustomTestWrapper = {
			components: { GoalSelector },
			props: {
				tieredAchievements: { type: Array, default: () => [] },
			},
			template: `
				<GoalSelector
					:is-goal-set="false"
					:categories-loan-count="{}"
					tracking-category="post-checkout"
					:tiered-achievements="tieredAchievements"
					selected-category-id="${ID_WOMENS_EQUALITY}"
					selected-category-name="Women"
				/>
			`,
		};

		const user = userEvent.setup();
		const {
			container,
			getAllByPlaceholderText,
			getAllByText,
		} = render(CustomTestWrapper, {
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

		// Select the Custom option
		await user.click(getAllByText('Custom')[0]);
		await flushPromises();

		const [input] = getAllByPlaceholderText('Add number');

		// Valid: above minCustomAmount (6)
		await user.type(input, '10');
		await flushPromises();
		expect(container.textContent).not.toContain(stripHtml(goalCopy.customAmountBelowYearProgress(5, 'loans')));
		expect(container.textContent).not.toContain(goalCopy.CUSTOM_AMOUNT_INVALID);
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
			container.querySelectorAll('span.tw-text-display')
		).map(el => Number(el.textContent.trim())).filter(Number.isFinite);

		// Initial category (Women) with no history falls back to default options
		expect(getLoanNumbers()).toEqual(getExpectedGoalOptions({ useDefault: true }));

		await user.click(getByTestId('category-support-all'));
		await flushPromises();

		expect(apolloQueryMock).toHaveBeenCalled();
		expect(getLoanNumbers()).toEqual(getExpectedGoalOptions({ lastYear: 0, ytd: 10 }));
	});
});
