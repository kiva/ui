import { render } from '@testing-library/vue';
import KvCarousel from '#src/components/Kv/KvCarousel';

// Mock lodash throttle
vi.mock('lodash/throttle', () => ({
	default: vi.fn(fn => fn),
}));

// Mock embla-carousel
const mockEmbla = {
	slideNodes: vi.fn(() => [{}]),
	scrollSnapList: vi.fn(() => [0]),
	scrollTo: vi.fn(),
	on: vi.fn(),
	off: vi.fn(),
	destroy: vi.fn(),
	reInit: vi.fn(),
	canScrollPrev: vi.fn(() => false),
	canScrollNext: vi.fn(() => true),
	selectedScrollSnap: vi.fn(() => 0),
	slidesInView: vi.fn(() => [0]),
	clickAllowed: vi.fn(() => true),
};

vi.mock('embla-carousel', () => ({
	default: vi.fn(() => mockEmbla),
}));

// Mock KvIcon component
const KvIcon = {
	name: 'KvIcon',
	template: '<svg class="kv-icon"><title v-if="title">{{ title }}</title></svg>',
	props: ['name', 'fromSprite', 'title'],
};

const global = {
	stubs: {
		KvIcon,
	},
};

describe('KvCarousel.vue', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it('exports a valid Vue component', () => {
		expect(KvCarousel).toBeDefined();
		expect(KvCarousel.name).toBe('KvCarousel');
	});

	it('has autoplay prop with default true', () => {
		expect(KvCarousel.props.autoplay.default).toBe(true);
	});

	it('has autoplayInterval prop with default 5', () => {
		expect(KvCarousel.props.autoplayInterval.default).toBe(5);
	});

	it('has pauseOnHover prop with default true', () => {
		expect(KvCarousel.props.pauseOnHover.default).toBe(true);
	});

	it('has hideArrows prop with default false', () => {
		expect(KvCarousel.props.hideArrows.default).toBe(false);
	});

	it('has indicatorStyle prop with default circle', () => {
		expect(KvCarousel.props.indicatorStyle.default).toBe('circle');
	});

	it('has controlsInside prop with default false', () => {
		expect(KvCarousel.props.controlsInside.default).toBe(false);
	});

	it('has slidesToScroll prop with default auto', () => {
		expect(KvCarousel.props.slidesToScroll.default).toBe('auto');
	});

	it('renders carousel wrapper', () => {
		const { container } = render(KvCarousel, {
			slots: {
				default: '<div>Slide 1</div>',
			},
			global,
		});

		const carousel = container.querySelector('.kv-carousel');
		expect(carousel).toBeTruthy();
	});

	it('renders viewport', () => {
		const { container } = render(KvCarousel, {
			slots: {
				default: '<div>Slide 1</div>',
			},
			global,
		});

		const viewport = container.querySelector('.kv-carousel__viewport');
		expect(viewport).toBeTruthy();
	});

	it('renders container', () => {
		const { container } = render(KvCarousel, {
			slots: {
				default: '<div>Slide 1</div>',
			},
			global,
		});

		const carouselContainer = container.querySelector('.kv-carousel__container');
		expect(carouselContainer).toBeTruthy();
	});

	it('renders left arrow button', () => {
		const { container } = render(KvCarousel, {
			slots: {
				default: '<div>Slide 1</div>',
			},
			global,
		});

		const leftBtn = container.querySelector('.kv-carousel__arrows-btn--left');
		expect(leftBtn).toBeTruthy();
	});

	it('renders right arrow button', () => {
		const { container } = render(KvCarousel, {
			slots: {
				default: '<div>Slide 1</div>',
			},
			global,
		});

		const rightBtn = container.querySelector('.kv-carousel__arrows-btn--right');
		expect(rightBtn).toBeTruthy();
	});

	it('renders indicator', () => {
		const { container } = render(KvCarousel, {
			slots: {
				default: '<div>Slide 1</div>',
			},
			global,
		});

		const indicator = container.querySelector('.kv-carousel__indicator');
		expect(indicator).toBeTruthy();
	});

	it('renders slot content', () => {
		const { getByText } = render(KvCarousel, {
			slots: {
				default: '<div>Slide Content</div>',
			},
			global,
		});

		expect(getByText('Slide Content')).toBeTruthy();
	});

	it('has nextIndex computed property', () => {
		expect(KvCarousel.computed.nextIndex).toBeDefined();
	});

	it('has previousIndex computed property', () => {
		expect(KvCarousel.computed.previousIndex).toBeDefined();
	});

	it('has carouselModifierClasses computed property', () => {
		expect(KvCarousel.computed.carouselModifierClasses).toBeDefined();
	});

	it('has slideIndicatorList computed property', () => {
		expect(KvCarousel.computed.slideIndicatorList).toBeDefined();
	});

	it('emits change event', () => {
		expect(KvCarousel.emits).toContain('change');
	});

	it('emits interact-carousel event', () => {
		expect(KvCarousel.emits).toContain('interact-carousel');
	});

	it('has handleUserInteraction method', () => {
		expect(KvCarousel.methods.handleUserInteraction).toBeDefined();
	});

	it('has goToSlide method', () => {
		expect(KvCarousel.methods.goToSlide).toBeDefined();
	});

	it('has reInit method', () => {
		expect(KvCarousel.methods.reInit).toBeDefined();
	});

	it('has onCarouselContainerClick method', () => {
		expect(KvCarousel.methods.onCarouselContainerClick).toBeDefined();
	});

	it('applies controls-inside modifier class', () => {
		const { container } = render(KvCarousel, {
			props: {
				controlsInside: true,
			},
			slots: {
				default: '<div>Slide 1</div>',
			},
			global,
		});

		const carousel = container.querySelector('.kv-carousel--controls-inside');
		expect(carousel).toBeTruthy();
	});

	it('applies hide-arrows modifier class', () => {
		const { container } = render(KvCarousel, {
			props: {
				hideArrows: true,
			},
			slots: {
				default: '<div>Slide 1</div>',
			},
			global,
		});

		const carousel = container.querySelector('.kv-carousel--hide-arrows');
		expect(carousel).toBeTruthy();
	});

	it('applies indicator-bar modifier class', () => {
		const { container } = render(KvCarousel, {
			props: {
				indicatorStyle: 'bar',
			},
			slots: {
				default: '<div>Slide 1</div>',
			},
			global,
		});

		const carousel = container.querySelector('.kv-carousel--indicator-bar');
		expect(carousel).toBeTruthy();
	});

	it('applies indicator-none modifier class', () => {
		const { container } = render(KvCarousel, {
			props: {
				indicatorStyle: 'none',
			},
			slots: {
				default: '<div>Slide 1</div>',
			},
			global,
		});

		const carousel = container.querySelector('.kv-carousel--indicator-none');
		expect(carousel).toBeTruthy();
	});

	it('left arrow has show previous slide title', () => {
		const { container } = render(KvCarousel, {
			slots: {
				default: '<div>Slide 1</div>',
			},
			global,
		});

		const leftBtn = container.querySelector('.kv-carousel__arrows-btn--left');
		const title = leftBtn.querySelector('title');
		expect(title.textContent).toContain('Show previous slide');
	});

	it('right arrow has show next slide title', () => {
		const { container } = render(KvCarousel, {
			slots: {
				default: '<div>Slide 1</div>',
			},
			global,
		});

		const rightBtn = container.querySelector('.kv-carousel__arrows-btn--right');
		const title = rightBtn.querySelector('title');
		expect(title.textContent).toContain('Show next slide');
	});

	it('has emblaOptions prop', () => {
		expect(KvCarousel.props.emblaOptions).toBeDefined();
		expect(KvCarousel.props.emblaOptions.default()).toEqual({});
	});

	it('watches paused state', () => {
		expect(KvCarousel.watch.paused).toBeDefined();
	});
});
