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

const mountInsights = data => mount(LendingInsights, {
	global: {
		provide: {
			apollo: {
				readQuery: () => data,
				query: vi.fn(() => Promise.resolve({ data })),
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
		expect(share.props('modalTitle')).toBe('Share your lending stats');
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

	it('uses singular wording and drops the deposit claim when it is not true', async () => {
		const wrapper = mountInsights(lifetimeData({
			amount: 25, loans: 1, countries: 1, deposited: 25,
		}));
		await flushPromises();
		await wrapper.find('[data-testid="lending-stats-share-button"]').trigger('click');

		const message = wrapper.findComponent(KvSocialShareButtonStub).props('shareMessage');
		expect(message).toMatch(/^I've lent \$25 across 1 loan in 1 country through Kiva\. When a loan repays/);
		expect(message).not.toContain('fraction');
	});

	it('hides the share button for lenders with no loans', async () => {
		const wrapper = mountInsights(lifetimeData({
			amount: 0, loans: 0, countries: 0, deposited: 0,
		}));
		await flushPromises();

		expect(wrapper.find('[data-testid="lending-stats-share-button"]').exists()).toBe(false);
	});
});
