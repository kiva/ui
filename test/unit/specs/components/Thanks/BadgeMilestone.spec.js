/* eslint-disable vue/one-component-per-file */
import { render } from '@testing-library/vue';
import { defineComponent, ref } from 'vue';
import BadgeMilestone from '#src/components/Thanks/SingleVersion/BadgeMilestone';
import { globalOptions } from '../../../specUtils';

vi.mock('#src/components/MyKiva/BadgeContainer', () => ({
	default: defineComponent({
		name: 'BadgeContainer',
		template: '<div><slot /></div>',
	}),
}));

vi.mock('#src/components/Thanks/BorrowerAvatarsContainer', () => ({
	default: defineComponent({
		name: 'BorrowerAvatarsContainer',
		template: '<div />',
	}),
}));

vi.mock('#src/components/Thanks/BgRays', () => ({
	default: defineComponent({
		name: 'BgRays',
		template: '<div />',
	}),
}));

vi.mock('#src/assets/inline-svgs/thanks/globe.svg', () => ({
	default: defineComponent({
		name: 'GlobeIcon',
		template: '<div />',
	}),
}));

const mockBadgeContentfulData = ref([]);
const mockBadgeData = ref([]);

vi.mock('#src/composables/useBadgeData', async importOriginal => {
	const actual = await importOriginal();
	return {
		...actual,
		default: () => ({
			...actual.default(),
			badgeContentfulData: mockBadgeContentfulData,
			badgeData: mockBadgeData,
			fetchContentfulData: vi.fn(),
			fetchAchievementData: vi.fn(),
		}),
	};
});

const eventBadgeContentfulEntry = {
	id: 'iwd-2024-challenge',
	challengeName: 'IWD 2024',
	imageUrl: '//cdn.kiva.org/iwd-badge.png',
	shareFact: 'Women represent 80% of Kiva borrowers',
	shareFactFootnote: 'Kiva internal data',
};

const equityBadgeContentfulEntry = {
	id: 'equity',
	challengeName: 'Equality Badge',
	imageUrl: '//cdn.kiva.org/equity-badge.png',
};

const tieredBadgeContentfulEntry = {
	id: 'womens-equality',
	challengeName: 'Women\'s Equality',
	imageUrl: '//cdn.kiva.org/womens-badge.png',
	tierName: 'Level 1',
	shareFact: 'Women are change makers',
	shareFactFootnote: 'Source data',
};

describe('BadgeMilestone', () => {
	beforeEach(() => {
		mockBadgeContentfulData.value = [];
		mockBadgeData.value = [];
	});

	describe('event badge display', () => {
		it('displays the event badge image when a Contentful-only event badge is achieved', async () => {
			mockBadgeContentfulData.value = [eventBadgeContentfulEntry, equityBadgeContentfulEntry];
			mockBadgeData.value = [
				{
					id: 'equity',
					challengeName: 'Equality Badge',
					contentfulData: [{ ...equityBadgeContentfulEntry }],
					achievementData: {},
				},
			];

			const { findByAltText } = render(BadgeMilestone, {
				props: {
					badgeAchievedIds: ['equity', 'iwd-2024-challenge'],
					isGuest: false,
					loans: [{ id: 1 }],
				},
				...globalOptions,
			});

			const badgeImg = await findByAltText('Badge');
			expect(badgeImg.src).toContain('iwd-badge.png');
		});

		it('displays equity badge when no event badge is present', async () => {
			mockBadgeContentfulData.value = [equityBadgeContentfulEntry];
			mockBadgeData.value = [
				{
					id: 'equity',
					challengeName: 'Equality Badge',
					contentfulData: [{ ...equityBadgeContentfulEntry }],
					achievementData: {},
				},
			];

			const { findByAltText } = render(BadgeMilestone, {
				props: {
					badgeAchievedIds: ['equity'],
					isGuest: false,
					loans: [{ id: 1 }],
				},
				...globalOptions,
			});

			const badgeImg = await findByAltText('Badge');
			expect(badgeImg.src).toContain('equity-badge.png');
		});
	});

	describe('guest display', () => {
		it('shows the equity badge for guests', async () => {
			const { findByAltText } = render(BadgeMilestone, {
				props: {
					isGuest: true,
					badgeAchievedIds: [],
					loans: [{ id: 1 }],
				},
				...globalOptions,
			});

			// Trigger the contentful data watch by setting after render
			mockBadgeContentfulData.value = [equityBadgeContentfulEntry];

			const badgeImg = await findByAltText('Badge');
			expect(badgeImg.src).toContain('equity-badge.png');
		});
	});

	describe('onlyKivaCardsAndDonations', () => {
		it('shows the equity badge fallback when only kiva cards and donations', async () => {
			const { findByAltText } = render(BadgeMilestone, {
				props: {
					isGuest: false,
					onlyKivaCardsAndDonations: true,
					badgeAchievedIds: ['equity'],
					loans: [],
				},
				...globalOptions,
			});

			// Trigger the contentful data watch by setting after render
			mockBadgeContentfulData.value = [equityBadgeContentfulEntry];

			const badgeImg = await findByAltText('Badge');
			expect(badgeImg.src).toContain('equity-badge.png');
		});
	});

	describe('achievementsCompleted', () => {
		it('shows the completion title when all achievements are completed', async () => {
			const { findByText } = render(BadgeMilestone, {
				props: {
					isGuest: false,
					achievementsCompleted: true,
					badgeAchievedIds: [],
					loans: [{ id: 1 }],
				},
				...globalOptions,
			});

			// Trigger the badge data watch to resolve loading state
			mockBadgeData.value = [{ id: 'some-badge' }];

			await findByText('Stay up to date with your lending history, stats, and more!');
		});
	});

	describe('tiered badge display', () => {
		it('shows fun fact and source when a tiered badge with achievement data is displayed', async () => {
			mockBadgeContentfulData.value = [tieredBadgeContentfulEntry];
			mockBadgeData.value = [
				{
					id: 'womens-equality',
					challengeName: 'Women\'s Equality',
					contentfulData: [{ ...tieredBadgeContentfulEntry }],
					achievementData: {
						tiers: [
							{ level: 1, completedDate: '2024-01-01' },
						],
					},
				},
			];

			const { findByText } = render(BadgeMilestone, {
				props: {
					badgeAchievedIds: ['womens-equality'],
					isGuest: false,
					loans: [{ id: 1 }],
				},
				...globalOptions,
			});

			await findByText('Women are change makers', { exact: false });
		});
	});

	describe('module visibility', () => {
		it('does not render when no badges achieved, not a guest, and achievements not completed', () => {
			const { queryByRole } = render(BadgeMilestone, {
				props: {
					isGuest: false,
					badgeAchievedIds: [],
					achievementsCompleted: false,
					loans: [],
				},
				...globalOptions,
			});

			expect(queryByRole('button', { name: /continue/i })).toBeNull();
		});
	});
});
