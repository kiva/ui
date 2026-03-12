import {
	missingMilestones,
	defaultBadges,
	isNonBadgeSlide,
} from '#src/util/achievementUtils';

const sampleAPIMilestoneProgress = [
	{
		achievement: 'climate-challenge',
		milestoneName: 'solar',
		postCheckoutProgress: 1,
		progress: 0,
		status: 'COMPLETABLE',
		target: 1
	},
	{
		achievement: 'climate-challenge',
		milestoneName: 'recycle-reuse',
		postCheckoutProgress: 0,
		progress: 0,
		status: 'NO_NEW_PROGRESS',
		target: 1
	},
	{
		achievement: 'climate-challenge',
		milestoneName: 'sustainable-agriculture',
		postCheckoutProgress: 0,
		progress: 0,
		status: 'NO_NEW_PROGRESS',
		target: 1
	},
	{
		achievement: 'another-challenge',
		milestoneName: 'recycle-reuse',
		postCheckoutProgress: 2,
		progress: 2,
		status: 'NEW_PROGRESS',
		target: 3
	},
	{
		achievement: 'another-challenge',
		milestoneName: 'sustainable-agriculture',
		postCheckoutProgress: 2,
		progress: 0,
		status: 'NO_NEW_PROGRESS',
		target: 3
	},
	{
		achievement: 'another-challenge',
		milestoneName: 'solar',
		postCheckoutProgress: 4,
		progress: 4,
		status: 'ALREADY_COMPLETE',
		target: 4
	},
	{
		achievement: 'another-challenge',
		milestoneName: 'solar-roofs',
		postCheckoutProgress: 2,
		progress: 1,
		status: 'COMPLETABLE',
		target: 2
	}

];

describe('achievementUtils.js missingMilestones', () => {
	it('Should return achievements yet to be completed', () => {
		expect(missingMilestones(sampleAPIMilestoneProgress, 'another-challenge')).toEqual([
			{
				achievement: 'another-challenge',
				milestoneName: 'recycle-reuse',
				postCheckoutProgress: 2,
				progress: 2,
				status: 'NEW_PROGRESS',
				target: 3
			},
			{
				achievement: 'another-challenge',
				milestoneName: 'sustainable-agriculture',
				postCheckoutProgress: 2,
				progress: 0,
				status: 'NO_NEW_PROGRESS',
				target: 3
			},
		]);
	});
	it('Should always return an array', () => {
		expect(missingMilestones([], 'another-challenge')).toEqual([
		]);
		expect(missingMilestones(sampleAPIMilestoneProgress, 'challenge-does-not-exist')).toEqual([
		]);
		expect(missingMilestones(sampleAPIMilestoneProgress, undefined)).toEqual([
		]);
	});

	it('Should handle empty achievement name', () => {
		expect(missingMilestones(sampleAPIMilestoneProgress, '')).toEqual([]);
	});

	it('Should filter out COMPLETABLE status milestones', () => {
		const result = missingMilestones(sampleAPIMilestoneProgress, 'climate-challenge');
		// Should not include the COMPLETABLE milestone (solar)
		expect(result.every(m => m.status !== 'COMPLETABLE')).toBe(true);
		expect(result.length).toBe(2); // Only NO_NEW_PROGRESS milestones
	});

	it('Should filter out ALREADY_COMPLETE status milestones', () => {
		const result = missingMilestones(sampleAPIMilestoneProgress, 'another-challenge');
		// Should not include the ALREADY_COMPLETE milestone (solar)
		expect(result.every(m => m.status !== 'ALREADY_COMPLETE')).toBe(true);
		expect(result.some(m => m.milestoneName === 'solar')).toBe(false);
	});

	it('Should return all milestones with NEW_PROGRESS status', () => {
		const result = missingMilestones(sampleAPIMilestoneProgress, 'another-challenge');
		const newProgressMilestones = result.filter(m => m.status === 'NEW_PROGRESS');
		expect(newProgressMilestones.length).toBe(1);
		expect(newProgressMilestones[0].milestoneName).toBe('recycle-reuse');
	});

	it('Should handle achievements with only completed milestones', () => {
		const onlyCompleted = [
			{
				achievement: 'complete-challenge',
				milestoneName: 'milestone1',
				status: 'COMPLETABLE',
				target: 1
			},
			{
				achievement: 'complete-challenge',
				milestoneName: 'milestone2',
				status: 'ALREADY_COMPLETE',
				target: 1
			}
		];
		expect(missingMilestones(onlyCompleted, 'complete-challenge')).toEqual([]);
	});

	it('Should not modify the original input array', () => {
		const originalLength = sampleAPIMilestoneProgress.length;
		missingMilestones(sampleAPIMilestoneProgress, 'climate-challenge');
		expect(sampleAPIMilestoneProgress.length).toBe(originalLength);
	});
});

describe('achievementUtils.js defaultBadges', () => {
	it('Should export defaultBadges as an array', () => {
		expect(Array.isArray(defaultBadges)).toBe(true);
	});

	it('Should contain expected badge keys', () => {
		expect(defaultBadges).toContain('womens-equality');
		expect(defaultBadges).toContain('us-economic-equality');
		expect(defaultBadges).toContain('basic-needs');
		expect(defaultBadges).toContain('climate-action');
		expect(defaultBadges).toContain('refugee-equality');
	});

	it('Should have exactly 5 default badges', () => {
		expect(defaultBadges.length).toBe(5);
	});

	it('Should have unique badge keys', () => {
		const uniqueBadges = new Set(defaultBadges);
		expect(uniqueBadges.size).toBe(defaultBadges.length);
	});
});

const buildSlide = (achievementKey, extraData = {}) => ({
	fields: {
		richText: {
			content: [
				{
					data: {
						target: {
							sys: { contentType: { sys: { id: 'uiSetting' } } },
							fields: { dataObject: { achievementKey, ...extraData } },
						},
					},
				},
			],
		},
	},
});

describe('achievementUtils.js isNonBadgeSlide', () => {
	it('returns false for default badge slides', () => {
		defaultBadges.forEach(badgeKey => {
			const slide = buildSlide(badgeKey);
			expect(isNonBadgeSlide(slide)).toBe(false);
		});
	});

	it('returns true for non-badge slides', () => {
		const slide = buildSlide('donate-to-kiva');
		expect(isNonBadgeSlide(slide)).toBe(true);
	});

	it('returns true when achievementKey is missing', () => {
		const slide = buildSlide(undefined);
		expect(isNonBadgeSlide(slide)).toBe(true);
	});

	it('returns true for null slide', () => {
		expect(isNonBadgeSlide(null)).toBe(true);
	});
});
