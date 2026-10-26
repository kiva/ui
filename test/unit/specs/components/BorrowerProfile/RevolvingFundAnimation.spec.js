import { render, waitFor } from '@testing-library/vue';
import { nextTick } from 'vue';
import RevolvingFundAnimation from '#src/components/BorrowerProfile/RevolvingFundAnimation';

const outer = container => container.querySelector('.cycle-outer');
const inner = container => container.querySelector('.cycle-inner');

// What the stubbed observer does with its callback when observe() is called.
let onObserve = () => undefined;

function ResizeObserverStub(callback) {
	this.observe = () => onObserve(callback);
	this.unobserve = () => undefined;
	this.disconnect = () => undefined;
}

describe('RevolvingFundAnimation', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		onObserve = () => undefined;
	});

	describe('without ResizeObserver support', () => {
		beforeEach(() => {
			vi.stubGlobal('ResizeObserver', undefined);
		});

		it('still reveals the stage rather than hiding it forever', async () => {
			const { container } = render(RevolvingFundAnimation);

			await waitFor(() => expect(inner(container).style.opacity).toBe('1'));
		});

		it('falls back to an unscaled stage', async () => {
			const { container } = render(RevolvingFundAnimation);

			await waitFor(() => expect(inner(container).style.transform).toBe('scale(1)'));
		});
	});

	describe('with ResizeObserver present but not yet fired', () => {
		beforeEach(() => {
			vi.stubGlobal('ResizeObserver', ResizeObserverStub);
		});

		// Nothing is painted until it has been measured, so a clipped frame can never reach the screen.
		it('keeps the stage hidden until the first measurement lands', async () => {
			const { container } = render(RevolvingFundAnimation);

			await nextTick();

			expect(inner(container).style.opacity).toBe('0');
		});
	});

	describe('once measured', () => {
		beforeEach(() => {
			onObserve = callback => callback([{ contentRect: { width: 266.5 } }]);
			vi.stubGlobal('ResizeObserver', ResizeObserverStub);
		});

		it('scales the fixed stage down to the measured width and reveals it', async () => {
			const { container } = render(RevolvingFundAnimation);

			await waitFor(() => expect(inner(container).style.transform).toBe('scale(0.5)'));
			expect(inner(container).style.opacity).toBe('1');
		});
	});

	// aspect-ratio owns the height; an inline height would mean the JS path is still in charge.
	it('binds no inline height on the outer box', () => {
		const { container } = render(RevolvingFundAnimation);

		expect(outer(container).style.height).toBe('');
	});

	it('starts on the first borrower', () => {
		const { container } = render(RevolvingFundAnimation);

		expect(container.textContent).toContain('Fadi repays');
	});
});
