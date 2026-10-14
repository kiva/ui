/* eslint-disable import/no-extraneous-dependencies */
import { enableAutoUnmount, shallowMount } from '@vue/test-utils';
import FullBorrowerProfile from '#src/components/BorrowerProfile/FullBorrowerProfile';
import SummaryCard from '#src/components/BorrowerProfile/SummaryCard';
import ShareButton from '#src/components/BorrowerProfile/ShareButton';
import WhyLoansBanner from '#src/components/BorrowerProfile/WhyLoansBanner';
import { NEW_USER_BP_EXP_INJECT_KEY } from '#src/util/newUserBorrowerProfileExp';
import { globalOptions } from '../../../specUtils';

enableAutoUnmount(afterEach);

const {
	isAnonymized,
	isPrivileged,
	showAddCommentsSection,
	showUpdatesSection,
} = FullBorrowerProfile.computed;

// Evaluates a computed with a mock `this` context, resolving other computeds it depends on.
function evalShowComments({ privileged = false, anonymizationLevel = 'none' } = {}) {
	const context = {
		loanData: {
			anonymizationLevel,
			userProperties: { isPrivileged: privileged },
		},
	};
	context.isAnonymized = isAnonymized.call(context);
	context.isPrivileged = isPrivileged.call(context);
	return showAddCommentsSection.call(context);
}

// Evaluates showUpdatesSection with a mock `this`.
function evalShowUpdates({ showUpdates = true, anonymizationLevel = 'none' } = {}) {
	const context = {
		showUpdates,
		loanData: { anonymizationLevel },
	};
	return showUpdatesSection.call(context);
}

describe('FullBorrowerProfile comment section visibility', () => {
	describe('isAnonymized', () => {
		it.each([
			['full', true],
			['pii', true],
			['none', false],
			[undefined, false],
			['', false],
		])('anonymizationLevel "%s" -> %s', (level, expected) => {
			expect(isAnonymized.call({ loanData: { anonymizationLevel: level } })).toBe(expected);
		});
	});

	describe('isPrivileged', () => {
		it('defaults to false when userProperties are missing', () => {
			expect(isPrivileged.call({ loanData: {} })).toBe(false);
			expect(isPrivileged.call({})).toBe(false);
		});
	});

	describe('showComments', () => {
		describe('privileged user', () => {
			it('shows when the loan is not anonymized', () => {
				expect(evalShowComments({ privileged: true, anonymizationLevel: 'none' })).toBe(true);
			});

			it('treats a missing anonymizationLevel as none', () => {
				expect(evalShowComments({ privileged: true, anonymizationLevel: undefined })).toBe(true);
			});

			it('hides on a full/pii anonymized loan', () => {
				expect(evalShowComments({ privileged: true, anonymizationLevel: 'full' })).toBe(false);
				expect(evalShowComments({ privileged: true, anonymizationLevel: 'pii' })).toBe(false);
			});
		});

		describe('non-privileged user', () => {
			it('hides regardless of anonymization', () => {
				expect(evalShowComments({ privileged: false, anonymizationLevel: 'none' })).toBe(false);
				expect(evalShowComments({ privileged: false, anonymizationLevel: 'full' })).toBe(false);
				expect(evalShowComments({ privileged: false, anonymizationLevel: 'pii' })).toBe(false);
			});
		});
	});
});

describe('FullBorrowerProfile updates section visibility', () => {
	it('shows updates on a non-anonymized loan', () => {
		expect(evalShowUpdates({ showUpdates: true, anonymizationLevel: 'none' })).toBe(true);
		expect(evalShowUpdates({ showUpdates: true, anonymizationLevel: undefined })).toBe(true);
	});

	it('hides updates on a pii-anonymized loan (MP-3083)', () => {
		expect(evalShowUpdates({ showUpdates: true, anonymizationLevel: 'pii' })).toBe(false);
	});

	it('still shows updates on a full-anonymized loan (bodies are not stripped for full)', () => {
		expect(evalShowUpdates({ showUpdates: true, anonymizationLevel: 'full' })).toBe(true);
	});

	it('stays hidden once the child has emitted hide-section', () => {
		expect(evalShowUpdates({ showUpdates: false, anonymizationLevel: 'none' })).toBe(false);
	});
});

