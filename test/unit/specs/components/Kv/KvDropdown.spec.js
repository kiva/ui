import { render } from '@testing-library/vue';
import KvDropdown from '../../../../../src/components/Kv/KvDropdown';

// Mock Popper.js
vi.mock('popper.js', () => ({
	default: vi.fn().mockImplementation(() => ({
		scheduleUpdate: vi.fn(),
		destroy: vi.fn()
	}))
}));

describe('KvDropdown.vue', () => {
	let controllerElement;

	beforeEach(() => {
		// Create a controller element in the document
		controllerElement = document.createElement('button');
		controllerElement.id = 'test-controller';
		document.body.appendChild(controllerElement);
	});

	afterEach(() => {
		// Clean up controller element
		if (controllerElement && controllerElement.parentNode) {
			controllerElement.parentNode.removeChild(controllerElement);
		}
	});

	it('renders the dropdown pane', () => {
		const { container } = render(KvDropdown, {
			props: {
				controller: 'test-controller'
			},
			global: {
				provide: {
					apollo: {
						query: vi.fn()
					}
				}
			}
		});

		const dropdown = container.querySelector('.dropdown-pane');
		expect(dropdown).toBeTruthy();
	});

	it('is hidden by default', () => {
		const { container } = render(KvDropdown, {
			props: {
				controller: 'test-controller'
			},
			global: {
				provide: {
					apollo: {
						query: vi.fn()
					}
				}
			}
		});

		const dropdown = container.querySelector('.dropdown-pane');
		expect(dropdown.classList.contains('is-open')).toBe(false);
		expect(dropdown.getAttribute('aria-hidden')).toBe('true');
	});

	it('renders slot content', () => {
		const { getByText } = render(KvDropdown, {
			props: {
				controller: 'test-controller'
			},
			slots: {
				default: 'Dropdown Content'
			},
			global: {
				provide: {
					apollo: {
						query: vi.fn()
					}
				}
			}
		});

		expect(getByText('Dropdown Content')).toBeTruthy();
	});

	it('applies proper styling classes', () => {
		const { container } = render(KvDropdown, {
			props: {
				controller: 'test-controller'
			},
			global: {
				provide: {
					apollo: {
						query: vi.fn()
					}
				}
			}
		});

		const dropdown = container.querySelector('.dropdown-pane');
		expect(dropdown).toBeTruthy();
		// Check for proper CSS class structure
		expect(dropdown.classList.contains('dropdown-pane')).toBe(true);
	});

	it('has openDelay prop with default value of 0', () => {
		expect(KvDropdown.props.openDelay.type).toBe(Number);
		expect(KvDropdown.props.openDelay.default).toBe(0);
	});

	it('has closeDelay prop with default value of 200', () => {
		expect(KvDropdown.props.closeDelay.type).toBe(Number);
		expect(KvDropdown.props.closeDelay.default).toBe(200);
	});

	it('requires controller prop', () => {
		expect(KvDropdown.props.controller.required).toBe(true);
		expect(KvDropdown.props.controller.type).toBe(String);
	});
});
