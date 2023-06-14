import {
	achievementProgression, missingMilestones
} from '@/util/achievementUtils';

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
describe('achievementUtils.js achievementProgression', () => {
	test('Should return true for achievement with 1 milestone in completeable status', () => {
		expect(achievementProgression(sampleAPIMilestoneProgress)).toBe('climate-challenge');
	});

	test('Should return false if either param is missing or undefined', () => {
		expect(achievementProgression(undefined)).toBe(null);
		expect(achievementProgression([])).toBe(null);
	});

	test('Should return true for achievement with 1 milestone in new_progress status', () => {
		const newProgress = sampleAPIMilestoneProgress;
		newProgress[0].status = 'NEW_PROGRESS';
		expect(achievementProgression(newProgress)).toBe('climate-challenge');
	});
});

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
});
