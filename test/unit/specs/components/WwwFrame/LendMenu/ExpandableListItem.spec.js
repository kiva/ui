import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import ExpandableListItem from '#src/components/WwwFrame/LendMenu/ExpandableListItem';

// Mock KvExpandable
vi.mock('#src/components/Kv/KvExpandable', () => ({
	default: {
		name: 'KvExpandable',
		props: ['easing'],
		template: '<div class="kv-expandable" :data-easing="easing"><slot /></div>'
	}
}));

describe('ExpandableListItem', () => {
	const defaultProps = {
		id: 'test-id'
	};

	const renderComponent = (props = {}, slots = {}) => {
		return render(ExpandableListItem, {
			props: {
				...defaultProps,
				...props
			},
			slots: {
				title: '<span>Test Title</span>',
				default: '<p>Test Content</p>',
				...slots
			}
		});
	};

	// Component structure tests
	it('should have the correct component name', () => {
		expect(ExpandableListItem.name).toBe('ExpandableListItem');
	});

	it('should render as a list item', () => {
		const { container } = renderComponent();
		const listItem = container.querySelector('li');
		expect(listItem).toBeTruthy();
		expect(listItem.classList.contains('expandable-list-item')).toBe(true);
	});

	it('should render a button for toggling', () => {
		const { container } = renderComponent();
		const button = container.querySelector('button');
		expect(button).toBeTruthy();
	});

	it('should render KvExpandable component', () => {
		const { container } = renderComponent();
		const expandable = container.querySelector('.kv-expandable');
		expect(expandable).toBeTruthy();
	});

	it('should use ease-in-out easing for KvExpandable', () => {
		const { container } = renderComponent();
		const expandable = container.querySelector('.kv-expandable');
		expect(expandable.getAttribute('data-easing')).toBe('ease-in-out');
	});

	// Props tests - id
	it('should apply id to expandable pane', () => {
		const { container } = renderComponent({ id: 'custom-id' });
		const pane = container.querySelector('#custom-id');
		expect(pane).toBeTruthy();
	});

	it('should use id for aria-controls on button', () => {
		const { container } = renderComponent({ id: 'custom-id' });
		const button = container.querySelector('button');
		expect(button.getAttribute('aria-controls')).toBe('custom-id');
	});

	// Props tests - startOpen
	it('should start closed by default', () => {
		const { container } = renderComponent();
		const button = container.querySelector('button');
		expect(button.getAttribute('aria-expanded')).toBe('false');
	});

	it('should start open when startOpen is true', () => {
		const { container } = renderComponent({ startOpen: true });
		const button = container.querySelector('button');
		expect(button.getAttribute('aria-expanded')).toBe('true');
	});

	it('should hide pane when closed', () => {
		const { container } = renderComponent();
		const pane = container.querySelector('.kv-expandable-pane');
		expect(pane.style.display).toBe('none');
	});

	it('should show pane when started open', () => {
		const { container } = renderComponent({ startOpen: true });
		const pane = container.querySelector('.kv-expandable-pane');
		expect(pane.style.display).not.toBe('none');
	});

	// Accessibility tests
	it('should set aria-expanded to false when closed', () => {
		const { container } = renderComponent();
		const button = container.querySelector('button');
		expect(button.getAttribute('aria-expanded')).toBe('false');
	});

	it('should set aria-expanded to true when open', () => {
		const { container } = renderComponent({ startOpen: true });
		const button = container.querySelector('button');
		expect(button.getAttribute('aria-expanded')).toBe('true');
	});

	it('should set aria-hidden to true when closed', () => {
		const { container } = renderComponent();
		const pane = container.querySelector('.kv-expandable-pane');
		expect(pane.getAttribute('aria-hidden')).toBe('true');
	});

	it('should set aria-hidden to false when open', () => {
		const { container } = renderComponent({ startOpen: true });
		const pane = container.querySelector('.kv-expandable-pane');
		expect(pane.getAttribute('aria-hidden')).toBe('false');
	});

	// Toggle interaction tests
	it('should toggle from closed to open when button clicked', async () => {
		const user = userEvent.setup();
		const { container } = renderComponent();
		const button = container.querySelector('button');

		expect(button.getAttribute('aria-expanded')).toBe('false');
		await user.click(button);
		expect(button.getAttribute('aria-expanded')).toBe('true');
	});

	it('should toggle from open to closed when button clicked', async () => {
		const user = userEvent.setup();
		const { container } = renderComponent({ startOpen: true });
		const button = container.querySelector('button');

		expect(button.getAttribute('aria-expanded')).toBe('true');
		await user.click(button);
		expect(button.getAttribute('aria-expanded')).toBe('false');
	});

	it('should toggle multiple times', async () => {
		const user = userEvent.setup();
		const { container } = renderComponent();
		const button = container.querySelector('button');

		expect(button.getAttribute('aria-expanded')).toBe('false');
		await user.click(button);
		expect(button.getAttribute('aria-expanded')).toBe('true');
		await user.click(button);
		expect(button.getAttribute('aria-expanded')).toBe('false');
		await user.click(button);
		expect(button.getAttribute('aria-expanded')).toBe('true');
	});

	// Slot tests
	it('should render title slot content in button', () => {
		const { container } = renderComponent({}, {
			title: '<span>Custom Title</span>'
		});
		const button = container.querySelector('button');
		expect(button.textContent).toContain('Custom Title');
	});

	it('should render default slot content in expandable pane', () => {
		const { container } = renderComponent({}, {
			default: '<p>Custom Content</p>'
		});
		const pane = container.querySelector('.kv-expandable-pane');
		expect(pane.textContent).toContain('Custom Content');
	});

	it('should render complex title slot content', () => {
		const { container } = renderComponent({}, {
			title: '<strong>Bold</strong> <em>Italic</em>'
		});
		const button = container.querySelector('button');
		expect(button.querySelector('strong')).toBeTruthy();
		expect(button.querySelector('em')).toBeTruthy();
	});

	it('should render complex default slot content', () => {
		const { container } = renderComponent({}, {
			default: '<ul><li>Item 1</li><li>Item 2</li></ul>'
		});
		const pane = container.querySelector('.kv-expandable-pane');
		const listItems = pane.querySelectorAll('li');
		expect(listItems).toHaveLength(2);
	});

	// Method tests
	it('should have toggle method', async () => {
		const { container } = renderComponent();
		const button = container.querySelector('button');

		expect(button.getAttribute('aria-expanded')).toBe('false');
		await button.click();
		expect(button.getAttribute('aria-expanded')).toBe('true');
	});

	// Pane visibility based on open state
	it('should update pane visibility when toggled', async () => {
		const user = userEvent.setup();
		const { container } = renderComponent();
		const button = container.querySelector('button');
		const pane = container.querySelector('.kv-expandable-pane');

		expect(pane.style.display).toBe('none');
		await user.click(button);
		expect(pane.style.display).not.toBe('none');
	});

	it('should update aria attributes when toggled', async () => {
		const user = userEvent.setup();
		const { container } = renderComponent();
		const button = container.querySelector('button');
		const pane = container.querySelector('.kv-expandable-pane');

		expect(button.getAttribute('aria-expanded')).toBe('false');
		expect(pane.getAttribute('aria-hidden')).toBe('true');

		await user.click(button);

		expect(button.getAttribute('aria-expanded')).toBe('true');
		expect(pane.getAttribute('aria-hidden')).toBe('false');
	});

	// ID validator edge cases
	it('should accept valid HTML5 id', () => {
		const { container } = renderComponent({ id: 'valid-id-123' });
		const pane = container.querySelector('#valid-id-123');
		expect(pane).toBeTruthy();
	});

	it('should accept id with hyphens and underscores', () => {
		const { container } = renderComponent({ id: 'valid_id-with-chars' });
		const pane = container.querySelector('#valid_id-with-chars');
		expect(pane).toBeTruthy();
	});
});
