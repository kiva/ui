/* eslint-disable import/no-extraneous-dependencies, vue/one-component-per-file */
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import BorrowerCarousel from '#src/components/MyKiva/BorrowerCarousel';
import { FUNDRAISING, PAYING_BACK, FUNDED } from '#src/api/fixtures/LoanStatusEnum';

// Rendered by MyKivaPageContent AND by Portfolio/ImpactDashboard/LoanCards, so the modal
// gating below has to hold on both pages. Neither had coverage before this file.

const mockPush = vi.fn();

vi.mock('vue-router', () => ({
	useRouter: () => ({ push: mockPush }),
}));

// Stubbed so a card can emit the events the real BorrowerStatusCard emits on menu clicks.
const BorrowerStatusCardStub = defineComponent({
	name: 'BorrowerStatusCard',
	props: { loan: { type: Object, default: () => ({}) } },
	emits: ['open-comment-modal', 'open-share-modal', 'open-side-sheet'],
	template: '<div class="borrower-status-card-stub" />',
});

const ShareButtonStub = defineComponent({
	name: 'ShareButton',
	props: {
		loan: { type: Object, default: () => ({}) },
		openLightbox: { type: Boolean, default: false },
	},
	template: '<div class="share-button-stub" :data-open="String(openLightbox)" />',
});

// Passthrough carousel/tabs: the real ones need embla and a tab context, and neither is
// what these tests are about.
const passthrough = name => defineComponent({
	name,
	setup(_, { slots }) {
		return () => h('div', Object.values(slots).map(slot => slot?.()));
	},
});

const KvCarouselStub = defineComponent({
	name: 'KvCarousel',
	props: { slideMaxWidth: { type: String, default: '' } },
	setup(props, { slots }) {
		return () => h(
			'div',
			{ 'data-slide-max-width': props.slideMaxWidth },
			Object.values(slots).map(slot => slot?.()),
		);
	},
});

const loan = (id, status = FUNDRAISING) => ({ id, name: `Borrower ${id}`, status });

const mountCarousel = (props = {}, mountOptions = {}) => mount(BorrowerCarousel, {
	props: {
		loans: [loan(1), loan(2, PAYING_BACK), loan(3, FUNDED)],
		totalLoans: 3,
		showMenu: true,
		...props,
	},
	...mountOptions,
	global: {
		provide: {
			$kvTrackEvent: vi.fn(),
			apollo: { query: vi.fn(), mutate: vi.fn(), readQuery: vi.fn() },
			cookieStore: { get: vi.fn(), set: vi.fn(), remove: vi.fn() },
		},
		stubs: {
			BorrowerStatusCard: BorrowerStatusCardStub,
			ShareButton: ShareButtonStub,
			BorrowerImage: true,
			KvCarousel: KvCarouselStub,
			KvTabs: passthrough('KvTabs'),
			KvTab: true,
			KvTabPanel: passthrough('KvTabPanel'),
			KvButton: true,
		},
	},
});

const firstCard = wrapper => wrapper.findComponent(BorrowerStatusCardStub);

