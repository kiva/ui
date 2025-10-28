import { render } from '@testing-library/vue';
import KvHero from '#src/components/Kv/KvHero';

describe('KvHero.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvHero).toBeDefined();
		expect(KvHero.name).toBe('KvHero');
	});

	it('renders the hero container', () => {
		const { container } = render(KvHero, {
			slots: {
				images: '<div>Images</div>',
			},
		});

		const hero = container.querySelector('.hero');
		expect(hero).toBeTruthy();
	});

	it('renders images section', () => {
		const { container } = render(KvHero, {
			slots: {
				images: '<div>Images</div>',
			},
		});

		const images = container.querySelector('.images');
		expect(images).toBeTruthy();
	});

	it('renders images slot content', () => {
		const { getByText } = render(KvHero, {
			slots: {
				images: '<div>Test Images</div>',
			},
		});

		expect(getByText('Test Images')).toBeTruthy();
	});

	it('renders carousel slot content', () => {
		const { getByText } = render(KvHero, {
			slots: {
				carousel: '<div>Carousel Content</div>',
			},
		});

		expect(getByText('Carousel Content')).toBeTruthy();
	});

	it('shows images-placeholder when carousel is present', () => {
		const { container } = render(KvHero, {
			slots: {
				carousel: '<div>Carousel</div>',
			},
		});

		const placeholder = container.querySelector('.images-placeholder');
		expect(placeholder).toBeTruthy();
	});

	it('does not show images-placeholder when no carousel', () => {
		const { container } = render(KvHero, {
			slots: {
				images: '<div>Images</div>',
			},
		});

		const placeholder = container.querySelector('.images-placeholder');
		expect(placeholder).toBeFalsy();
	});

	it('applies images-container class when carousel is present', () => {
		const { container } = render(KvHero, {
			slots: {
				carousel: '<div>Carousel</div>',
			},
		});

		const imagesContainer = container.querySelector('.images-container');
		expect(imagesContainer).toBeTruthy();
	});

	it('renders headline title slot', () => {
		const { getByText } = render(KvHero, {
			slots: {
				headlineTitle: '<h1>Headline Title</h1>',
			},
		});

		expect(getByText('Headline Title')).toBeTruthy();
	});

	it('renders headline body slot', () => {
		const { getByText } = render(KvHero, {
			slots: {
				headlineBody: '<p>Headline Body</p>',
			},
		});

		expect(getByText('Headline Body')).toBeTruthy();
	});

	it('renders action slot', () => {
		const { getByText } = render(KvHero, {
			slots: {
				action: '<button>Action Button</button>',
			},
		});

		expect(getByText('Action Button')).toBeTruthy();
	});

	it('renders overlayContent slot', () => {
		const { getByText } = render(KvHero, {
			slots: {
				overlayContent: '<div>Overlay Content</div>',
			},
		});

		expect(getByText('Overlay Content')).toBeTruthy();
	});

	it('shows headline when headlineTitle is provided', () => {
		const { container } = render(KvHero, {
			slots: {
				headlineTitle: '<h1>Title</h1>',
			},
		});

		const headline = container.querySelector('.headline');
		expect(headline).toBeTruthy();
	});

	it('shows headline when headlineBody is provided', () => {
		const { container } = render(KvHero, {
			slots: {
				headlineBody: '<p>Body</p>',
			},
		});

		const headline = container.querySelector('.headline');
		expect(headline).toBeTruthy();
	});

	it('shows headline when action is provided', () => {
		const { container } = render(KvHero, {
			slots: {
				action: '<button>Action</button>',
			},
		});

		const headline = container.querySelector('.headline');
		expect(headline).toBeTruthy();
	});

	it('does not show headline when no slots provided', () => {
		const { container } = render(KvHero, {
			slots: {
				images: '<div>Images</div>',
			},
		});

		const headline = container.querySelector('.headline');
		expect(headline).toBeFalsy();
	});

	it('applies custom background color when provided', () => {
		const { container } = render(KvHero, {
			slots: {
				headlineTitle: '<h1>Title</h1>',
			},
			props: {
				headlineBgColor: '#ff0000',
			},
		});

		const bg = container.querySelector('.headline-background');
		// Component uses style binding: `background-color: ${this.headlineBgColor}`
		// Check for the color value in style attribute
		expect(bg.getAttribute('style')).toContain('#ff0000');
	});

	it('has empty headlineBgColor by default', () => {
		expect(KvHero.props.headlineBgColor.default).toBe('');
	});

	it('applies headline-main--has-action class when action slot is present', () => {
		const { container } = render(KvHero, {
			slots: {
				headlineTitle: '<h1>Title</h1>',
				action: '<button>Action</button>',
			},
		});

		const headlineMain = container.querySelector('.headline-main--has-action');
		expect(headlineMain).toBeTruthy();
	});

	it('applies action--has-headline class when headline is present', () => {
		const { container } = render(KvHero, {
			slots: {
				headlineTitle: '<h1>Title</h1>',
				action: '<button>Action</button>',
			},
		});

		const action = container.querySelector('.action--has-headline');
		expect(action).toBeTruthy();
	});

	it('renders headline masks', () => {
		const { container } = render(KvHero, {
			slots: {
				headlineTitle: '<h1>Title</h1>',
			},
		});

		const masks = container.querySelectorAll('.headline-mask');
		// Two masks: one before and one after headline content
		expect(masks).toHaveLength(2);
	});

	it('renders overlay-holder', () => {
		const { container } = render(KvHero, {
			slots: {
				images: '<div>Images</div>',
			},
		});

		const overlayHolder = container.querySelector('.overlay-holder');
		expect(overlayHolder).toBeTruthy();
	});
});
