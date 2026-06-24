import { render, fireEvent, waitFor } from '@testing-library/vue';
import LoanFilterBar from '#src/components/Portfolio/LoanFilterBar';

const lastEmittedPayload = emitted => {
	const events = emitted()['filters-changed'];
	return events[events.length - 1][0];
};

const getSelect = (container, id) => container.querySelector(`select#${id}`);

const renderLoanFilterBar = ({
	apollo = null,
	props = {},
} = {}) => {
	const query = vi.fn().mockResolvedValue({
		data: {
			my: {
				userAccount: {
					id: 1234,
				},
			},
		},
	});

	return {
		query,
		...render(LoanFilterBar, {
			props: {
				totalLoans: 45,
				filters: {},
				keywordSearch: '',
				countries: [
					{ isoCode: 'PE', name: 'Peru' },
				],
				partners: [
					{ id: 44, name: 'Partner 44' },
				],
				...props,
			},
			global: {
				provide: {
					apollo: apollo || { query },
				},
				directives: {
					kvTrackEvent: () => {},
				},
				stubs: {
					KvTextInput: {
						props: ['id', 'modelValue', 'placeholder', 'canClear'],
						emits: ['update:modelValue'],
						template: `
							<input
								:id="id"
								:value="modelValue"
								:placeholder="placeholder"
								@input="$emit('update:modelValue', $event.target.value)"
							>
						`,
					},
					KvSelect: {
						props: ['id', 'modelValue'],
						emits: ['update:modelValue'],
						template: `
							<select
								:id="id"
								:value="modelValue"
								@change="$emit('update:modelValue', $event.target.value)"
							>
								<slot />
							</select>
						`,
					},
					KvButton: {
						emits: ['click'],
						template: '<button type="button" @click="$emit(\'click\', $event)"><slot /></button>',
					},
				},
			},
		}),
	};
};

