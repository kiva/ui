/* eslint-disable import/no-extraneous-dependencies */
import { enableAutoUnmount, flushPromises, shallowMount } from '@vue/test-utils';
import FullBorrowerProfile from '#src/components/BorrowerProfile/FullBorrowerProfile';
import BorrowerCountry from '#src/components/BorrowerProfile/BorrowerCountry';
import ContributingPartners from '#src/components/BorrowerProfile/ContributingPartners';
import LendersAndTeams from '#src/components/BorrowerProfile/LendersAndTeams';
import MoreAboutLoan from '#src/components/BorrowerProfile/MoreAboutLoan';
import SummaryCard from '#src/components/BorrowerProfile/SummaryCard';
import SidebarContainer from '#src/components/BorrowerProfile/SidebarContainer';
import ShareButton from '#src/components/BorrowerProfile/ShareButton';
import WhyLoansBanner from '#src/components/BorrowerProfile/WhyLoansBanner';
import GlobalImpactBar from '#src/components/BorrowerProfile/GlobalImpactBar';
import { NEW_USER_BP_EXP_INJECT_KEY } from '#src/util/newUserBorrowerProfileExp';
import store2 from 'store2';
import setUserPreferenceMutation from '#src/graphql/mutation/accountSettings/setUserPreference.graphql';
import { RAIL_PREF_KEY } from '#src/util/loanDetailsRailPreference';
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

