import {
	hasMadeAchievementsProgression, missingMilestones
} from '@/util/ecoChallengeUtils';

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
describe('ecoChallengeUtils.js hasMadeAchievementsProgression', () => {
	test('Should return true for achievement with 1 milestone in completeable status', () => {
		expect(hasMadeAchievementsProgression(sampleAPIMilestoneProgress, 'climate-challenge')).toBe(true);
	});

	test('Should return false for missing achievement', () => {
		expect(hasMadeAchievementsProgression(sampleAPIMilestoneProgress, 'test-challenge')).toBe(false);
	});

	test('Should return false if either param is missing or undefined', () => {
		expect(hasMadeAchievementsProgression(sampleAPIMilestoneProgress, undefined)).toBe(false);
		expect(hasMadeAchievementsProgression(sampleAPIMilestoneProgress, '')).toBe(false);
		expect(hasMadeAchievementsProgression(undefined, 'climate-challenge')).toBe(false);
		expect(hasMadeAchievementsProgression([], 'climate-challenge')).toBe(false);
	});

	test('Should return true for achievement with 1 milestone in new_progress status', () => {
		const newProgress = sampleAPIMilestoneProgress;
		newProgress[0].status = 'NEW_PROGRESS';
		expect(hasMadeAchievementsProgression(newProgress, 'climate-challenge')).toBe(true);
	});
});

describe('ecoChallengeUtils.js missingMilestones', () => {
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
});
