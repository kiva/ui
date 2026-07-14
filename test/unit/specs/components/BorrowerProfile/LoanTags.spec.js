import { render, fireEvent } from '@testing-library/vue';
import LoanTags from '#src/components/BorrowerProfile/LoanTags';
import { globalOptions } from '../../../specUtils';

const mockAvailableTags = [
	{
		id: 1, name: 'Education', description: 'Loans for education', status: 'active', vocabularyId: 2
	},
	{
		id: 2, name: 'Sustainable Agriculture', description: 'Farming', status: 'active', vocabularyId: 2
	},
	{
		id: 3, name: 'Women-Owned Business', description: 'Women', status: 'active', vocabularyId: 2
	},
];

const stubs = {
	KvCheckbox: {
		template: `<label data-testid="bp-loan-tag-checkbox">
			<input type="checkbox" :checked="modelValue"
				@change="$emit('update:modelValue', $event.target.checked)" />
			<slot></slot>
		</label>`,
		props: ['modelValue'],
		emits: ['update:modelValue'],
	},
};

function renderLoanTags(dataOverrides = {}, propsOverrides = {}) {
	const mutate = vi.fn(() => Promise.resolve({ data: { addOrRemoveTagOnLoan: true } }));
	const showTipMsg = vi.fn();
	const Component = {
		...LoanTags,
		data() {
			return {
				...LoanTags.data.call(this),
				availableTags: mockAvailableTags,
				// Both tags are applied to the loan, but the current user only applied Education;
				// Sustainable Agriculture was applied by another lender.
				loanTagNames: ['Education', 'Sustainable Agriculture'],
				userTagNames: ['Education'],
				availableTagsLoaded: true,
				loanTagsLoaded: true,
				...dataOverrides,
			};
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
				mocks: {
					...globalOptions.mocks,
					$showTipMsg: showTipMsg,
				},
				stubs,
			},
			props: { loanId: 123, isLoggedIn: true, ...propsOverrides },
		}),
		mutate,
		showTipMsg,
	};
}

async function toggleThirdTag(view) {
	await fireEvent.click(view.getByTestId('bp-loan-tag-toggle'));
	const checkboxes = view.getAllByTestId('bp-loan-tag-checkbox');
	await fireEvent.click(checkboxes[2].querySelector('input'));
}

describe('LoanTags', () => {
	it('clicking toggle reveals tag selector', async () => {
		const { getByTestId, getAllByTestId } = renderLoanTags();
		await fireEvent.click(getByTestId('bp-loan-tag-toggle'));
		expect(getAllByTestId('bp-loan-tag-checkbox')).toHaveLength(3);
	});

	it('displays every tag applied to the loan, regardless of who applied it', () => {
		const { getAllByTestId } = renderLoanTags();
		const displayed = getAllByTestId('bp-loan-tag').map(el => el.textContent.trim());
		expect(displayed).toEqual(['Education', 'Sustainable Agriculture']);
	});

	it('checks only tags the current user applied, not tags applied by others (AD-357)', async () => {
		const { getByTestId, getAllByTestId } = renderLoanTags();
		await fireEvent.click(getByTestId('bp-loan-tag-toggle'));
		const checked = getAllByTestId('bp-loan-tag-checkbox')
			.map(el => el.querySelector('input').checked);
		// availableTags order: Education, Sustainable Agriculture, Women-Owned Business
		expect(checked).toEqual([true, false, false]);
	});

	it('optimistically checks a tag the user selects', async () => {
		const { getByTestId, getAllByTestId } = renderLoanTags();
		await fireEvent.click(getByTestId('bp-loan-tag-toggle'));
		const womenOwned = getAllByTestId('bp-loan-tag-checkbox')[2].querySelector('input');
		expect(womenOwned.checked).toBe(false);
		await fireEvent.click(womenOwned);
		expect(womenOwned.checked).toBe(true);
	});

	it('calls the mutation and refetches the tag list when toggling a tag', async () => {
		const view = renderLoanTags();
		await toggleThirdTag(view);
		expect(view.mutate).toHaveBeenCalledWith(expect.objectContaining({
			mutation: expect.anything(),
			variables: { loanId: 123, tagId: 3, checked: true },
			refetchQueries: [{ query: expect.anything(), variables: { loanId: 123 } }],
		}));
	});

	it('shows an error when the mutation resolves false instead of throwing (AD-317)', async () => {
		const view = renderLoanTags();
		view.mutate.mockResolvedValueOnce({ data: { addOrRemoveTagOnLoan: false } });
		await toggleThirdTag(view);

		expect(view.showTipMsg).toHaveBeenCalledWith('There was a problem saving the tag change', 'error');
	});

	it('shows an error when the mutation throws', async () => {
		const view = renderLoanTags();
		view.mutate.mockRejectedValueOnce(new Error('network'));
		await toggleThirdTag(view);

		expect(view.showTipMsg).toHaveBeenCalledWith('There was a problem saving the tag change', 'error');
	});
});