describe('FullBorrowerProfile new user version', () => {
	const { openShareLightbox, scrollToLoanDetails } = FullBorrowerProfile.methods;

	describe('openShareLightbox', () => {
		it('opens the lightbox and keeps the share-lightbox tracking event', () => {
			const ctx = { isShareLightboxOpen: false, shareCampaign: 'social_share_bp', $kvTrackEvent: vi.fn() };

			openShareLightbox.call(ctx);

			expect(ctx.isShareLightboxOpen).toBe(true);
			expect(ctx.$kvTrackEvent)
				.toHaveBeenCalledWith('borrower-profile', 'show', 'share-lightbox', 'social_share_bp');
		});
	});

	describe('scrollToLoanDetails', () => {
		let section;

		beforeEach(() => {
			section = document.createElement('div');
			section.id = 'loanDetails';
			Object.defineProperty(section, 'offsetTop', { value: 1234 });
			document.body.appendChild(section);
		});

		afterEach(() => {
			section.remove();
		});

		it('smooth-scrolls to the loan details section like the jump link does', () => {
			const ctx = { smoothScrollTo: vi.fn(), $kvTrackEvent: vi.fn() };

			scrollToLoanDetails.call(ctx);

			expect(ctx.smoothScrollTo).toHaveBeenCalledWith({ yPosition: 1234, millisecondsToAnimate: 750 });
			expect(ctx.$kvTrackEvent).toHaveBeenCalledWith('Borrower profile', 'click-jump-link', 'Loan details');
		});

		it('scrolls to the top when the section is not in the DOM yet', () => {
			section.remove();
			const ctx = { smoothScrollTo: vi.fn(), $kvTrackEvent: vi.fn() };

			scrollToLoanDetails.call(ctx);

			expect(ctx.smoothScrollTo).toHaveBeenCalledWith({ yPosition: 0, millisecondsToAnimate: 750 });
		});
	});

	describe('template wiring', () => {
		// Renders the share slot so the control's share button placement can be asserted
		const LendCtaStub = {
			name: 'LendCta',
			props: ['hideJumpLinks'],
			template: '<div data-testid="lend-cta-stub"><slot name="sharebutton" /></div>',
		};

		// `isNewUserVariant` undefined = the page provides nothing (e.g. Storybook); the inject must default to false
		function mountProfile({ isNewUserVariant, loading = false } = {}) {
			return shallowMount(FullBorrowerProfile, {
				props: {
					loan: { id: 123, name: 'Maria', status: 'fundraising' },
					lender: {},
					loading,
				},
				global: {
					...globalOptions,
					// Shallow stubs drop their default slot; the card and the lend box sit inside layout wrappers
					renderStubDefaultSlot: true,
					stubs: { LendCta: LendCtaStub },
					mocks: { ...globalOptions.mocks, $route: { params: { id: '123' }, query: {} } },
					provide: {
						...globalOptions.provide,
						...(isNewUserVariant === undefined ? {} : { [NEW_USER_BP_EXP_INJECT_KEY]: isNewUserVariant }),
					},
				},
			});
		}

		it.each([
			['nothing provided', undefined],
			['false provided', false],
		])('%s keeps the control: no card actions, share button in the lend box', (_, isNewUserVariant) => {
			const wrapper = mountProfile({ isNewUserVariant });

			expect(wrapper.findComponent(SummaryCard).props('showActions')).toBe(false);
			expect(wrapper.findComponent(LendCtaStub).props('hideJumpLinks')).toBe(false);
			const shareButtons = wrapper.findAllComponents(ShareButton);
			expect(shareButtons).toHaveLength(1);
			expect(shareButtons[0].props('variant')).not.toBe('hidden');
			expect(wrapper.find('[data-testid="lend-cta-stub"]').findComponent(ShareButton).exists()).toBe(true);
		});

		it('version b shows the card actions and moves the single share button out of the lend box, hidden', () => {
			const wrapper = mountProfile({ isNewUserVariant: true });

			expect(wrapper.findComponent(SummaryCard).props('showActions')).toBe(true);
			expect(wrapper.findComponent(LendCtaStub).props('hideJumpLinks')).toBe(true);
			const shareButtons = wrapper.findAllComponents(ShareButton);
			expect(shareButtons).toHaveLength(1);
			expect(shareButtons[0].props('variant')).toBe('hidden');
			expect(shareButtons[0].props('openLightbox')).toBe(false);
			expect(wrapper.find('[data-testid="lend-cta-stub"]').findComponent(ShareButton).exists()).toBe(false);
		});

		it('version b opens the share lightbox from the card and can open it again after closing', async () => {
			const wrapper = mountProfile({ isNewUserVariant: true });
			const card = wrapper.findComponent(SummaryCard);
			const share = () => wrapper.findComponent(ShareButton);

			card.vm.$emit('share');
			await wrapper.vm.$nextTick();
			expect(share().props('openLightbox')).toBe(true);

			share().vm.$emit('lightbox-closed');
			await wrapper.vm.$nextTick();
			expect(share().props('openLightbox')).toBe(false);

			card.vm.$emit('share');
			await wrapper.vm.$nextTick();
			expect(share().props('openLightbox')).toBe(true);
		});

		it('version b: a share click while loading opens the lightbox as soon as the loan has loaded', async () => {
			const wrapper = mountProfile({ isNewUserVariant: true, loading: true });
			expect(wrapper.findComponent(ShareButton).exists()).toBe(false);

			wrapper.findComponent(SummaryCard).vm.$emit('share');
			await wrapper.setProps({ loading: false });

			expect(wrapper.findComponent(ShareButton).props('openLightbox')).toBe(true);
		});

		it('version b scrolls to the details on loan-details and leaves the rail closed', () => {
			const wrapper = mountProfile({ isNewUserVariant: true });
			const scrollSpy = vi.spyOn(wrapper.vm, 'smoothScrollTo').mockImplementation(() => {});

			wrapper.findComponent(SummaryCard).vm.$emit('loan-details');

			expect(scrollSpy).toHaveBeenCalledTimes(1);
			expect(wrapper.vm.showDetailsInRail).toBe(false);
			expect(wrapper.find('[data-testid="bp-rail-details"]').exists()).toBe(false);
		});

		it('control renders no "Why loans" banner', () => {
			const wrapper = mountProfile({ isNewUserVariant: false });

			expect(wrapper.findAllComponents(WhyLoansBanner)).toHaveLength(0);
		});

		it('version b renders the banner below the hero (desktop) and after the story (mobile) with the loan', () => {
			const wrapper = mountProfile({ isNewUserVariant: true });

			const desktop = wrapper.find('[data-testid="bp-why-loans-desktop"]');
			const mobile = wrapper.find('[data-testid="bp-why-loans-mobile"]');
			expect(desktop.classes()).toEqual(expect.arrayContaining(['tw-hidden', 'lg:tw-block']));
			expect(mobile.classes()).toContain('lg:tw-hidden');
			expect(desktop.findComponent(WhyLoansBanner).props('loan').name).toBe('Maria');
			expect(mobile.findComponent(WhyLoansBanner).props('loan').name).toBe('Maria');
		});

		it.each(['desktop', 'mobile'])('version b: %s banner opens the How Kiva works lightbox', async placement => {
			const wrapper = mountProfile({ isNewUserVariant: true });
			const banner = wrapper.find(`[data-testid="bp-why-loans-${placement}"]`).findComponent(WhyLoansBanner);

			banner.vm.$emit('how-it-works');
			await wrapper.vm.$nextTick();

			expect(wrapper.findComponent({ name: 'HowKivaWorksLightbox' }).props('visible')).toBe(true);
		});
	});
});
