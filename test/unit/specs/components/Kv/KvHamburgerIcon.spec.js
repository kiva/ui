import { render } from '@testing-library/vue';
import KvHamburgerIcon from '#src/components/Kv/KvHamburgerIcon';

describe('KvHamburgerIcon.vue', () => {
	it('renders three layer elements', () => {
		const { container } = render(KvHamburgerIcon);

		const layers = container.querySelectorAll('.layer');
		expect(layers.length).toBe(3);
	});

	it('renders top, middle, and bottom layers', () => {
		const { container } = render(KvHamburgerIcon);

		expect(container.querySelector('.layer.top')).toBeTruthy();
		expect(container.querySelector('.layer.middle')).toBeTruthy();
		expect(container.querySelector('.layer.bottom')).toBeTruthy();
	});

	it('is closed by default', () => {
		const { container } = render(KvHamburgerIcon);

		const hamburger = container.querySelector('.hamburger-menu');
		expect(hamburger.classList.contains('open')).toBe(false);
	});

	it('applies open class when open prop is true', () => {
		const { container } = render(KvHamburgerIcon, {
			props: {
				open: true
			}
		});

		const hamburger = container.querySelector('.hamburger-menu');
		expect(hamburger.classList.contains('open')).toBe(true);
	});

	it('applies custom color to layers', () => {
		const { container } = render(KvHamburgerIcon, {
			props: {
				color: '#ff0000'
			}
		});

		const layer = container.querySelector('.layer');
		expect(layer.style.backgroundColor).toBe('#ff0000');
	});

	it('applies custom width to container', () => {
		const { container } = render(KvHamburgerIcon, {
			props: {
				width: '3rem'
			}
		});

		const hamburger = container.querySelector('.hamburger-menu');
		expect(hamburger.style.width).toBe('3rem');
	});

	it('uses default width when not specified', () => {
		const { container } = render(KvHamburgerIcon);

		const hamburger = container.querySelector('.hamburger-menu');
		expect(hamburger.style.width).toBe('2.125rem');
	});
});