describe('FullBorrowerProfile rail preference toggle', () => {
	const { set: setShowDetailsInRail } = FullBorrowerProfile.computed.showDetailsInRailModel;

	afterEach(() => {
		store2.remove(RAIL_PREF_KEY);
	});

	const makeContext = overrides => ({
		showDetailsInRail: false,
		loanId: 123,
		isLoggedIn: true,
		userPreferences: null,
		apollo: { mutate: vi.fn().mockResolvedValue({ data: {} }) },
		$kvTrackEvent: vi.fn(),
		...overrides,
	});

	it('persists the account preference for a logged-in lender with no preferences row', async () => {
		const context = makeContext();

		setShowDetailsInRail.call(context, true);
		await Promise.resolve();

		expect(context.showDetailsInRail).toBe(true);
		expect(context.apollo.mutate).toHaveBeenCalledTimes(1);
		expect(context.apollo.mutate).toHaveBeenCalledWith({
			mutation: setUserPreferenceMutation,
			variables: { key: 'showLoanDetailsInRail', value: 'true' },
		});
	});

	it('writes only the rail key when the lender already has other preferences', async () => {
		const context = makeContext({
			showDetailsInRail: true,
			userPreferences: { id: 7, preferences: '{"goals":[{"goalName":"g"}]}' },
		});

		setShowDetailsInRail.call(context, false);
		await Promise.resolve();

		expect(context.apollo.mutate).toHaveBeenCalledWith({
			mutation: setUserPreferenceMutation,
			variables: { key: 'showLoanDetailsInRail', value: 'false' },
		});
	});

	it('skips the account write when logged out', async () => {
		const context = makeContext({ isLoggedIn: false });

		setShowDetailsInRail.call(context, true);
		await Promise.resolve();

		expect(context.showDetailsInRail).toBe(true);
		expect(context.apollo.mutate).not.toHaveBeenCalled();
	});
});

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
	const { openShareLightbox, scrollToLoanDetails, updateWhyLoansSpace } = FullBorrowerProfile.methods;

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

	describe('updateWhyLoansSpace', () => {
		// The test page has no layout, so positions and heights are faked
		const fakeElement = ({ top = 0, height = 0, style = '' } = {}) => {
			const element = document.createElement('div');
			element.setAttribute('style', style);
			element.getBoundingClientRect = () => ({ top });
			Object.defineProperty(element, 'offsetHeight', { value: height });
			return element;
		};

		it('pushes the band down to start 32px below a lend box that ends lower than the top card', () => {
			// Lend box column at 65px, with 64px padding and an 8px margin
			const sidebarColumn = fakeElement({ top: 65, style: 'padding-top: 64px' });
			sidebarColumn.appendChild(fakeElement({ style: 'margin-top: 8px' }));
			// getComputedStyle needs the element on the page
			document.body.appendChild(sidebarColumn);
			const ctx = {
				whyLoansExtraSpace: 0,
				$refs: {
					sidebarColumn,
					// Ends at 65 + 64 + 8 + 427 = 564px
					lendCta: { $el: fakeElement({ height: 427 }) },
					// Band starts 32px below a top card ending at 497px
					whyLoansDesktop: { $el: fakeElement({ top: 529 }) },
				},
			};

			updateWhyLoansSpace.call(ctx);
			sidebarColumn.remove();

			// Needs to start at 564 + 32 = 596px, so 67px lower
			expect(ctx.whyLoansExtraSpace).toBe(67);
		});
	});

	describe('template wiring', () => {
		// Renders the share slot so the control's share button placement can be asserted
		const LendCtaStub = {
			name: 'LendCta',
			props: { hideJumpLinks: Boolean, stickyClone: Boolean, defaultLoanShareAmount: Number },
			template: '<div data-testid="lend-cta-stub"><slot name="sharebutton" /></div>',
		};

		// `isNewUserVariant` undefined = the page provides nothing (e.g. Storybook); the inject must default to false
		function mountProfile({ isNewUserVariant, loading = false, showDetailsInRail = false } = {}) {
			return shallowMount(FullBorrowerProfile, {
				props: {
					loan: { id: 123, name: 'Maria', status: 'fundraising' },
					lender: {},
					loading,
					initialShowDetailsInRail: showDetailsInRail,
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
		])('%s keeps the control: no card actions, share button in the lend box, no bar', (_, isNewUserVariant) => {
			const wrapper = mountProfile({ isNewUserVariant });

			expect(wrapper.findComponent(SummaryCard).props('showActions')).toBe(false);
			expect(wrapper.findComponent(LendCtaStub).props('hideJumpLinks')).toBe(false);
			const shareButtons = wrapper.findAllComponents(ShareButton);
			expect(shareButtons).toHaveLength(1);
			expect(shareButtons[0].props('variant')).not.toBe('hidden');
			expect(wrapper.find('[data-testid="lend-cta-stub"]').findComponent(ShareButton).exists()).toBe(true);
			expect(wrapper.findComponent(GlobalImpactBar).exists()).toBe(false);
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

		it('version b keeps the top lend box in its place and adds a second, sticky lend box', async () => {
			const wrapper = mountProfile({ isNewUserVariant: true });
			await wrapper.vm.$nextTick();
			const [topLendBox, stickyLendBox] = wrapper.findAllComponents(LendCtaStub);

			expect(wrapper.findAllComponents(SidebarContainer)[0].classes()).not.toContain('lg:tw-sticky');
			expect(topLendBox.props('stickyClone')).toBe(false);
			expect(stickyLendBox.props('stickyClone')).toBe(true);
		});

		it('passes the default loan share amount preference to the top and sticky lend boxes', async () => {
			const wrapper = mountProfile({ isNewUserVariant: true });
			await wrapper.setData({ userPreferences: { id: 7, preferences: '{"defaultLoanShareAmount":100}' } });

			expect(wrapper.findAllComponents(LendCtaStub).map(lendBox => lendBox.props('defaultLoanShareAmount')))
				.toEqual([100, 100]);
		});

		it('leaves the lend boxes without a default amount when the lender has no preference', async () => {
			const wrapper = mountProfile({ isNewUserVariant: true });
			await wrapper.setData({ userPreferences: { id: 7, preferences: '{}' } });

			expect(wrapper.findAllComponents(LendCtaStub).map(lendBox => lendBox.props('defaultLoanShareAmount')))
				.toEqual([undefined, undefined]);
		});

		it('version b sticks the second lend box in its own article-high column, beside the top one', async () => {
			const wrapper = mountProfile({ isNewUserVariant: true });
			await wrapper.vm.$nextTick();
			const stickyColumn = wrapper.find('[data-testid="bp-sticky-lend-box"]');
			const topColumn = wrapper.findAllComponents(SidebarContainer)[0].element.parentElement;

			expect(stickyColumn.classes())
				.toEqual(expect.arrayContaining(['lg:tw-absolute', 'lg:tw-top-0', 'lg:tw-h-full']));
			expect(stickyColumn.element.parentElement).toBe(topColumn.parentElement);
			expect(stickyColumn.findComponent(SidebarContainer).classes())
				.toEqual(expect.arrayContaining(['lg:tw-sticky', 'lg:tw-top-12', 'lg:tw-pb-8']));
		});

		it('version b fades the sticky lend box itself, not its article-high column', async () => {
			const wrapper = mountProfile({ isNewUserVariant: true });
			await flushPromises();
			const column = wrapper.find('[data-testid="bp-sticky-lend-box"]');
			const box = column.findComponent(SidebarContainer);

			expect(box.classes()).toEqual(expect.arrayContaining(['lg:tw-transition-opacity', 'lg:tw-opacity-0']));
			expect(column.classes()).not.toContain('lg:tw-opacity-0');

			wrapper.vm.stickyLendBoxVisible = true;
			await wrapper.vm.$nextTick();

			expect(box.classes()).not.toContain('lg:tw-opacity-0');
		});

		it('version b shows the loan details only under the sticky lend box, not beside the top card', async () => {
			const wrapper = mountProfile({ isNewUserVariant: true, showDetailsInRail: true });
			await wrapper.vm.$nextTick();

			const stickyLendBox = wrapper.find('[data-testid="bp-sticky-lend-box"]');

			expect(wrapper.findAll('[data-testid="bp-rail-details"]')).toHaveLength(1);
			expect(stickyLendBox.find('[data-testid="bp-rail-details"]').exists()).toBe(true);
		});

		it('version b adds the sticky lend box only on desktop', async () => {
			const { innerWidth } = window;
			window.innerWidth = 800;
			const wrapper = mountProfile({ isNewUserVariant: true });
			await wrapper.vm.$nextTick();
			window.innerWidth = innerWidth;

			expect(wrapper.find('[data-testid="bp-sticky-lend-box"]').exists()).toBe(false);
		});

		it('version b leaves only the sticky lend box to screen readers and keyboards while it shows', async () => {
			const wrapper = mountProfile({ isNewUserVariant: true });
			// Lets the first visibility check after the sticky clone renders finish
			await flushPromises();

			wrapper.vm.stickyLendBoxVisible = true;
			await wrapper.vm.$nextTick();

			expect(wrapper.findAllComponents(SidebarContainer)[0].attributes('inert')).toBeDefined();
			expect(wrapper.find('[data-testid="bp-sticky-lend-box"]').attributes('inert')).toBeUndefined();
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

		it('version b renders the global impact bar once, after the profile article', () => {
			const wrapper = mountProfile({ isNewUserVariant: true });

			const bars = wrapper.findAllComponents(GlobalImpactBar);
			expect(bars).toHaveLength(1);
			expect(bars[0].element.previousElementSibling).toBe(wrapper.find('article').element);
		});

		describe('collapsible sections', () => {
			const collapsibleProps = wrapper => [
				wrapper.findComponent(MoreAboutLoan),
				wrapper.findComponent(ContributingPartners),
				...wrapper.findAllComponents(LendersAndTeams),
			].map(section => section.props('collapsible'));

			it('version b collapses the sections below the story', () => {
				const wrapper = mountProfile({ isNewUserVariant: true });

				expect(collapsibleProps(wrapper)).toEqual([true, true, true, true]);
			});

			it('the control keeps the sections open', () => {
				const wrapper = mountProfile({ isNewUserVariant: false });

				expect(collapsibleProps(wrapper)).toEqual([false, false, false, false]);
			});

			it('version b never collapses the country section', () => {
				const wrapper = mountProfile({ isNewUserVariant: true });

				expect(wrapper.findComponent(BorrowerCountry).props()).not.toHaveProperty('collapsible');
			});
		});
	});
});
