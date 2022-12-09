import CookieStore from '@/util/cookieStore';
import {
	assignVersion,
	matchTargets,
	parseExpCookie,
	serializeExpCookie,
} from '@/util/experimentUtils';

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
});
