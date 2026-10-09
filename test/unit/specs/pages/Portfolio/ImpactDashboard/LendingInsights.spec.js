/* eslint-disable import/no-extraneous-dependencies, vue/one-component-per-file */
import { mount, flushPromises } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import LendingInsights from '#src/pages/Portfolio/ImpactDashboard/LendingInsights';

const AsyncPortfolioSectionStub = defineComponent({
	name: 'AsyncPortfolioSection',
	setup(_, { slots }) {
		return () => h('section', slots.default?.());
	},
});

const KvSocialShareButtonStub = defineComponent({
	name: 'KvSocialShareButton',
	props: {
		openLightbox: { type: Boolean, default: false },
		shareMessage: { type: String, default: '' },
		utmCampaign: { type: String, default: '' },
		trackingCategory: { type: String, default: '' },
		variant: { type: String, default: '' },
		modalTitle: { type: String, default: '' },
		compactButtons: { type: Boolean, default: false },
		fixedWidthModal: { type: Boolean, default: false },
	},
	emits: ['lightbox-closed'],
	template: '<div class="social-share-stub"><slot name="modal-content" /></div>',
});

const lifetimeData = ({
	amount = 1525,
	loans = 74,
	countries = 31,
	deposited = 200,
} = {}) => ({
	my: {
		id: 1,
		lendingStats: {
			id: 1,
			amountLentPercentile: 80,
			totalAmountDeposited: deposited,
			lentTo: { countries: { totalCount: countries } },
		},
		userStats: { amount_of_loans: amount, number_of_loans: loans },
	},
});

const mockTrackEvent = vi.fn();

const mountInsights = (data, query = vi.fn(() => Promise.resolve({ data }))) => mount(LendingInsights, {
	global: {
		provide: {
			apollo: {
				readQuery: () => data,
				query,
			},
			cookieStore: {},
		},
		mocks: {
			$kvTrackEvent: mockTrackEvent,
			$filters: { numeral: value => String(value) },
		},
		directives: { kvTrackEvent: {} },
		stubs: {
			AsyncPortfolioSection: AsyncPortfolioSectionStub,
			KvSocialShareButton: KvSocialShareButtonStub,
			RouterLink: true,
		},
	},
});

