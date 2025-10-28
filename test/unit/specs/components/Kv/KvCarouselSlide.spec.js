import { render } from '@testing-library/vue';
import KvCarouselSlide from '#src/components/Kv/KvCarouselSlide';

describe('KvCarouselSlide.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvCarouselSlide).toBeDefined();
		expect(KvCarouselSlide.name).toBe('KvCarouselSlide');
	});

	it('renders with default slot content', () => {
		const { container } = render(KvCarouselSlide, {
			slots: {
				default: '<p>Slide content</p>'
			}
		});

		expect(container.querySelector('.kv-carousel-slide')).toBeTruthy();
		expect(container.textContent).toContain('Slide content');
	});

	it('renders an empty slide when no slot content provided', () => {
		const { container } = render(KvCarouselSlide);

		expect(container.querySelector('.kv-carousel-slide')).toBeTruthy();
	});

	it('applies the correct CSS class', () => {
		const { container } = render(KvCarouselSlide);
		const slideDiv = container.querySelector('div');

		expect(slideDiv.classList.contains('kv-carousel-slide')).toBe(true);
	});

	it('renders multiple children in the slot', () => {
		const { container } = render(KvCarouselSlide, {
			slots: {
				default: `
					<h2>Title</h2>
					<p>Description</p>
					<button>Action</button>
				`
			}
		});

		expect(container.querySelector('h2')).toBeTruthy();
		expect(container.querySelector('p')).toBeTruthy();
		expect(container.querySelector('button')).toBeTruthy();
	});
});
