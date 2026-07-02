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
	const mutate = vi.fn(() => Promise.resolve({}));
	const Component = {
		...LoanTags,
		data() {
			return {
				...LoanTags.data.call(this),
				availableTags: mockAvailableTags,
				currentTagNames: ['Education', 'Sustainable Agriculture'],
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
				stubs,
			},
			props: { loanId: 123, isLoggedIn: true, ...propsOverrides },
		}),
		mutate,
	};
}

describe('LoanTags', () => {
	it('clicking toggle reveals tag selector', async () => {
		const { getByTestId, getAllByTestId } = renderLoanTags();
		await fireEvent.click(getByTestId('bp-loan-tag-toggle'));
		expect(getAllByTestId('bp-loan-tag-checkbox')).toHaveLength(3);
	});

	it('calls mutation when toggling a tag', async () => {
		const { getByTestId, getAllByTestId, mutate } = renderLoanTags();
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
