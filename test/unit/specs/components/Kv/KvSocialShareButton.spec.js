/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import KvSocialShareButton from '#src/components/Kv/KvSocialShareButton';

// Renders its content so the share options can be inspected; the class bound on <kv-lightbox> falls through
const KvLightboxStub = defineComponent({
	name: 'KvLightbox',
	props: { visible: { type: Boolean, default: false } },
	setup(_, { slots }) {
		return () => h('div', { 'data-testid': 'lightbox' }, slots.default?.());
	},
});

const SHARE_OPTIONS = ['facebook', 'bluesky', 'linkedin', 'copy-link'];

// KvButton puts its size on an inner span: tw-min-h-6 for default, tw-min-h-4 for small
const DEFAULT_SIZE_CLASS = 'tw-min-h-6';
const SMALL_SIZE_CLASS = 'tw-min-h-4';

const mountShare = (props = {}) => mount(KvSocialShareButton, {
	props: {
		utmCampaign: 'test_campaign',
		shareUrl: '/',
		shareMessage: 'Hello',
		openLightbox: true,
		...props,
	},
	global: {
		provide: { apollo: {} },
		mocks: {
			$appConfig: { host: 'www.kiva.org' },
			$route: { hash: '', query: {}, path: '/' },
			$showTipMsg: vi.fn(),
		},
		directives: { kvTrackEvent: {} },
		stubs: { KvLightbox: KvLightboxStub },
	},
});

const shareRow = wrapper => wrapper.find('[data-testid="share-facebook-button"]').element.parentElement;

const sizeClassesOf = wrapper => SHARE_OPTIONS.map(name => {
	const html = wrapper.find(`[data-testid="share-${name}-button"]`).html();
	if (html.includes(SMALL_SIZE_CLASS)) return 'small';
	if (html.includes(DEFAULT_SIZE_CLASS)) return 'default';
	return 'unknown';
});

describe('KvSocialShareButton', () => {
	describe('without the LendingInsights options (borrower profile, badges, etc.)', () => {
		it('renders the share options at the default size', () => {
			const wrapper = mountShare();

			expect(sizeClassesOf(wrapper)).toEqual(['default', 'default', 'default', 'default']);
		});

		it('adds none of the compact or fixed-width classes', () => {
			const wrapper = mountShare();

			expect(wrapper.find('.social-buttons--compact').exists()).toBe(false);
			expect(wrapper.find('.social-share-lightbox--fixed-width').exists()).toBe(false);
			expect(shareRow(wrapper).classList).not.toContain('tw-justify-center');
			expect(shareRow(wrapper).classList).not.toContain('lg:tw-justify-start');
		});
	});

	describe('compactButtons', () => {
		it('renders small share options inside the compact row', () => {
			const wrapper = mountShare({ compactButtons: true });

			expect(sizeClassesOf(wrapper)).toEqual(['small', 'small', 'small', 'small']);
			expect(shareRow(wrapper).classList).toContain('social-buttons--compact');
		});

		it('does not apply the fixed-width modal', () => {
			const wrapper = mountShare({ compactButtons: true });

			expect(wrapper.find('.social-share-lightbox--fixed-width').exists()).toBe(false);
			expect(shareRow(wrapper).classList).not.toContain('tw-justify-center');
		});
	});

	describe('fixedWidthModal', () => {
		it('applies the fixed-width modal and centers the share options below lg', () => {
			const wrapper = mountShare({ fixedWidthModal: true });

			expect(wrapper.find('[data-testid="lightbox"]').classes()).toContain('social-share-lightbox--fixed-width');
			expect(shareRow(wrapper).classList).toContain('tw-justify-center');
			expect(shareRow(wrapper).classList).toContain('lg:tw-justify-start');
		});

		it('does not make the share options compact', () => {
			const wrapper = mountShare({ fixedWidthModal: true });

			expect(sizeClassesOf(wrapper)).toEqual(['default', 'default', 'default', 'default']);
			expect(wrapper.find('.social-buttons--compact').exists()).toBe(false);
		});
	});

	it('applies both options together, as LendingInsights uses them', () => {
		const wrapper = mountShare({ compactButtons: true, fixedWidthModal: true });

		expect(sizeClassesOf(wrapper)).toEqual(['small', 'small', 'small', 'small']);
		expect(shareRow(wrapper).classList).toContain('social-buttons--compact');
		expect(shareRow(wrapper).classList).toContain('tw-justify-center');
		expect(wrapper.find('[data-testid="lightbox"]').classes()).toContain('social-share-lightbox--fixed-width');
	});
});
