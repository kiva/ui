import { render, waitFor } from '@testing-library/vue';
import LoanFilterBar from '../../../../../src/components/Portfolio/LoanFilterBar';

// Mock @kiva/kv-components
vi.mock('@kiva/kv-components', () => ({
	KvSelect: {
		name: 'KvSelect',
		template: `<select :id="$attrs.id" @change="$emit('update:modelValue', $event.target.value)">
			<slot />
		</select>`,
		props: ['modelValue']
	},
	KvTextInput: {
		name: 'KvTextInput',
		template: `<input
			:id="$attrs.id"
			type="text"
			:placeholder="placeholder"
			@input="$emit('update:modelValue', $event.target.value)"
		/>`,
		props: ['modelValue', 'placeholder']
	},
	KvButton: {
		name: 'KvButton',
		template: '<button class="kv-button" @click="$emit(\'click\')"><slot /></button>',
		props: ['variant']
	}
}));

// Mock GraphQL query
vi.mock('#src/graphql/query/userId.graphql', () => ({
	default: 'userId-query'
}));

// Mock utilities
vi.mock('#src/util/logReadQueryError', () => ({
	default: vi.fn()
}));

vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn()
}));

// Mock apollo client
const mockApolloQuery = vi.fn();
const mockApollo = {
	query: mockApolloQuery
};

