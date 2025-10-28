import { render } from '@testing-library/vue';
import KvContentfulImg from '#src/components/Kv/KvContentfulImg';

describe('KvContentfulImg.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvContentfulImg).toBeDefined();
		expect(KvContentfulImg.name).toBe('KvContentfulImg');
	});

	it('requires contentfulSrc prop', () => {
		expect(KvContentfulImg.props.contentfulSrc.required).toBe(true);
	});

	it('requires fallbackFormat prop', () => {
		expect(KvContentfulImg.props.fallbackFormat.required).toBe(true);
	});

	it('renders picture element when width or height is provided', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				width: 800,
			},
		});

		const picture = container.querySelector('picture');
		expect(picture).toBeTruthy();
	});

	it('renders img element with src', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				width: 800,
				height: 600,
			},
		});

		const img = container.querySelector('img');
		expect(img).toBeTruthy();
		expect(img.src).toContain('images.ctfassets.net');
	});

	it('generates webp source tags', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				width: 800,
				height: 600,
			},
		});

		const sources = container.querySelectorAll('source[type="image/webp"]');
		expect(sources.length).toBeGreaterThan(0);
	});

	it('generates 2x and 1x srcsets', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				width: 800,
				height: 600,
			},
		});

		const img = container.querySelector('img');
		expect(img.srcset).toContain('2x');
		expect(img.srcset).toContain('1x');
	});

	it('sets alt text on img', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				width: 800,
				height: 600,
				alt: 'Test image',
			},
		});

		const img = container.querySelector('img');
		expect(img.alt).toBe('Test image');
	});

	it('has empty alt by default', () => {
		expect(KvContentfulImg.props.alt.default).toBe('');
	});

	it('accepts lazy loading prop', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				width: 800,
				height: 600,
				loading: 'lazy',
			},
		});

		const img = container.querySelector('img');
		expect(img.loading).toBe('lazy');
	});

	it('accepts eager loading prop', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				width: 800,
				height: 600,
				loading: 'eager',
			},
		});

		const img = container.querySelector('img');
		expect(img.loading).toBe('eager');
	});

	it('validates loading prop', () => {
		const { validator } = KvContentfulImg.props.loading;
		expect(validator('lazy')).toBe(true);
		expect(validator('eager')).toBe(true);
		expect(validator('invalid')).toBe(false);
	});

	it('accepts crop parameter', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				width: 800,
				height: 600,
				crop: '&fit=fill&f=face',
			},
		});

		// Component accepts crop prop and uses it in template
		expect(KvContentfulImg.props.crop).toBeDefined();
		const picture = container.querySelector('picture');
		expect(picture).toBeTruthy();
	});

	it('has empty crop by default', () => {
		expect(KvContentfulImg.props.crop.default).toBe('');
	});

	it('accepts sourceSizes array', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				width: 800,
				height: 600,
				sourceSizes: [
					{
						width: 1440,
						height: 620,
						media: 'min-width: 1025px',
					},
				],
			},
		});

		const sources = container.querySelectorAll('source');
		expect(sources.length).toBeGreaterThan(0);
	});

	it('has empty sourceSizes array by default', () => {
		expect(KvContentfulImg.props.sourceSizes.default()).toEqual([]);
	});

	it('buildUrl method adds width parameter', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				width: 800,
			},
		});

		const img = container.querySelector('img');
		expect(img.src).toContain('w=800');
	});

	it('buildUrl method adds height parameter', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				height: 600,
			},
		});

		const img = container.querySelector('img');
		expect(img.src).toContain('h=600');
	});

	it('sets width and height attributes when both provided', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				width: 800,
				height: 600,
			},
		});

		const img = container.querySelector('img');
		expect(img.width).toBe(800);
		expect(img.height).toBe(600);
	});

	it('accepts string width', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				width: '800',
				height: 600,
			},
		});

		const img = container.querySelector('img');
		expect(img).toBeTruthy();
	});

	it('accepts string height', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				width: 800,
				height: '600',
			},
		});

		const img = container.querySelector('img');
		expect(img).toBeTruthy();
	});

	it('applies kv-contentful-img class', () => {
		const { container } = render(KvContentfulImg, {
			props: {
				contentfulSrc: 'https://images.ctfassets.net/test/image.jpg',
				fallbackFormat: 'jpg',
				width: 800,
				height: 600,
			},
		});

		const picture = container.querySelector('.kv-contentful-img');
		expect(picture).toBeTruthy();
	});
});
