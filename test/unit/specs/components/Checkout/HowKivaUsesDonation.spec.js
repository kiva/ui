import { render } from '@testing-library/vue';
import HowKivaUsesDonation from '#src/components/Checkout/HowKivaUsesDonation';

// Mock SVG imports
vi.mock('#src/assets/images/support.svg?url', () => ({ default: '/mock-support.svg' }));
vi.mock('#src/assets/images/globe.svg?url', () => ({ default: '/mock-globe.svg' }));
vi.mock('#src/assets/images/puzzle.svg?url', () => ({ default: '/mock-puzzle.svg' }));

describe('HowKivaUsesDonation', () => {
	const renderComponent = () => {
		return render(HowKivaUsesDonation);
	};

	// Component structure tests
	it('should render root div with correct classes', () => {
		const { container } = renderComponent();
		const root = container.querySelector('.tw-prose');
		expect(root).toBeTruthy();
		expect(root.classList.contains('tw-text-base')).toBe(true);
	});

	it('should render three item containers', () => {
		const { container } = renderComponent();
		const items = container.querySelectorAll('.item-container');
		expect(items).toHaveLength(3);
	});

	it('should render all item containers with correct classes', () => {
		const { container } = renderComponent();
		const items = container.querySelectorAll('.item-container');
		items.forEach(item => {
			expect(item.classList.contains('tw-not-prose')).toBe(true);
		});
	});

	it('should render flex container with correct classes', () => {
		const { container } = renderComponent();
		const flexContainer = container.querySelector('.tw-flex.tw-flex-col.tw-gap-2');
		expect(flexContainer).toBeTruthy();
	});

	// Intro paragraph tests
	it('should render intro paragraph', () => {
		const { container } = renderComponent();
		const paragraph = container.querySelector('p');
		expect(paragraph).toBeTruthy();
	});

	it('should display 100% loan support message', () => {
		const { container } = renderComponent();
		const paragraph = container.querySelector('p');
		expect(paragraph.textContent).toContain('At Kiva, 100% of every loan supports borrowers');
	});

	it('should mention no fees taken', () => {
		const { container } = renderComponent();
		const paragraph = container.querySelector('p');
		expect(paragraph.textContent).toContain('we never take a fee');
	});

	it('should mention nonprofit status', () => {
		const { container } = renderComponent();
		const paragraph = container.querySelector('p');
		expect(paragraph.textContent).toContain('As a nonprofit');
	});

	it('should mention donation dependency', () => {
		const { container } = renderComponent();
		const paragraph = container.querySelector('p');
		expect(paragraph.textContent).toContain('dependent on donations from supporters like you');
	});

	it('should mention every dollar helps', () => {
		const { container } = renderComponent();
		const paragraph = container.querySelector('p');
		expect(paragraph.textContent).toContain('Every single dollar donated helps Kiva');
	});

	// Image tests
	it('should render support icon with correct src', () => {
		const { container } = renderComponent();
		const supportImg = container.querySelector('img[alt="donation support"]');
		expect(supportImg).toBeTruthy();
		expect(supportImg.src).toContain('/mock-support.svg');
	});

	it('should render globe icon with correct src', () => {
		const { container } = renderComponent();
		const globeImg = container.querySelector('img[alt="global real impact icon"]');
		expect(globeImg).toBeTruthy();
		expect(globeImg.src).toContain('/mock-globe.svg');
	});

	it('should render puzzle icon with correct src', () => {
		const { container } = renderComponent();
		const puzzleImg = container.querySelector('img[alt="donation partners"]');
		expect(puzzleImg).toBeTruthy();
		expect(puzzleImg.src).toContain('/mock-puzzle.svg');
	});

	it('should render three images total', () => {
		const { container } = renderComponent();
		const images = container.querySelectorAll('img');
		expect(images).toHaveLength(3);
	});

	// Content tests - item 1 (fair lending)
	it('should mention fair and responsible lending practices', () => {
		const { container } = renderComponent();
		const items = container.querySelectorAll('.item-container');
		const firstItem = items[0].querySelector('p');
		expect(firstItem.textContent).toContain('Ensure fair and responsible lending practices');
		expect(firstItem.textContent).toContain('deliver real impact for underserved individuals');
	});

	// Content tests - item 2 (infrastructure)
	it('should mention infrastructure for weekly loans', () => {
		const { container } = renderComponent();
		const items = container.querySelectorAll('.item-container');
		const secondItem = items[1].querySelector('p');
		expect(secondItem.textContent).toContain('Sustain the infrastructure needed to distribute');
	});

	it('should mention $1M in loans each week', () => {
		const { container } = renderComponent();
		const items = container.querySelectorAll('.item-container');
		const secondItem = items[1].querySelector('p');
		expect(secondItem.textContent).toContain('$1M in loans each week');
	});

	it('should mention global borrower reach', () => {
		const { container } = renderComponent();
		const items = container.querySelectorAll('.item-container');
		const secondItem = items[1].querySelector('p');
		expect(secondItem.textContent).toContain('borrowers around the world');
	});

	// Content tests - item 3 (partners)
	it('should mention partnering with organizations', () => {
		const { container } = renderComponent();
		const items = container.querySelectorAll('.item-container');
		const thirdItem = items[2].querySelector('p');
		expect(thirdItem.textContent).toContain('Partner with impact-first organizations');
	});

	it('should mention direct community operations', () => {
		const { container } = renderComponent();
		const items = container.querySelectorAll('.item-container');
		const thirdItem = items[2].querySelector('p');
		expect(thirdItem.textContent).toContain('operating directly in the communities Kiva serves');
	});
});
