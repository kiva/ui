import { render } from '@testing-library/vue';
import KvResponsiveImage from '../../../../../src/components/Kv/KvResponsiveImage';

// Mock checkScreenDensity utilities
vi.mock('#src/util/checkScreenDensity', () => ({
	isHighDensity: vi.fn(() => false),
	isRetina: vi.fn(() => false),
}));

describe('KvResponsiveImage.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvResponsiveImage).toBeDefined();
		expect(KvResponsiveImage.name).toBe('KvResponsiveImage');
	});

	it('requires images prop', () => {
		expect(KvResponsiveImage.props.images.required).toBe(true);
	});

	it('renders picture element', () => {
		const { container } = render(KvResponsiveImage, {
			props: {
				images: [
					['small', '/img-small.jpg'],
					['large', '/img-large.jpg'],
				],
			},
		});

		const picture = container.querySelector('picture');
		expect(picture).toBeTruthy();
	});

	it('renders img element', () => {
		const { container } = render(KvResponsiveImage, {
			props: {
				images: [
					['small', '/img-small.jpg'],
					['large', '/img-large.jpg'],
				],
			},
		});

		const img = container.querySelector('img');
		expect(img).toBeTruthy();
	});

	it('renders source elements for each standard image', () => {
		const { container } = render(KvResponsiveImage, {
			props: {
				images: [
					['small', '/img-small.jpg'],
					['medium', '/img-medium.jpg'],
					['large', '/img-large.jpg'],
				],
			},
		});

		const sources = container.querySelectorAll('source');
		// One source per standard (non-retina) image
		expect(sources.length).toBe(3);
	});

	it('sets srcset with retina images when available', () => {
		const { container } = render(KvResponsiveImage, {
			props: {
				images: [
					['small', '/img-small.jpg'],
					['small retina', '/img-small@2x.jpg'],
					['large', '/img-large.jpg'],
					['large retina', '/img-large@2x.jpg'],
				],
			},
		});

		const sources = container.querySelectorAll('source');
		// Component creates srcset with retina images: `${image[1]}, ${retina[1]} 2x`
		const largeSource = Array.from(sources).find(s => s.media === '(min-width: 681px)');
		expect(largeSource.srcset).toContain('2x');
		expect(largeSource.srcset).toContain('img-large@2x.jpg');
	});

	it('has breakpoints data', () => {
		expect(KvResponsiveImage.data).toBeDefined();
	});

	it('filters standard images correctly', () => {
		const images = [
			['small', '/img-small.jpg'],
			['small retina', '/img-small@2x.jpg'],
			['large', '/img-large.jpg'],
		];

		const standardImages = images.filter(image => image[0].indexOf('retina') === -1);
		expect(standardImages).toHaveLength(2);
		expect(standardImages[0][0]).toBe('small');
		expect(standardImages[1][0]).toBe('large');
	});

	it('filters retina images correctly', () => {
		const images = [
			['small', '/img-small.jpg'],
			['small retina', '/img-small@2x.jpg'],
			['large', '/img-large.jpg'],
			['large retina', '/img-large@2x.jpg'],
		];

		const retinaImages = images.filter(image => image[0].indexOf('retina') > -1);
		expect(retinaImages).toHaveLength(2);
		expect(retinaImages[0][0]).toBe('small retina');
		expect(retinaImages[1][0]).toBe('large retina');
	});

	it('passes through additional attributes', () => {
		const { container } = render(KvResponsiveImage, {
			props: {
				images: [['small', '/img-small.jpg']],
				alt: 'Test image',
				class: 'custom-class',
			},
		});

		const img = container.querySelector('img');
		expect(img.alt).toBe('Test image');
		expect(img.classList.contains('custom-class')).toBe(true);
	});

	it('sets src from first standard image', () => {
		const { container } = render(KvResponsiveImage, {
			props: {
				images: [
					['small', '/img-small.jpg'],
					['large', '/img-large.jpg'],
				],
			},
		});

		const img = container.querySelector('img');
		// Component uses reversed array, so first after reverse is large
		expect(img.src).toContain('img-large.jpg');
	});

	it('has inheritAttrs set to false', () => {
		expect(KvResponsiveImage.inheritAttrs).toBe(false);
	});

	it('generates media queries for sources', () => {
		const { container } = render(KvResponsiveImage, {
			props: {
				images: [
					['small', '/img-small.jpg'],
					['large', '/img-large.jpg'],
				],
			},
		});

		const sources = container.querySelectorAll('source');
		const mediaQueries = Array.from(sources).map(s => s.media);
		expect(mediaQueries.some(mq => mq.includes('min-width'))).toBe(true);
	});

	it('orders sources from largest to smallest', () => {
		const { container } = render(KvResponsiveImage, {
			props: {
				images: [
					['small', '/img-small.jpg'],
					['medium', '/img-medium.jpg'],
					['large', '/img-large.jpg'],
				],
			},
		});

		const sources = container.querySelectorAll('source');
		const firstSource = sources[0];
		// First source should be for the largest breakpoint
		expect(firstSource.media).toContain('681px'); // large breakpoint
	});
});