describe('LendingInsights share', () => {
	beforeEach(() => {
		mockTrackEvent.mockClear();
	});

	it('tracks the click and opens the share modal', async () => {
		const wrapper = mountInsights(lifetimeData());
		await flushPromises();

		expect(wrapper.findComponent(KvSocialShareButtonStub).exists()).toBe(false);

		await wrapper.find('[data-testid="lending-stats-share-button"]').trigger('click');

		expect(mockTrackEvent).toHaveBeenCalledWith('portfolio', 'click', 'lending-stats-share');
		const share = wrapper.findComponent(KvSocialShareButtonStub);
		expect(share.props('openLightbox')).toBe(true);
		expect(share.props('trackingCategory')).toBe('portfolio');
		expect(share.props('variant')).toBe('hidden');
		expect(share.props('modalTitle')).toBe('Share your lending impact');
		expect(share.props('compactButtons')).toBe(true);
		expect(share.props('fixedWidthModal')).toBe(true);
		expect(share.props('utmCampaign')).toBe('social_share_portfolio_lending_stats');

		share.vm.$emit('lightbox-closed');
		await wrapper.vm.$nextTick();
		expect(share.props('openLightbox')).toBe(false);
	});

	it('builds the share message from portfolio stats', async () => {
		const wrapper = mountInsights(lifetimeData());
		await flushPromises();
		await wrapper.find('[data-testid="lending-stats-share-button"]').trigger('click');

		const message = wrapper.findComponent(KvSocialShareButtonStub).props('shareMessage');
		expect(wrapper.find('[data-testid="lending-stats-share-message"]').element.value).toBe(message);
		expect(message).toBe(
			'I\'ve lent $1,525 across 74 loans in 31 countries through Kiva — and I only deposited a fraction '
			+ 'of that. When a loan repays, I re-lend it to someone new. The same dollars keep going.\n\n'
			+ 'Kiva is a nonprofit that lets you lend as little as $25 to a farmer, student, or small business '
			+ 'owner who needs a hand up. You\'re not just donating — you\'re telling someone you believe in them '
			+ 'and their future, when most of the world shuts them out.\n\n'
			+ 'Give it a try: kiva.org\n\n#Kiva',
		);
	});

	it('shares the lender\'s edited message', async () => {
		const wrapper = mountInsights(lifetimeData());
		await flushPromises();
		await wrapper.find('[data-testid="lending-stats-share-button"]').trigger('click');

		await wrapper.find('[data-testid="lending-stats-share-message"]').setValue('My shorter post');

		expect(wrapper.findComponent(KvSocialShareButtonStub).props('shareMessage')).toBe('My shorter post');
	});

	it('uses singular wording and drops the deposit line when $25 was deposited and lent once', async () => {
		const wrapper = mountInsights(lifetimeData({
			amount: 25, loans: 1, countries: 1, deposited: 25,
		}));
		await flushPromises();
		await wrapper.find('[data-testid="lending-stats-share-button"]').trigger('click');

		const message = wrapper.findComponent(KvSocialShareButtonStub).props('shareMessage');
		expect(message).toMatch(/^I've lent \$25 across 1 loan in 1 country through Kiva\. When a loan repays/);
		expect(message).not.toContain('fraction');
	});

	it.each([
		['deposited 200, lent 1,525', { amount: 1525, loans: 74, deposited: 200 }, true],
		['deposited 25, lent it once', { amount: 25, loans: 1, deposited: 25 }, false],
		['deposited 100, lent 100 across 4 loans', { amount: 100, loans: 4, deposited: 100 }, false],
		['deposited 25, re-lent it once', { amount: 50, loans: 2, deposited: 25 }, true],
	])('only claims a fraction was deposited when it is true: %s', async (_, stats, showsFraction) => {
		const wrapper = mountInsights(lifetimeData(stats));
		await flushPromises();
		await wrapper.find('[data-testid="lending-stats-share-button"]').trigger('click');

		const message = wrapper.findComponent(KvSocialShareButtonStub).props('shareMessage');
		expect(message.includes('and I only deposited a fraction of that')).toBe(showsFraction);
	});

	it('labels the share message box for screen readers', async () => {
		const wrapper = mountInsights(lifetimeData());
		await flushPromises();
		await wrapper.find('[data-testid="lending-stats-share-button"]').trigger('click');

		expect(wrapper.find('[data-testid="lending-stats-share-message"]').attributes('aria-label'))
			.toBe('Share message');
	});

	it('shares the suggested message when the lender clears the text box', async () => {
		const wrapper = mountInsights(lifetimeData());
		await flushPromises();
		await wrapper.find('[data-testid="lending-stats-share-button"]').trigger('click');

		await wrapper.find('[data-testid="lending-stats-share-message"]').setValue('   ');

		expect(wrapper.findComponent(KvSocialShareButtonStub).props('shareMessage'))
			.toMatch(/^I've lent \$1,525 across 74 loans/);
	});

	it('hides the share button when the stats fail to load', async () => {
		const query = vi.fn(() => Promise.reject(new Error('network')));
		const wrapper = mountInsights(null, query);
		wrapper.findComponent(AsyncPortfolioSectionStub).vm.$emit('visible');
		await flushPromises();

		expect(query).toHaveBeenCalled();
		expect(wrapper.find('[data-testid="lending-stats-share-button"]').exists()).toBe(false);
	});

	it('disables the share button while stats are loading', async () => {
		// No cached stats, and the stubbed section never becomes visible to fetch them
		const wrapper = mountInsights(null);
		await flushPromises();

		expect(wrapper.find('[data-testid="lending-stats-share-button"]').attributes('disabled')).toBeDefined();
	});

	it('hides the share button for lenders with no loans', async () => {
		const wrapper = mountInsights(lifetimeData({
			amount: 0, loans: 0, countries: 0, deposited: 0,
		}));
		await flushPromises();

		expect(wrapper.find('[data-testid="lending-stats-share-button"]').exists()).toBe(false);
	});
});