describe('LoanFilterBar', () => {
	beforeEach(() => {
		delete window.location;
		window.location = { href: '' };
	});

	it('emits keyword search only after pressing Enter', async () => {
		const page = renderLoanFilterBar();
		const searchInput = page.getByPlaceholderText('Search by name, ID, partner or location');

		await fireEvent.update(searchInput, ' Maria ');

		expect(page.emitted()['filters-changed']).toBeUndefined();

		await fireEvent.keyUp(searchInput, { key: 'Enter' });

		await waitFor(() => {
			expect(lastEmittedPayload(page.emitted)).toEqual({
				filters: {},
				keywordSearch: 'Maria',
			});
		});
	});

	it('emits keyword search and active filters in the my.loans backend shape', async () => {
		const page = renderLoanFilterBar({
			props: {
				keywordSearch: 'Maria',
			},
		});

		await fireEvent.update(getSelect(page.container, 'loan-status-select'), 'payingBack');
		await fireEvent.update(getSelect(page.container, 'loan-country-select'), 'PE');
		await fireEvent.update(getSelect(page.container, 'loan-partner-select'), '44');

		await waitFor(() => {
			expect(lastEmittedPayload(page.emitted)).toEqual({
				filters: {
					status: 'payingBack',
					country: ['PE'],
					partner: [44],
				},
				keywordSearch: 'Maria',
			});
		});
	});

	it('emits delinquent as a status filter value', async () => {
		const page = renderLoanFilterBar();

		await fireEvent.update(getSelect(page.container, 'loan-status-select'), 'delinquent');

		await waitFor(() => {
			expect(lastEmittedPayload(page.emitted)).toEqual({
				filters: {
					status: 'delinquent',
				},
				keywordSearch: null,
			});
		});
	});

	it('emits a cleared keyword search when the input is emptied via the clear button', async () => {
		const page = renderLoanFilterBar({
			props: {
				keywordSearch: 'Maria',
			},
		});
		const searchInput = page.getByPlaceholderText('Search by name, ID, partner or location');

		await fireEvent.update(searchInput, '');

		await waitFor(() => {
			expect(lastEmittedPayload(page.emitted)).toEqual({
				filters: {},
				keywordSearch: null,
			});
		});
	});

	it('applies the draft keyword search when the input loses focus', async () => {
		const page = renderLoanFilterBar();
		const searchInput = page.getByPlaceholderText('Search by name, ID, partner or location');

		await fireEvent.update(searchInput, ' Maria ');
		await fireEvent.blur(searchInput);

		await waitFor(() => {
			expect(lastEmittedPayload(page.emitted)).toEqual({
				filters: {},
				keywordSearch: 'Maria',
			});
		});
	});

	it('does not emit on blur when the draft keyword search matches the applied value', async () => {
		const page = renderLoanFilterBar({
			props: {
				keywordSearch: 'Maria',
			},
		});
		const searchInput = page.getByPlaceholderText('Search by name, ID, partner or location');

		await fireEvent.blur(searchInput);

		expect(page.emitted()['filters-changed']).toBeUndefined();
	});

	it('hides the clear-filters control when no filters are active', () => {
		const page = renderLoanFilterBar();

		expect(page.queryByTestId('clear-filters')).toBeNull();
	});

	it('shows the clear-filters control when any filter is active', () => {
		const page = renderLoanFilterBar({
			props: {
				filters: { status: 'payingBack' },
			},
		});

		expect(page.queryByTestId('clear-filters')).not.toBeNull();
	});

	it('keeps the clear-filters control hidden while search text is only a draft', async () => {
		const page = renderLoanFilterBar();

		// Typing without Enter/blur is a draft — the search is not applied yet, so "Clear filters"
		// must stay hidden until there is something actually applied to clear.
		await fireEvent.update(page.container.querySelector('#loan-filter-text-input'), 'Maria');

		expect(page.queryByTestId('clear-filters')).toBeNull();
	});

	it('shows the clear-filters control when a keyword search has been applied', () => {
		const page = renderLoanFilterBar({ props: { keywordSearch: 'Maria' } });

		expect(page.queryByTestId('clear-filters')).not.toBeNull();
	});

	it('renders a comma-formatted, pluralized loans count', () => {
		const page = renderLoanFilterBar({ props: { totalLoans: 1234 } });

		expect(page.getByTestId('loans-count').textContent.trim()).toBe('1,234 loans');
	});

	it('renders the singular loans count for exactly one loan', () => {
		const page = renderLoanFilterBar({ props: { totalLoans: 1 } });

		expect(page.getByTestId('loans-count').textContent.trim()).toBe('1 loan');
	});

	it('renders "0 loans" when there are no results', () => {
		const page = renderLoanFilterBar({ props: { totalLoans: 0 } });

		expect(page.getByTestId('loans-count').textContent.trim()).toBe('0 loans');
	});

	it('labels the raised status "Funded" (legacy parity), not "Raised"', () => {
		const page = renderLoanFilterBar();

		const labels = Array.from(getSelect(page.container, 'loan-status-select').querySelectorAll('option'))
			.map(option => option.textContent.trim());
		// Legacy + the stats grid both call this bucket "Funded"; the dropdown must match.
		expect(labels).toContain('Funded');
		expect(labels).not.toContain('Raised');
	});

	it('uses the legacy default filter option labels', () => {
		const page = renderLoanFilterBar();

		const firstOption = id => getSelect(page.container, id).querySelector('option').textContent.trim();
		expect(firstOption('loan-status-select')).toBe('All loans');
		expect(firstOption('loan-country-select')).toBe('All locations');
		expect(firstOption('loan-partner-select')).toBe('All partners');
	});

	it('toggles the small-screen filter accordion via the Filters button', async () => {
		const page = renderLoanFilterBar();

		const toggle = page.getByTestId('filters-toggle');
		expect(toggle.textContent.trim()).toBe('Filters');
		expect(toggle.getAttribute('aria-expanded')).toBe('false');

		await fireEvent.click(toggle);

		expect(toggle.textContent.trim()).toBe('Hide filters');
		expect(toggle.getAttribute('aria-expanded')).toBe('true');
	});

	it('right-aligns the loans count on the export button row', () => {
		const page = renderLoanFilterBar({ props: { totalLoans: 12 } });

		const count = page.getByTestId('loans-count');
		expect(count.textContent.trim()).toBe('12 loans');
		// Pushed to the right of the export row (tw-ml-auto), sharing the row with the export button.
		expect(count.classList.contains('tw-ml-auto')).toBe(true);
		expect(count.parentElement.textContent).toContain('Export 12 loans');
	});

	it('renders the singular export label for exactly one loan', () => {
		const page = renderLoanFilterBar({ props: { totalLoans: 1 } });

		expect(page.getByText('Export 1 loan')).toBeTruthy();
	});

	it('comma-formats the export label count', () => {
		const page = renderLoanFilterBar({ props: { totalLoans: 1234 } });

		expect(page.getByText('Export 1,234 loans')).toBeTruthy();
	});

	it('resets all filters and the keyword search when clear-filters is clicked', async () => {
		const page = renderLoanFilterBar({
			props: {
				filters: {
					status: 'payingBack',
					country: ['PE'],
					partner: [44],
				},
				keywordSearch: 'Maria',
			},
		});

		await fireEvent.click(page.getByTestId('clear-filters'));

		expect(lastEmittedPayload(page.emitted)).toEqual({
			filters: {},
			keywordSearch: null,
		});
		expect(page.getByPlaceholderText('Search by name, ID, partner or location').value).toBe('');
	});

	it('does not apply draft keyword search when a dropdown filter changes before Enter', async () => {
		const page = renderLoanFilterBar({
			props: {
				keywordSearch: 'Applied',
			},
		});

		await fireEvent.update(page.getByPlaceholderText('Search by name, ID, partner or location'), ' Draft ');
		await fireEvent.update(getSelect(page.container, 'loan-status-select'), 'payingBack');

		await waitFor(() => {
			expect(lastEmittedPayload(page.emitted)).toEqual({
				filters: {
					status: 'payingBack',
				},
				keywordSearch: 'Applied',
			});
		});
	});

	it('builds the legacy export URL with the active filters and search term', async () => {
		const page = renderLoanFilterBar({
			props: {
				filters: {
					status: 'payingBack',
					country: ['PE'],
					partner: [44],
				},
				keywordSearch: 'Maria',
			},
		});

		await fireEvent.click(page.getByText('Export 45 loans'));
		await waitFor(() => expect(page.query).toHaveBeenCalled());

		expect(window.location.href).toBe(
			'/portfolio/loans/export?'
			+ 'iDisplayStart=0&'
			+ 'iDisplayLength=45&'
			+ 'user_id=1234&'
			+ 'sSearch=Maria&'
			+ 'sStatus=payingBack&'
			+ 'sCountries=PE&'
			+ 'sPartners=44'
		);
	});

	it('maps the fundraising GraphQL status back to the legacy export status value', async () => {
		const page = renderLoanFilterBar({
			props: {
				filters: {
					status: 'fundraising',
				},
			},
		});

		await fireEvent.click(page.getByText('Export 45 loans'));
		await waitFor(() => expect(page.query).toHaveBeenCalled());

		expect(window.location.href).toBe(
			'/portfolio/loans/export?'
			+ 'iDisplayStart=0&'
			+ 'iDisplayLength=45&'
			+ 'user_id=1234&'
			+ 'sStatus=fundRaising'
		);
	});

	it('builds the legacy export URL with delinquent status when delinquent status is active', async () => {
		const page = renderLoanFilterBar({
			props: {
				filters: {
					status: 'delinquent',
				},
				keywordSearch: '',
			},
		});

		await fireEvent.click(page.getByText('Export 45 loans'));
		await waitFor(() => expect(page.query).toHaveBeenCalled());

		expect(window.location.href).toBe(
			'/portfolio/loans/export?'
			+ 'iDisplayStart=0&'
			+ 'iDisplayLength=45&'
			+ 'user_id=1234&'
			+ 'sStatus=delinquent'
		);
	});

	it('exports the applied keyword search instead of unsubmitted draft text', async () => {
		const page = renderLoanFilterBar({
			props: {
				keywordSearch: 'Applied',
			},
		});

		await fireEvent.update(page.getByPlaceholderText('Search by name, ID, partner or location'), ' Draft ');
		await fireEvent.click(page.getByText('Export 45 loans'));
		await waitFor(() => expect(page.query).toHaveBeenCalled());

		expect(window.location.href).toBe(
			'/portfolio/loans/export?'
			+ 'iDisplayStart=0&'
			+ 'iDisplayLength=45&'
			+ 'user_id=1234&'
			+ 'sSearch=Applied'
		);
	});
});
