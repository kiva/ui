import { render } from '@testing-library/vue';
import BuildPageWrapper from '../../../../../src/components/Build/BuildPageWrapper';

// Mock KvDefaultWrapper
vi.mock('#src/components/Kv/KvDefaultWrapper', () => ({
	default: {
		name: 'KvDefaultWrapper',
		template: '<div class="kv-default-wrapper"><slot /></div>'
	}
}));

// Mock @kiva/kv-components
vi.mock('@kiva/kv-components', () => ({
	KvGrid: {
		name: 'KvGrid',
		template: '<div class="kv-grid"><slot /></div>'
	}
}));

describe('BuildPageWrapper', () => {
	const renderComponent = (options = {}) => {
		return render(BuildPageWrapper, {
			...options
		});
	};

	// Component structure tests
	it('should have the correct component name', () => {
		expect(BuildPageWrapper.name).toBe('BuildPageWrapper');
	});

	it('should render KvDefaultWrapper', () => {
		const { container } = renderComponent();
		const wrapper = container.querySelector('.kv-default-wrapper');
		expect(wrapper).toBeTruthy();
	});

	it('should render KvGrid inside KvDefaultWrapper', () => {
		const { container } = renderComponent();
		const grid = container.querySelector('.kv-grid');
		expect(grid).toBeTruthy();
	});

	it('should render KvGrid with correct class', () => {
		const { container } = renderComponent();
		const grid = container.querySelector('.kv-grid');
		expect(grid.classList.contains('tw-grid-cols-12')).toBe(true);
	});

	it('should render inner div with responsive column classes', () => {
		const { container } = renderComponent();
		const innerDiv = container.querySelector('.tw-col-span-12');
		expect(innerDiv).toBeTruthy();
		expect(innerDiv.classList.contains('md:tw-col-span-10')).toBe(true);
		expect(innerDiv.classList.contains('lg:tw-col-span-8')).toBe(true);
	});

	it('should render inner div with responsive column start classes', () => {
		const { container } = renderComponent();
		const innerDiv = container.querySelector('.tw-col-span-12');
		expect(innerDiv.classList.contains('md:tw-col-start-2')).toBe(true);
		expect(innerDiv.classList.contains('lg:tw-col-start-3')).toBe(true);
	});

	// Slot tests
	it('should render slot content', () => {
		const { container } = renderComponent({
			slots: {
				default: '<p>Test content</p>'
			}
		});
		const paragraph = container.querySelector('p');
		expect(paragraph).toBeTruthy();
		expect(paragraph.textContent).toBe('Test content');
	});

	it('should render multiple slot elements', () => {
		const { container } = renderComponent({
			slots: {
				default: '<h1>Title</h1><p>Content</p>'
			}
		});
		const heading = container.querySelector('h1');
		const paragraph = container.querySelector('p');
		expect(heading).toBeTruthy();
		expect(paragraph).toBeTruthy();
		expect(heading.textContent).toBe('Title');
		expect(paragraph.textContent).toBe('Content');
	});

	it('should render complex slot content', () => {
		const { container } = renderComponent({
			slots: {
				default: '<div class="test-class"><span>Nested content</span></div>'
			}
		});
		const testDiv = container.querySelector('.test-class');
		const span = testDiv.querySelector('span');
		expect(testDiv).toBeTruthy();
		expect(span).toBeTruthy();
		expect(span.textContent).toBe('Nested content');
	});

	it('should render empty slot gracefully', () => {
		const { container } = renderComponent({
			slots: {
				default: ''
			}
		});
		const innerDiv = container.querySelector('.tw-col-span-12');
		expect(innerDiv).toBeTruthy();
		expect(innerDiv.textContent.trim()).toBe('');
	});

	// Structure hierarchy tests
	it('should have correct nesting hierarchy', () => {
		const { container } = renderComponent();
		const wrapper = container.querySelector('.kv-default-wrapper');
		const grid = wrapper.querySelector('.kv-grid');
		const innerDiv = grid.querySelector('.tw-col-span-12');
		expect(wrapper).toBeTruthy();
		expect(grid).toBeTruthy();
		expect(innerDiv).toBeTruthy();
	});

	it('should center content with responsive grid', () => {
		const { container } = renderComponent();
		// 12-column grid with content spanning:
		// - 12 cols on mobile (full width)
		// - 10 cols on md, starting at col 2 (centered with 1 col margin each side)
		// - 8 cols on lg, starting at col 3 (centered with 2 col margin each side)
		const innerDiv = container.querySelector('.tw-col-span-12');
		expect(innerDiv.className).toContain('tw-col-span-12');
		expect(innerDiv.className).toContain('md:tw-col-span-10');
		expect(innerDiv.className).toContain('lg:tw-col-span-8');
		expect(innerDiv.className).toContain('md:tw-col-start-2');
		expect(innerDiv.className).toContain('lg:tw-col-start-3');
	});
});
