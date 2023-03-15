import CookieStore from '@/util/cookieStore';
import {
	assignVersion,
	assignVersionForLoginId,
	matchTargets,
	parseExpCookie,
	serializeExpCookie,
} from '@/util/experiment/experimentUtils';
import * as Alea from '@/util/experiment/Alea';
import { runManyTimesAndCompare } from '../../../helpers/runAndCompare';

describe('experimentUtils.js', () => {
	describe('parseExpCookie', () => {
		it('Returns an empty object when no valid cookie string is given', () => {
			expect(parseExpCookie()).toEqual({});
			expect(parseExpCookie('')).toEqual({});
			expect(parseExpCookie('||')).toEqual({});
			expect(parseExpCookie('::|::|::')).toEqual({});
			expect(parseExpCookie(':|:|')).toEqual({});
		});

		it('Returns a correctly parsed cookie object', () => {
			expect(parseExpCookie('ab:x:no-hash:no-pop|cd:y:1234:0.4|ef:z|gh:w:1234')).toEqual({
				ab: {
					id: 'ab',
					version: 'x',
					hash: NaN,
					population: NaN,
				},
				cd: {
					id: 'cd',
					version: 'y',
					hash: 1234,
					population: 0.4,
				},
				ef: {
					id: 'ef',
					version: 'z',
					hash: NaN,
					population: NaN,
				},
				gh: {
					id: 'gh',
					version: 'w',
					hash: 1234,
					population: NaN,
				},
			});
		});
	});

	describe('serializeExpCookie', () => {
		it('Returns an empty string when no assignment object is given', () => {
			expect(serializeExpCookie()).toBe('');
		});

		it('Returns a correctly serialized cookie string', () => {
			expect(serializeExpCookie({
				ab: {
					id: 'ab',
					version: 'x',
				},
				cd: {
					id: 'cd',
					version: 'y',
					hash: 1234,
					population: 0.4,
				},
				ef: {
					id: 'ef',
					version: 'z',
					hash: NaN,
					population: NaN,
				},
				gh: {
					id: 'gh',
					version: 'w',
					hash: 1234,
				},
			})).toBe('ab:x:no-hash:no-pop|cd:y:1234:0.4|ef:z:no-hash:no-pop|gh:w:1234:no-pop');
		});
	});

	describe('matchTargets', () => {
		it('Returns true when "targets" is undefined', () => {
			expect(matchTargets()).toBe(true);
		});

		it('Returns false when there are no targets', () => {
			expect(matchTargets({})).toBe(false);
		});

		// Cookied/uncookied

		it('Returns true when cookied users are targeted and the kvu cookie exists', () => {
			const cookieStore = new CookieStore({ kvu: 'user id' });
			expect(matchTargets({ users: ['cookied'] }, cookieStore)).toBe(true);
		});

		it('Returns false when cookied users are targeted and the kvu cookie does not exist', () => {
			expect(matchTargets({ users: ['cookied'] }, new CookieStore())).toBe(false);
		});

		it('Returns false when uncookied users are targeted and the kvu cookie exists', () => {
			const cookieStore = new CookieStore({ kvu: 'user id' });
			expect(matchTargets({ users: ['uncookied'] }, cookieStore)).toBe(false);
		});

		it('Returns true when uncookied users are targeted and the kvu cookie does not exist', () => {
			expect(matchTargets({ users: ['uncookied'] }, new CookieStore())).toBe(true);
		});

		// Lender/non-lender

		it('Returns false when lenders are targeted and the kvu_lb cookie does not exist', () => {
			expect(matchTargets({ users: ['lender'] }, new CookieStore())).toBe(false);
		});

		it('Returns false when lenders are targeted and the kvu_lb cookie exists and is \'false\'', () => {
			const cookieStore = new CookieStore({ kvu_lb: 'false' });
			expect(matchTargets({ users: ['lender'] }, cookieStore)).toBe(false);
		});

		it('Returns true when lenders are targeted and the kvu_lb cookie exists and is \'true\'', () => {
			const cookieStore = new CookieStore({ kvu_lb: 'true' });
			expect(matchTargets({ users: ['lender'] }, cookieStore)).toBe(true);
		});

		it('Returns true when non-lenders are targeted and the kvu_lb cookie does not exist', () => {
			expect(matchTargets({ users: ['non-lender'] }, new CookieStore())).toBe(true);
		});

		it('Returns true when non-lenders are targeted and the kvu_lb cookie exists and is \'false\'', () => {
			const cookieStore = new CookieStore({ kvu_lb: 'false' });
			expect(matchTargets({ users: ['non-lender'] }, cookieStore)).toBe(true);
		});

		it('Returns false when non-lenders are targeted and the kvu_lb cookie exists and is \'true\'', () => {
			const cookieStore = new CookieStore({ kvu_lb: 'true' });
			expect(matchTargets({ users: ['non-lender'] }, cookieStore)).toBe(false);
		});

		// Depositor/non-depositor

		it('Returns false when depositors are targeted and the kvu_db cookie does not exist', () => {
			expect(matchTargets({ users: ['depositor'] }, new CookieStore())).toBe(false);
		});

		it('Returns false when depositors are targeted and the kvu_db cookie exists and is \'false\'', () => {
			const cookieStore = new CookieStore({ kvu_db: 'false' });
			expect(matchTargets({ users: ['depositor'] }, cookieStore)).toBe(false);
		});

		it('Returns true when depositors are targeted and the kvu_db cookie exists and is \'true\'', () => {
			const cookieStore = new CookieStore({ kvu_db: 'true' });
			expect(matchTargets({ users: ['depositor'] }, cookieStore)).toBe(true);
		});

		it('Returns true when non-depositors are targeted and the kvu_db cookie does not exist', () => {
			expect(matchTargets({ users: ['non-depositor'] }, new CookieStore())).toBe(true);
		});

		it('Returns true when non-depositors are targeted and the kvu_db cookie exists and is \'false\'', () => {
			const cookieStore = new CookieStore({ kvu_db: 'false' });
			expect(matchTargets({ users: ['non-depositor'] }, cookieStore)).toBe(true);
		});

		it('Returns false when non-depositors are targeted and the kvu_db cookie exists and is \'true\'', () => {
			const cookieStore = new CookieStore({ kvu_db: 'true' });
			expect(matchTargets({ users: ['non-depositor'] }, cookieStore)).toBe(false);
		});
	});

	describe('assignVersion', () => {
		let experiment = {};
		let oldRandom = () => {};
		let randomMock = () => oldRandom();

		beforeEach(() => {
			// Setup basic experiment object
			experiment = {
				enabled: true,
				startTime: Date.now() - 2000,
				endTime: Date.now() + 50000,
				distribution: {
					control: 0.5,
					variant: 0.5,
				},
				population: 1,
			};
			// Replace default random method
			oldRandom = Math.random;
			Math.random = () => randomMock();
		});

		afterEach(() => {
			// Restore default random method
			Math.random = oldRandom;
		});

		it('Returns undefined when experiment is not enabled', () => {
			experiment.enabled = false;
			expect(assignVersion(experiment)).toBeUndefined();
		});

		it('Returns undefined when targets do not match', () => {
			experiment.targets = {};
			expect(assignVersion(experiment)).toBeUndefined();
		});

		it('Returns undefined when current time is outside of experiment time limits', () => {
			experiment.endTime = Date.now() - 500;
			expect(assignVersion(experiment)).toBeUndefined();
		});

		it('Returns "unassigned" when dice roll lands outside population level', () => {
			randomMock = jest.fn(() => 0.9);
			experiment.population = 0.5;
			expect(assignVersion(experiment)).toBe('unassigned');
			expect(randomMock).toHaveBeenCalled();
		});

		it('Returns "control" when dice roll lands in the control distribution', () => {
			randomMock = jest.fn(() => 0.25);
			expect(assignVersion(experiment)).toBe('control');
			expect(randomMock).toHaveBeenCalled();
		});

		it('Returns "variant" when dice roll lands in the variant distribution', () => {
			randomMock = jest.fn(() => 0.75);
			expect(assignVersion(experiment)).toBe('variant');
			expect(randomMock).toHaveBeenCalled();
		});

		it('Returns a version when the population is undefined', () => {
			delete experiment.population;
			expect(['control', 'variant']).toContain(assignVersion(experiment));
		});
	});

	describe('assignVersionForLoginId', () => {
		const loginId = 'ac4abedd-b9fd-487b-8d83-6fb73794e33e';
		const experiment = {
			name: 'asd',
			distribution: {
				control: 0.5,
				variant: 0.5,
			},
			population: 1,
		};
		let spyAlea;

		describe('mocked pseudo random number generator', () => {
			beforeEach(() => {
				spyAlea = jest.spyOn(Alea, 'default').mockReturnValue(() => Math.random());
			});

			afterEach(jest.restoreAllMocks);

			it('should return "unassigned" when dice roll lands outside population level', () => {
				const data = { ...experiment };

				spyAlea.mockReturnValueOnce(() => 0.5);
				data.population = 0.5;
				expect(assignVersionForLoginId(data, loginId)).toBe('variant');
				expect(spyAlea).toHaveBeenCalledTimes(1);

				spyAlea.mockReturnValueOnce(() => 0.51);
				data.population = 0.5;
				expect(assignVersionForLoginId(data, loginId)).toBe('unassigned');
				expect(spyAlea).toHaveBeenCalledTimes(2);

				spyAlea.mockReturnValueOnce(() => 0.9);
				data.population = 0.5;
				expect(assignVersionForLoginId(data, loginId)).toBe('unassigned');
				expect(spyAlea).toHaveBeenCalledTimes(3);
			});

			it('should return "control" when dice roll lands in the control distribution', () => {
				spyAlea.mockReturnValueOnce(() => 0);
				expect(assignVersionForLoginId(experiment, loginId)).toBe('control');
				expect(spyAlea).toHaveBeenCalledTimes(1);

				spyAlea.mockReturnValueOnce(() => 0.25);
				expect(assignVersionForLoginId(experiment, loginId)).toBe('control');
				expect(spyAlea).toHaveBeenCalledTimes(2);

				spyAlea.mockReturnValueOnce(() => 0.5);
				expect(assignVersionForLoginId(experiment, loginId)).toBe('control');
				expect(spyAlea).toHaveBeenCalledTimes(3);
			});

			it('should return "variant" when dice roll lands in the variant distribution', () => {
				spyAlea.mockReturnValueOnce(() => 0.51);
				expect(assignVersionForLoginId(experiment, loginId)).toBe('variant');
				expect(spyAlea).toHaveBeenCalledTimes(1);

				spyAlea.mockReturnValueOnce(() => 0.75);
				expect(assignVersionForLoginId(experiment, loginId)).toBe('variant');
				expect(spyAlea).toHaveBeenCalledTimes(2);

				spyAlea.mockReturnValueOnce(() => 0.99);
				expect(assignVersionForLoginId(experiment, loginId)).toBe('variant');
				expect(spyAlea).toHaveBeenCalledTimes(3);
			});

			it('should return assignment when more than two distributions', () => {
				const data = { ...experiment, distribution: { a: 0.5, b: 0.25, c: 0.25 } };

				spyAlea.mockReturnValueOnce(() => 0);
				expect(assignVersionForLoginId(data, loginId)).toBe('a');
				expect(spyAlea).toHaveBeenCalledTimes(1);

				spyAlea.mockReturnValueOnce(() => 0.5);
				expect(assignVersionForLoginId(data, loginId)).toBe('a');
				expect(spyAlea).toHaveBeenCalledTimes(2);

				spyAlea.mockReturnValueOnce(() => 0.51);
				expect(assignVersionForLoginId(data, loginId)).toBe('b');
				expect(spyAlea).toHaveBeenCalledTimes(3);

				spyAlea.mockReturnValueOnce(() => 0.75);
				expect(assignVersionForLoginId(data, loginId)).toBe('b');
				expect(spyAlea).toHaveBeenCalledTimes(4);

				spyAlea.mockReturnValueOnce(() => 0.76);
				expect(assignVersionForLoginId(data, loginId)).toBe('c');
				expect(spyAlea).toHaveBeenCalledTimes(5);

				spyAlea.mockReturnValueOnce(() => 0.99);
				expect(assignVersionForLoginId(data, loginId)).toBe('c');
				expect(spyAlea).toHaveBeenCalledTimes(6);
			});

			it('should return a version when the population is undefined', () => {
				const data = { ...experiment };
				delete data.population;
				expect(['control', 'variant']).toContain(assignVersionForLoginId(data, loginId));
				expect(spyAlea).toHaveBeenCalledTimes(1);
			});
		});

		describe('original pseudo random number generator', () => {
			it('should return same variation over many runs', () => {
				runManyTimesAndCompare(() => assignVersionForLoginId(experiment, loginId));
			});
		});
	});
});
