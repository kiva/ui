import {
	missingMilestones,
	defaultBadges,
} from '../../../../src/util/achievementUtils';

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
	test('Should return achievements yet to be completed', () => {
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
	test('Should always return an array', () => {
		expect(missingMilestones([], 'another-challenge')).toEqual([
		]);
		expect(missingMilestones(sampleAPIMilestoneProgress, 'challenge-does-not-exist')).toEqual([
		]);
		expect(missingMilestones(sampleAPIMilestoneProgress, undefined)).toEqual([
		]);
	});

	test('Should handle empty achievement name', () => {
		expect(missingMilestones(sampleAPIMilestoneProgress, '')).toEqual([]);
	});

	test('Should filter out COMPLETABLE status milestones', () => {
		const result = missingMilestones(sampleAPIMilestoneProgress, 'climate-challenge');
		// Should not include the COMPLETABLE milestone (solar)
		expect(result.every(m => m.status !== 'COMPLETABLE')).toBe(true);
		expect(result.length).toBe(2); // Only NO_NEW_PROGRESS milestones
	});

	test('Should filter out ALREADY_COMPLETE status milestones', () => {
		const result = missingMilestones(sampleAPIMilestoneProgress, 'another-challenge');
		// Should not include the ALREADY_COMPLETE milestone (solar)
		expect(result.every(m => m.status !== 'ALREADY_COMPLETE')).toBe(true);
		expect(result.some(m => m.milestoneName === 'solar')).toBe(false);
	});

	test('Should return all milestones with NEW_PROGRESS status', () => {
		const result = missingMilestones(sampleAPIMilestoneProgress, 'another-challenge');
		const newProgressMilestones = result.filter(m => m.status === 'NEW_PROGRESS');
		expect(newProgressMilestones.length).toBe(1);
		expect(newProgressMilestones[0].milestoneName).toBe('recycle-reuse');
	});

	test('Should handle achievements with only completed milestones', () => {
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

	test('Should not modify the original input array', () => {
		const originalLength = sampleAPIMilestoneProgress.length;
		missingMilestones(sampleAPIMilestoneProgress, 'climate-challenge');
		expect(sampleAPIMilestoneProgress.length).toBe(originalLength);
	});
});

describe('achievementUtils.js defaultBadges', () => {
	test('Should export defaultBadges as an array', () => {
		expect(Array.isArray(defaultBadges)).toBe(true);
	});

	test('Should contain expected badge keys', () => {
		expect(defaultBadges).toContain('womens-equality');
		expect(defaultBadges).toContain('us-economic-equality');
		expect(defaultBadges).toContain('basic-needs');
		expect(defaultBadges).toContain('climate-action');
		expect(defaultBadges).toContain('refugee-equality');
	});

	test('Should have exactly 5 default badges', () => {
		expect(defaultBadges.length).toBe(5);
	});

	test('Should have unique badge keys', () => {
		const uniqueBadges = new Set(defaultBadges);
		expect(uniqueBadges.size).toBe(defaultBadges.length);
	});
});
