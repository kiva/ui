import { fireEvent, render, screen } from '@testing-library/vue';
import CreditSettingsSidebar from '#src/pages/Settings/CreditSettings/components/CreditSettingsSidebar';
import { globalOptions, routerLinkStub } from '../../../../specUtils';

const MONTHLY_GOOD_FAQ_LABEL = "Why can't I access my auto-lending settings as a Monthly Good subscriber?";

function renderSidebar(trackEvent = vi.fn()) {
	render(CreditSettingsSidebar, {
		props: { balance: 10, loading: false, promoBalance: 0 },
		global: {
			...globalOptions,
			stubs: { RouterLink: routerLinkStub },
			mocks: { ...globalOptions.mocks, $kvTrackEvent: trackEvent },
		},
	});
	return trackEvent;
}

function openMonthlyGoodFaq() {
	return fireEvent.click(screen.getByRole('button', { name: MONTHLY_GOOD_FAQ_LABEL }));
}

// kv-lightbox keeps every FAQ body mounted (v-show), so multiple router-links can share
// a `to` target at once — match by link text, which stays unique, not by `to`.
async function expectRouterLinkTracksClick(trackEvent, text, to, label) {
	const link = screen.getByText(text, { selector: 'router-link' });
	expect(link.getAttribute('to')).toBe(to);
	await fireEvent.click(link);
	expect(trackEvent).toHaveBeenCalledWith('user-settings', 'click', label);
}

describe('CreditSettingsSidebar', () => {
	describe('FAQ list', () => {
		test('renders the sidebar FAQ links left-aligned so long labels wrap without centering', () => {
			renderSidebar();

			const donationsLink = screen.getByRole('button', { name: 'How does Kiva use donations?' });
			expect(donationsLink.className).toContain('tw-text-left');
		});
	});

	describe('an existing FAQ (auto-lending)', () => {
		test('opens the lightbox and tracks open/close events', async () => {
			const trackEvent = renderSidebar();

			await fireEvent.click(screen.getByRole('button', { name: 'What is auto lending?' }));
			expect(trackEvent).toHaveBeenCalledWith('user-settings', 'click', 'auto-lending');
			expect(screen.getByText(/Kiva’s auto-lending tool enables you/)).toBeTruthy();

			await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
			expect(trackEvent).toHaveBeenCalledTimes(2);
			expect(trackEvent).toHaveBeenLastCalledWith('user-settings', 'click', 'auto-lending');
		});
	});

	describe('an existing FAQ with an embedded link (inactive withdrawal)', () => {
		test('links to auto-lending settings via router-link and tracks the click', async () => {
			const trackEvent = renderSidebar();

			await fireEvent.click(screen.getByRole('button', { name: 'What is inactive withdrawal?' }));
			await expectRouterLinkTracksClick(
				trackEvent,
				'Click here',
				'/settings/autolending',
				'auto-lending-settings',
			);
		});
	});

	describe('the Monthly Good auto-lending FAQ', () => {
		test('opens with the approved copy and tracks the FAQ open event', async () => {
			const trackEvent = renderSidebar();

			await openMonthlyGoodFaq();

			expect(trackEvent).toHaveBeenCalledWith('user-settings', 'click', 'autolending-settings-faq');
			expect(screen.getByText(/your lending preferences are based on the Monthly Good category/)).toBeTruthy();
			expect(screen.getByText('Monthly Good category or subscription').tagName).toBe('SPAN');
		});

		test('links to subscription settings and auto-lending settings with their own tracking labels', async () => {
			const trackEvent = renderSidebar();

			await openMonthlyGoodFaq();

			await expectRouterLinkTracksClick(
				trackEvent,
				'subscription settings',
				'/settings/subscriptions',
				'autolending-settings-faq-subscription-settings',
			);
			await expectRouterLinkTracksClick(
				trackEvent,
				'auto-lending settings',
				'/settings/autolending',
				'autolending-settings-faq-autolending-settings',
			);
		});

		test('tracks the FAQ close event when the lightbox is dismissed', async () => {
			const trackEvent = renderSidebar();

			await openMonthlyGoodFaq();
			await fireEvent.click(screen.getByRole('button', { name: 'Close' }));

			expect(trackEvent).toHaveBeenLastCalledWith('user-settings', 'click', 'autolending-settings-faq');
		});
	});
});