describe('BorrowerCarousel', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useRealTimers();
	});

	describe('loan filtering', () => {
		it('drops loans in a status the carousel does not render', () => {
			const wrapper = mountCarousel({
				loans: [loan(1), loan(2, 'unknown_status'), loan(3, PAYING_BACK)],
			});

			expect(wrapper.findAllComponents(BorrowerStatusCardStub)).toHaveLength(2);
		});

		it('caps the cards at cardsNumber', () => {
			const wrapper = mountCarousel({
				loans: [loan(1), loan(2), loan(3), loan(4)],
				cardsNumber: 2,
			});

			expect(wrapper.findAllComponents(BorrowerStatusCardStub)).toHaveLength(2);
		});

		it('renders nothing when no loan is in a renderable status', () => {
			const wrapper = mountCarousel({ loans: [loan(1, 'unknown_status')] });

			expect(wrapper.findAllComponents(BorrowerStatusCardStub)).toHaveLength(0);
			expect(wrapper.text()).not.toContain('changing');
		});
	});

	// The modal is gated on `v-if="loanForMenu"` so MyKiva and the Impact Dashboard do not
	// mount a hidden KvLightbox — which renders its full subtree under v-show — on every
	// page load. That gate is what forces LoanCommentModal's isVisible watcher to be
	// `immediate`, since the component now mounts already open.
	describe('comment modal', () => {
		it('is not mounted before a loan is selected', () => {
			const wrapper = mountCarousel();

			expect(wrapper.findComponent({ name: 'LoanCommentModal' }).exists()).toBe(false);
		});

		it('mounts already visible when a card opens it', async () => {
			const wrapper = mountCarousel();

			await firstCard(wrapper).vm.$emit('open-comment-modal', { loan: loan(1) });

			const modal = wrapper.findComponent({ name: 'LoanCommentModal' });
			expect(modal.exists()).toBe(true);
			expect(modal.props('isVisible')).toBe(true);
			expect(modal.props('loan')).toMatchObject({ id: 1 });
		});

		// The v-if means the modal mounts with isVisible already true, so there is no
		// false->true transition for a plain watcher to observe. Only an immediate watcher
		// still autofocuses the comment box.
		it('focuses the comment box on open', async () => {
			const wrapper = mountCarousel({}, { attachTo: document.body });

			await firstCard(wrapper).vm.$emit('open-comment-modal', { loan: loan(1) });
			await nextTick();
			await nextTick();

			const textarea = wrapper.findComponent({ name: 'LoanCommentModal' }).find('textarea');
			expect(textarea.exists()).toBe(true);
			expect(document.activeElement).toBe(textarea.element);

			wrapper.unmount();
		});

		it('ignores an open request that carries no loan', async () => {
			const wrapper = mountCarousel();

			await firstCard(wrapper).vm.$emit('open-comment-modal', {});

			expect(wrapper.findComponent({ name: 'LoanCommentModal' }).exists()).toBe(false);
		});

		// The 500ms delay outlives the lightbox close transition. Unmounting on close would
		// cut the animation, which is why loanForMenu is cleared late rather than immediately.
		it('keeps the modal mounted through the close animation, then unmounts it', async () => {
			vi.useFakeTimers();
			const wrapper = mountCarousel();

			await firstCard(wrapper).vm.$emit('open-comment-modal', { loan: loan(1) });
			const modal = wrapper.findComponent({ name: 'LoanCommentModal' });

			await modal.vm.$emit('comment-modal-closed', false);
			expect(wrapper.findComponent({ name: 'LoanCommentModal' }).props('isVisible')).toBe(false);

			// Still mounted partway through, or the lightbox would vanish mid-transition
			// instead of animating out.
			vi.advanceTimersByTime(400);
			await nextTick();
			expect(wrapper.findComponent({ name: 'LoanCommentModal' }).exists()).toBe(true);

			vi.advanceTimersByTime(100);
			await nextTick();
			expect(wrapper.findComponent({ name: 'LoanCommentModal' }).exists()).toBe(false);
			vi.useRealTimers();
		});

		it('opens the side sheet for the commented loan when a comment was added', async () => {
			const wrapper = mountCarousel();

			await firstCard(wrapper).vm.$emit('open-comment-modal', { loan: loan(7) });
			await wrapper.findComponent({ name: 'LoanCommentModal' }).vm.$emit('comment-modal-closed', true);

			expect(wrapper.emitted('handle-selected-loan')?.[0]).toEqual([{ id: 7 }]);
		});

		it('does not open the side sheet when the modal closed without a comment', async () => {
			const wrapper = mountCarousel();

			await firstCard(wrapper).vm.$emit('open-comment-modal', { loan: loan(7) });
			await wrapper.findComponent({ name: 'LoanCommentModal' }).vm.$emit('comment-modal-closed', false);

			expect(wrapper.emitted('handle-selected-loan')).toBeUndefined();
		});
	});

	// ShareButton has had the same v-if since before this component was gated, so it is the
	// precedent for mounting a lightbox already open. Pinned here because the comment modal
	// now depends on the same behaviour.
	describe('share lightbox', () => {
		it('is not mounted before a loan is selected', () => {
			const wrapper = mountCarousel();

			expect(wrapper.findComponent(ShareButtonStub).exists()).toBe(false);
		});

		it('mounts with the lightbox already requested open', async () => {
			const wrapper = mountCarousel();

			await firstCard(wrapper).vm.$emit('open-share-modal', { loan: loan(4) });

			const share = wrapper.findComponent(ShareButtonStub);
			expect(share.exists()).toBe(true);
			expect(share.props('openLightbox')).toBe(true);
			expect(share.props('loan')).toMatchObject({ id: 4 });
		});

		it('keeps the button mounted through the close animation, then unmounts it', async () => {
			vi.useFakeTimers();
			const wrapper = mountCarousel();

			await firstCard(wrapper).vm.$emit('open-share-modal', { loan: loan(4) });
			await wrapper.findComponent(ShareButtonStub).vm.$emit('lightbox-closed');

			expect(wrapper.findComponent(ShareButtonStub).props('openLightbox')).toBe(false);

			vi.advanceTimersByTime(400);
			await nextTick();
			expect(wrapper.findComponent(ShareButtonStub).exists()).toBe(true);

			vi.advanceTimersByTime(100);
			await nextTick();
			expect(wrapper.findComponent(ShareButtonStub).exists()).toBe(false);
			vi.useRealTimers();
		});
	});

	describe('side sheet', () => {
		it('forwards the selected loan id', async () => {
			const wrapper = mountCarousel();

			await firstCard(wrapper).vm.$emit('open-side-sheet', { loan: loan(9) });

			expect(wrapper.emitted('handle-selected-loan')?.[0]).toEqual([{ id: 9 }]);
		});
	});

	// The slide width comes from a CSS custom property rather than a JS breakpoint read, so
	// the server and the client agree on it. A JS-derived width would render the mobile
	// value on the server and snap after hydration.
	describe('slide width', () => {
		it('defines the custom property on the component root', () => {
			const wrapper = mountCarousel();

			expect(wrapper.classes()).toContain('borrower-carousel-root');
		});

		it('hands the carousel a CSS var, not a measured pixel width', () => {
			// The component used to track window width through a throttled resize listener.
			// A JS-derived width renders the mobile value during SSR and snaps on hydration,
			// so the width has to be something CSS resolves on both sides.
			const wrapper = mountCarousel();

			expect(wrapper.findComponent(KvCarouselStub).props('slideMaxWidth'))
				.toBe('var(--borrower-slide-max-width)');
		});
	});
});
