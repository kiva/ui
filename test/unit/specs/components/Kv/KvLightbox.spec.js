import {
	describe, expect, it, vi, beforeEach
} from 'vitest';
import { render } from '@testing-library/vue';
import KvLightbox from '#src/components/Kv/KvLightbox';

// Mock vue-focus-lock
vi.mock('vue-focus-lock', () => {
	const FocusLock = {
		name: 'FocusLock',
		template: '<div class="focus-lock"><slot /></div>',
		props: ['disabled', 'returnFocus'],
	};
	return { default: FocusLock };
});

// Mock bodyScrollLockMixin
vi.mock('#src/plugins/body-scroll-lock-mixin', () => ({
	default: {
		mounted() {},
		destroyed() {},
		methods: {
			disableBodyScroll: vi.fn(),
			enableBodyScroll: vi.fn(),
		},
	},
}));

// Mock child components
const KvIcon = {
	name: 'KvIcon',
	template: '<svg class="kv-icon"><use /></svg>',
	props: ['name', 'title'],
};

const global = {
	stubs: {
		KvIcon,
	},
};

describe('KvLightbox.vue', () => {
	beforeEach(() => {
		// Reset any mocks
		vi.clearAllMocks();
	});

	it('exports a valid Vue component', () => {
		expect(KvLightbox).toBeDefined();
		expect(KvLightbox.name).toBe('KvLightbox');
	});

	it('has visible prop with default false', () => {
		expect(KvLightbox.props.visible.default).toBe(false);
	});

	it('has title prop', () => {
		expect(KvLightbox.props.title).toBeDefined();
		expect(KvLightbox.props.title.type).toBe(String);
	});

	it('has preventClose prop with default false', () => {
		expect(KvLightbox.props.preventClose.default).toBe(false);
	});

	it('renders focus lock component', () => {
		const { container } = render(KvLightbox, {
			props: {
				visible: true,
			},
			global,
		});

		const focusLock = container.querySelector('.kv-lightbox__focus-lock');
		expect(focusLock).toBeTruthy();
	});

	it('renders lightbox div', () => {
		const { container } = render(KvLightbox, {
			props: {
				visible: true,
			},
			global,
		});

		const lightbox = container.querySelector('.kv-lightbox');
		expect(lightbox).toBeTruthy();
	});

	it('renders lightbox container div', () => {
		const { container } = render(KvLightbox, {
			props: {
				visible: true,
			},
			global,
		});

		const containerDiv = container.querySelector('.kv-lightbox__container');
		expect(containerDiv).toBeTruthy();
	});

	it('renders close button', () => {
		const { container } = render(KvLightbox, {
			props: {
				visible: true,
			},
			global,
		});

		const closeBtn = container.querySelector('.kv-lightbox__close-btn');
		expect(closeBtn).toBeTruthy();
	});

	it('renders close icon', () => {
		const { container } = render(KvLightbox, {
			props: {
				visible: true,
			},
			global,
		});

		const icon = container.querySelector('.kv-icon');
		expect(icon).toBeTruthy();
	});

	it('does not render close button when preventClose is true', () => {
		const { container } = render(KvLightbox, {
			props: {
				visible: true,
				preventClose: true,
			},
			global,
		});

		const closeBtn = container.querySelector('.kv-lightbox__close-btn');
		expect(closeBtn).toBeFalsy();
	});

	it('renders title when provided', () => {
		const { getByText } = render(KvLightbox, {
			props: {
				visible: true,
				title: 'Test Title',
			},
			global,
		});

		expect(getByText('Test Title')).toBeTruthy();
	});

	it('does not render title div when title is empty', () => {
		const { container } = render(KvLightbox, {
			props: {
				visible: true,
			},
			global,
		});

		const titleDiv = container.querySelector('.kv-lightbox__title');
		expect(titleDiv).toBeFalsy();
	});

	it('renders default slot content', () => {
		const { getByText } = render(KvLightbox, {
			props: {
				visible: true,
			},
			slots: {
				default: 'Lightbox content',
			},
			global,
		});

		expect(getByText('Lightbox content')).toBeTruthy();
	});

	it('applies tw-bg-primary class', () => {
		const { container } = render(KvLightbox, {
			props: {
				visible: true,
			},
			global,
		});

		const bgPrimary = container.querySelector('.tw-bg-primary');
		expect(bgPrimary).toBeTruthy();
	});

	it('has isShown data property', () => {
		expect(KvLightbox.data).toBeDefined();
	});

	it('has closeLightbox method', () => {
		expect(KvLightbox.methods.closeLightbox).toBeDefined();
	});

	it('has onKeyUp method', () => {
		expect(KvLightbox.methods.onKeyUp).toBeDefined();
	});

	it('has init method', () => {
		expect(KvLightbox.methods.init).toBeDefined();
	});

	it('watches visible prop', () => {
		expect(KvLightbox.watch.visible).toBeDefined();
	});
});
