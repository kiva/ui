import { render, fireEvent } from '@testing-library/vue';
import LoanTags from '#src/components/BorrowerProfile/LoanTags';
import { globalOptions } from '../../../specUtils';

const mockAvailableTags = [
	{ id: 1, name: 'Education', description: 'Loans for education', status: 'active', vocabularyId: 2 },
	{ id: 2, name: 'Sustainable Agriculture', description: 'Farming', status: 'active', vocabularyId: 2 },
	{ id: 3, name: 'Women-Owned Business', description: 'Women', status: 'active', vocabularyId: 2 },
];

const stubs = {
	KvCheckbox: {
		template: '<label data-testid="bp-loan-tag-checkbox"><input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" /><slot></slot></label>',
		props: ['modelValue'],
		emits: ['update:modelValue'],
	},
};

function renderLoanTags(dataOverrides = {}, propsOverrides = {}) {
	const mutate = vi.fn(() => Promise.resolve({}));
	const Component = {
		...LoanTags,
		data() {
			return {
				...LoanTags.data.call(this),
				availableTags: mockAvailableTags,
				tagStates: { 1: true, 2: true, 3: false },
				...dataOverrides,
			};
		},
		mounted() {
			// Skip loadTags in tests
		},
	};

	return {
		...render(Component, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					apollo: {
						...globalOptions.provide.apollo,
						mutate,
					},
				},
				stubs,
			},
			props: { loanId: 123, isLoggedIn: false, ...propsOverrides },
		}),
		mutate,
	};
}

describe('LoanTags', () => {
	it('renders selected tags as links', () => {
		const { getAllByTestId } = renderLoanTags();
		const tags = getAllByTestId('bp-loan-tag');
		expect(tags).toHaveLength(2);
		expect(tags[0].textContent).toContain('Education');
		expect(tags[1].textContent).toContain('Sustainable Agriculture');
	});

	it('shows divider between selected tags', () => {
		const { container } = renderLoanTags();
		expect(container.textContent).toContain('Education |');
	});

	it('does not show tag selector by default', () => {
		const { queryAllByTestId } = renderLoanTags({}, { isLoggedIn: true });
		expect(queryAllByTestId('bp-loan-tag-checkbox')).toHaveLength(0);
	});

	it('logged-in user sees toggle link', () => {
		const { getByTestId } = renderLoanTags({}, { isLoggedIn: true });
		expect(getByTestId('bp-loan-tag-toggle').textContent).toContain('Add more tags');
	});

	it('toggle link shows "Add tags" when no tags selected', () => {
		const { getByTestId } = renderLoanTags(
			{ tagStates: { 1: false, 2: false, 3: false } },
			{ isLoggedIn: true },
		);
		expect(getByTestId('bp-loan-tag-toggle').textContent.trim()).toBe('Add tags');
	});

	it('clicking toggle reveals tag selector', async () => {
		const { getByTestId, getAllByTestId } = renderLoanTags({}, { isLoggedIn: true });
		await fireEvent.click(getByTestId('bp-loan-tag-toggle'));
		expect(getAllByTestId('bp-loan-tag-checkbox')).toHaveLength(3);
	});

	it('anonymous user does not see toggle link', () => {
		const { queryByTestId } = renderLoanTags();
		expect(queryByTestId('bp-loan-tag-toggle')).toBeNull();
	});

	it('hides entire section when no tags and not logged in', () => {
		const { container } = renderLoanTags({ tagStates: { 1: false, 2: false, 3: false } });
		expect(container.querySelector('section')).toBeNull();
	});

	it('calls mutation when toggling a tag', async () => {
		const { getByTestId, getAllByTestId, mutate } = renderLoanTags({}, { isLoggedIn: true });
		await fireEvent.click(getByTestId('bp-loan-tag-toggle'));
		const checkboxes = getAllByTestId('bp-loan-tag-checkbox');
		const input = checkboxes[2].querySelector('input');
		await fireEvent.click(input);
		expect(mutate).toHaveBeenCalledWith({
			mutation: expect.anything(),
			variables: { loanId: 123, tagId: 3, checked: true },
		});
	});
});
