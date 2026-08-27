import { render, waitFor } from '@testing-library/vue';
import BadgesList from '#src/pages/Portfolio/LendingStats/BadgesList';
import { STATE_EARNED } from '#src/composables/useBadgeModal';

const flushPromises = () => new Promise(resolve => { setTimeout(resolve); });

const eventBadge = (id = 'stewardship-2026') => ({
	id,
	level: 0,
	earnedAtDate: '2026-08-21',
	challengeName: 'Stewardship',
	achievementData: { tiers: [] },
});

// Only completedAchievements varies between rerenders; the other props stay put.
const rerenderWith = (rerender, completedAchievements) => rerender({
	completedAchievements,
	isLoading: false,
	loans: [],
	badgesData: [],
});

const renderBadgesList = ({ completedAchievements = [], query = {}, trackEvent = () => {} } = {}) => {
	return render(BadgesList, {
		props: {
			completedAchievements,
			isLoading: false,
			loans: [],
			badgesData: [],
		},
		global: {
			provide: {
				apollo: { query: () => Promise.resolve({}) },
			},
			directives: { kvTrackEvent: () => {} },
			mocks: {
				$kvTrackEvent: trackEvent,
				$router: { push: () => {}, currentRoute: { value: { query } } },
				$route: { query },
			},
			stubs: {
				BadgeCard: { name: 'BadgeCard', props: ['badge'], template: '<div />' },
				JourneySideSheet: { name: 'JourneySideSheet', template: '<div />' },
				KvLoadingPlaceholder: { name: 'KvLoadingPlaceholder', template: '<div />' },
				BadgeModal: {
					name: 'BadgeModal',
					props: ['show', 'badge', 'state', 'tier', 'isEarnedSection'],
					template: `<div
						data-testid="badge-modal"
						:data-badge-id="badge && badge.id"
						:data-state="state"
					/>`,
				},
			},
		},
	});
};

describe('BadgesList email-link auto-open', () => {
	it('auto-opens the earned badge modal when arriving via the badge email link', async () => {
		const { queryByTestId } = renderBadgesList({
			completedAchievements: [eventBadge('stewardship-2026')],
			query: { utm_campaign: 'badge_stewardship-2026' },
		});

		await waitFor(() => expect(queryByTestId('badge-modal')).toBeTruthy());
		expect(queryByTestId('badge-modal').getAttribute('data-badge-id')).toBe('stewardship-2026');
		expect(queryByTestId('badge-modal').getAttribute('data-state')).toBe(STATE_EARNED);
	});

	it('does not auto-open on an ordinary visit without the email param', async () => {
		const { queryByTestId } = renderBadgesList({
			completedAchievements: [eventBadge('stewardship-2026')],
			query: {},
		});

		await flushPromises();
		expect(queryByTestId('badge-modal')).toBeNull();
	});

	it('does not auto-open when the user does not own the linked badge', async () => {
		const { queryByTestId } = renderBadgesList({
			completedAchievements: [eventBadge('some-other-badge')],
			query: { utm_campaign: 'badge_stewardship-2026' },
		});

		await flushPromises();
		expect(queryByTestId('badge-modal')).toBeNull();
	});

	it('does not auto-open for a share campaign that merely contains "badge_"', async () => {
		const { queryByTestId } = renderBadgesList({
			completedAchievements: [eventBadge('equity')],
			query: { utm_campaign: 'social_share_portfolio_badge_equity' },
		});

		await flushPromises();
		expect(queryByTestId('badge-modal')).toBeNull();
	});

	it('auto-opens once the badges finish loading after mount', async () => {
		const { queryByTestId, rerender } = renderBadgesList({
			completedAchievements: [],
			query: { utm_campaign: 'badge_stewardship-2026' },
		});

		expect(queryByTestId('badge-modal')).toBeNull();

		await rerenderWith(rerender, [eventBadge('stewardship-2026')]);

		await waitFor(() => expect(queryByTestId('badge-modal')).toBeTruthy());
	});
});

describe('BadgesList badge-claim-modal view tracking', () => {
	it('fires a portfolio view event with the badge name when the modal auto-opens', async () => {
		const trackEvent = vi.fn();
		renderBadgesList({
			completedAchievements: [eventBadge('stewardship-2026')],
			query: { utm_campaign: 'badge_stewardship-2026' },
			trackEvent,
		});

		await waitFor(() => expect(trackEvent).toHaveBeenCalledWith(
			'portfolio',
			'view',
			'badge-claim-modal',
			'Stewardship',
		));
	});

	it('does not fire the view event without the email param', async () => {
		const trackEvent = vi.fn();
		renderBadgesList({
			completedAchievements: [eventBadge('stewardship-2026')],
			query: {},
			trackEvent,
		});

		await flushPromises();
		expect(trackEvent).not.toHaveBeenCalledWith(
			'portfolio',
			'view',
			'badge-claim-modal',
			expect.anything(),
		);
	});

	it('does not fire the view event when the user does not own the linked badge', async () => {
		const trackEvent = vi.fn();
		renderBadgesList({
			completedAchievements: [eventBadge('some-other-badge')],
			query: { utm_campaign: 'badge_stewardship-2026' },
			trackEvent,
		});

		await flushPromises();
		expect(trackEvent).not.toHaveBeenCalledWith(
			'portfolio',
			'view',
			'badge-claim-modal',
			expect.anything(),
		);
	});

	it('fires the view event only once even when badges reload after the modal opens', async () => {
		const trackEvent = vi.fn();
		const { rerender } = renderBadgesList({
			completedAchievements: [eventBadge('stewardship-2026')],
			query: { utm_campaign: 'badge_stewardship-2026' },
			trackEvent,
		});

		await waitFor(() => expect(trackEvent).toHaveBeenCalledTimes(1));

		await rerenderWith(rerender, [eventBadge('stewardship-2026')]);
		await flushPromises();

		expect(trackEvent).toHaveBeenCalledTimes(1);
	});
});
