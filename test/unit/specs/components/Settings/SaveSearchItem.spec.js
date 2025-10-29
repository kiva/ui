import { render } from '@testing-library/vue';
import SaveSearchItem from '../../../../../src/components/Settings/SaveSearchItem';

const mockSavedSearch = {
	id: 123,
	name: 'Women in Agriculture',
	url: '/lend?gender=female&sector=Agriculture',
	isAlert: true,
	loanSearchCriteria: {
		sortBy: 'popularity',
	},
};

const global = {
	provide: {
		apollo: {
			mutate: vi.fn(() => Promise.resolve({
				data: {
					my: {
						deleteSavedSearch: true,
						updateSavedSearch: { id: 123, name: 'Test', isAlert: true },
					},
				},
			})),
		},
		cookieStore: {
			get: vi.fn(),
			set: vi.fn(),
		},
	},
	stubs: {
		KvSettingsCard: {
			name: 'KvSettingsCard',
			props: ['title'],
			template: `<div class="kv-settings-card">
				<h3>{{ title }}</h3>
				<slot name="content" />
			</div>`,
		},
		KvButton: {
			name: 'KvButton',
			props: ['href', 'variant'],
			template: '<button class="kv-button"><slot /></button>',
		},
		KvCheckbox: {
			name: 'KvCheckbox',
			props: ['modelValue'],
			template: '<label class="kv-checkbox"><input type="checkbox" :checked="modelValue" /><slot /></label>',
		},
	},
};

describe('SaveSearchItem.vue', () => {
	it('renders saved search name as title', () => {
		const { getByText } = render(SaveSearchItem, {
			props: {
				savedSearch: mockSavedSearch,
			},
			global,
		});

		expect(getByText('Women in Agriculture')).toBeTruthy();
	});

	it('renders Sorted by text', () => {
		const { container } = render(SaveSearchItem, {
			props: {
				savedSearch: mockSavedSearch,
			},
			global,
		});

		expect(container.textContent).toContain('Sorted by');
	});

	it('renders email alerts checkbox', () => {
		const { getByText } = render(SaveSearchItem, {
			props: {
				savedSearch: mockSavedSearch,
			},
			global,
		});

		expect(getByText('Email me when new loans become available')).toBeTruthy();
	});

	it('renders View loans button', () => {
		const { getByText } = render(SaveSearchItem, {
			props: {
				savedSearch: mockSavedSearch,
			},
			global,
		});

		const button = getByText('View loans');
		expect(button).toBeTruthy();
	});

	it('renders Delete Search button', () => {
		const { getByText } = render(SaveSearchItem, {
			props: {
				savedSearch: mockSavedSearch,
			},
			global,
		});

		const button = getByText('Delete Search');
		expect(button).toBeTruthy();
	});

	it('has name property', () => {
		expect(SaveSearchItem.name).toBe('SaveSearchItem');
	});

	it('accepts savedSearch prop', () => {
		expect(SaveSearchItem.props.savedSearch).toBeDefined();
		expect(SaveSearchItem.props.savedSearch.type).toBe(Object);
	});

	it('has data properties', () => {
		const data = SaveSearchItem.data.call({ savedSearch: mockSavedSearch });
		expect(data.showAlerts).toBe(true);
	});

	it('has sortByText computed property', () => {
		expect(SaveSearchItem.computed.sortByText).toBeDefined();
	});

	it('has deleteSavedSearch method', () => {
		expect(SaveSearchItem.methods.deleteSavedSearch).toBeDefined();
	});

	it('has emailAlert method', () => {
		expect(SaveSearchItem.methods.emailAlert).toBeDefined();
	});

	it('emits delete-saved-search event', () => {
		expect(SaveSearchItem.emits).toContain('delete-saved-search');
	});

	it('applies tw-text-small class to sort text', () => {
		const { container } = render(SaveSearchItem, {
			props: {
				savedSearch: mockSavedSearch,
			},
			global,
		});

		const sortText = container.querySelector('.tw-text-small');
		expect(sortText).toBeTruthy();
	});

	it('applies tw-mb-2 class to sort paragraph', () => {
		const { container } = render(SaveSearchItem, {
			props: {
				savedSearch: mockSavedSearch,
			},
			global,
		});

		const paragraph = container.querySelector('.tw-text-small.tw-mb-2');
		expect(paragraph).toBeTruthy();
	});

	it('applies tw-mb-2 class to checkbox', () => {
		const { container } = render(SaveSearchItem, {
			props: {
				savedSearch: mockSavedSearch,
			},
			global,
		});

		const checkbox = container.querySelector('.kv-checkbox.tw-mb-2');
		expect(checkbox).toBeTruthy();
	});

	it('applies tw-border-tertiary class to hr', () => {
		const { container } = render(SaveSearchItem, {
			props: {
				savedSearch: mockSavedSearch,
			},
			global,
		});

		const hr = container.querySelector('.tw-border-tertiary');
		expect(hr).toBeTruthy();
	});

	it('applies tw-mr-2 class to View loans button', () => {
		const { container } = render(SaveSearchItem, {
			props: {
				savedSearch: mockSavedSearch,
			},
			global,
		});

		const buttons = container.querySelectorAll('.tw-mr-2');
		expect(buttons.length).toBeGreaterThan(0);
	});

	it('does not render when savedSearch has no name', () => {
		const { container } = render(SaveSearchItem, {
			props: {
				savedSearch: { id: 1, url: '/test' },
			},
			global,
		});

		const card = container.querySelector('.kv-settings-card');
		expect(card).toBeFalsy();
	});

	it('renders KvSettingsCard component', () => {
		const { container } = render(SaveSearchItem, {
			props: {
				savedSearch: mockSavedSearch,
			},
			global,
		});

		const card = container.querySelector('.kv-settings-card');
		expect(card).toBeTruthy();
	});

	it('renders checkbox as checked when isAlert is true', () => {
		const { container } = render(SaveSearchItem, {
			props: {
				savedSearch: mockSavedSearch,
			},
			global,
		});

		const checkbox = container.querySelector('input[type="checkbox"]');
		expect(checkbox?.checked).toBe(true);
	});

	it('renders checkbox as unchecked when isAlert is false', () => {
		const { container } = render(SaveSearchItem, {
			props: {
				savedSearch: { ...mockSavedSearch, isAlert: false },
			},
			global,
		});

		const checkbox = container.querySelector('input[type="checkbox"]');
		expect(checkbox?.checked).toBe(false);
	});

	it('has watch on showAlerts', () => {
		expect(SaveSearchItem.watch.showAlerts).toBeDefined();
	});
});