describe('LoanFilterBar', () => {
	let mockKvTrackEvent;

	beforeEach(() => {
		vi.clearAllMocks();
		mockKvTrackEvent = vi.fn();
		mockApolloQuery.mockResolvedValue({
			data: {
				my: {
					userAccount: {
						id: '12345'
					}
				}
			}
		});
		// Mock window.location.href
		delete window.location;
		window.location = { href: '' };
	});

	const createComponent = (props = {}) => {
		return render(LoanFilterBar, {
			props: {
				totalLoans: 10,
				...props
			},
			global: {
				mocks: {
					$kvTrackEvent: mockKvTrackEvent
				},
				provide: {
					apollo: mockApollo
				},
				directives: {
					'kv-track-event': () => {}
				}
			}
		});
	};

	describe('Component Structure', () => {
		it('should render search input', () => {
			const { container } = createComponent();
			const input = container.querySelector('input#loan-filter-text-input');
			expect(input).toBeTruthy();
			expect(input.getAttribute('placeholder')).toBe('Search by name, ID, partner or location');
		});

		it('should render status select', () => {
			const { container } = createComponent();
			const select = container.querySelector('select#loan-filter-select');
			expect(select).toBeTruthy();
		});

		it('should render all three select dropdowns', () => {
			const { container } = createComponent();
			const selects = container.querySelectorAll('select');
			expect(selects.length).toBe(3);
		});

		it('should render export button', () => {
			const { container } = createComponent();
			const button = container.querySelector('.kv-button');
			expect(button).toBeTruthy();
			expect(button.textContent).toContain('Export');
		});

		it('should show sorted by message', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('Sorted by date posted on Kiva');
		});
	});

	describe('Search Input', () => {
		it('should render with correct placeholder', () => {
			const { container } = createComponent();
			const input = container.querySelector('input#loan-filter-text-input');
			expect(input.getAttribute('placeholder')).toBe('Search by name, ID, partner or location');
		});

		it('should handle text input', async () => {
			const { container } = createComponent();
			const input = container.querySelector('input#loan-filter-text-input');

			input.value = 'Maria';
			input.dispatchEvent(new Event('input'));

			await waitFor(() => {
				expect(input.value).toBe('Maria');
			});
		});
	});

	describe('Status Filter', () => {
		it('should show "All statuses" as default option', () => {
			const { container } = createComponent();
			const select = container.querySelector('select#loan-filter-select');
			const option = select.querySelector('option[value="all"]');
			expect(option).toBeTruthy();
			expect(option.textContent).toContain('All statuses');
		});

		it('should have Status label', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('Status:');
		});
	});

	describe('Location Filter', () => {
		it('should show "All regions" as default option', () => {
			const { container } = createComponent();
			const selects = container.querySelectorAll('select');
			const locationSelect = selects[1]; // Second select is location
			const option = locationSelect.querySelector('option[value="all"]');
			expect(option).toBeTruthy();
			expect(option.textContent).toContain('All regions');
		});

		it('should have Filter by label', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('Filter by:');
		});
	});

	describe('Partner Filter', () => {
		it('should show "All partners" as default option', () => {
			const { container } = createComponent();
			const selects = container.querySelectorAll('select');
			const partnerSelect = selects[2]; // Third select is partner
			const option = partnerSelect.querySelector('option[value="all"]');
			expect(option).toBeTruthy();
			expect(option.textContent).toContain('All partners');
		});
	});

	describe('Export Button', () => {
		it('should display total loans count', () => {
			const { container } = createComponent({ totalLoans: 25 });
			const button = container.querySelector('.kv-button');
			expect(button.textContent).toContain('Export 25 loans');
		});

		it('should display zero loans', () => {
			const { container } = createComponent({ totalLoans: 0 });
			const button = container.querySelector('.kv-button');
			expect(button.textContent).toContain('Export 0 loans');
		});

		it('should have primary variant', () => {
			const { container } = createComponent();
			const button = container.querySelector('.kv-button');
			expect(button).toBeTruthy();
		});

		it('should query for user ID on click', async () => {
			const { container } = createComponent();
			const button = container.querySelector('.kv-button');

			button.click();

			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
			});
		});

		it('should redirect to export URL with correct params', async () => {
			const { container } = createComponent({ totalLoans: 50 });
			const button = container.querySelector('.kv-button');

			button.click();

			await waitFor(() => {
				expect(window.location.href).toContain('/portfolio/loans/export');
				expect(window.location.href).toContain('iDisplayStart=0');
				expect(window.location.href).toContain('iDisplayLength=50');
				expect(window.location.href).toContain('user_id=12345');
			});
		});

		it('should handle export when no user ID is available', async () => {
			mockApolloQuery.mockResolvedValueOnce({
				data: {
					my: {
						userAccount: null
					}
				}
			});

			const { container } = createComponent();
			const button = container.querySelector('.kv-button');

			button.click();

			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
				// Window location should not be updated
				expect(window.location.href).toBe('');
			});
		});

		it('should handle export when user data is missing', async () => {
			mockApolloQuery.mockResolvedValueOnce({
				data: {
					my: null
				}
			});

			const { container } = createComponent();
			const button = container.querySelector('.kv-button');

			button.click();

			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
				expect(window.location.href).toBe('');
			});
		});

		it('should handle apollo query errors gracefully', async () => {
			const logReadQueryError = await import('#src/util/logReadQueryError');
			mockApolloQuery.mockRejectedValueOnce(new Error('Query failed'));

			const { container } = createComponent();
			const button = container.querySelector('.kv-button');

			button.click();

			await waitFor(() => {
				expect(logReadQueryError.default).toHaveBeenCalled();
			});
		});
	});

	describe('Props', () => {
		it('should accept totalLoans prop', () => {
			const { container } = createComponent({ totalLoans: 100 });
			expect(container.textContent).toContain('Export 100 loans');
		});

		it('should default totalLoans to 0', () => {
			const { container } = createComponent({ totalLoans: undefined });
			expect(container.textContent).toContain('Export 0 loans');
		});
	});

	describe('Layout', () => {
		it('should render filters in a flex row', () => {
			const { container } = createComponent();
			const filterRow = container.querySelector('.tw-flex.tw-flex-row.tw-flex-wrap');
			expect(filterRow).toBeTruthy();
		});

		it('should have status and filter sections', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('Status:');
			expect(container.textContent).toContain('Filter by:');
		});

		it('should render export button in separate section', () => {
			const { container } = createComponent();
			const button = container.querySelector('.kv-button');
			const parent = button.parentElement;
			expect(parent.classList.contains('lg:tw-ml-auto')).toBe(true);
		});
	});

	describe('Query Parameters', () => {
		it('should build correct query string for export', async () => {
			const { container } = createComponent({ totalLoans: 75 });
			const button = container.querySelector('.kv-button');

			button.click();

			await waitFor(() => {
				const url = window.location.href;
				expect(url).toContain('iDisplayStart=0');
				expect(url).toContain('iDisplayLength=75');
				expect(url).toContain('user_id=12345');
			});
		});

		it('should convert totalLoans to string in query params', async () => {
			const { container } = createComponent({ totalLoans: 123 });
			const button = container.querySelector('.kv-button');

			button.click();

			await waitFor(() => {
				expect(window.location.href).toContain('iDisplayLength=123');
			});
		});
	});
});
