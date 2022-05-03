import { createMockClient } from 'mock-apollo-client';
import experimentIdsQuery from '@/graphql/query/experimentIds.graphql';
import CookieStore from '@/util/cookieStore';
import {
	assignVersion,
	calculateHash,
	cleanAssignments,
	fetchActiveExperiments,
	getAssignments,
	matchTargets,
	parseExpCookie,
	saveAssignments,
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
			expect(parseExpCookie('ab:x:n:n|cd:y:1234:0.4|ef:z|gh:w:1234')).toEqual({
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
			})).toBe('ab:x:n:n|cd:y:1234:0.4|ef:z:n:n|gh:w:1234:n');
		});
	});

	describe('matchTargets', () => {
		it('Returns true when "targets" is undefined', () => {
			expect(matchTargets()).toBe(true);
		});

		it('Returns false when there are no targets', () => {
			expect(matchTargets({})).toBe(false);
		});

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
	});

	describe('assignVersion', () => {
		let experiment = {};
		let oldRandom = () => {};
		let randomMock = () => oldRandom();

		beforeEach(() => {
			// Setup basic experiment object
			experiment = {
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

		it('Returns undefined when targets do not match', () => {
			experiment.targets = {};
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

	describe('calculateHash', () => {
		const base = { name: 'test', distribution: { a: 0.5, b: 0.5 }, population: 0.1 };
		const changedPopulation = { name: 'test', distribution: { a: 0.5, b: 0.5 }, population: 1 };
		const changedDistribution = { name: 'test', distribution: { a: 0, b: 1 }, population: 0.1 };
		const changedName = { name: 'renamed', distribution: { a: 0.5, b: 0.5 }, population: 0.1 };

		it('generates the same hash when only population changes', () => {
			expect(calculateHash(base)).toBe(calculateHash(changedPopulation));
		});

		it('generates a different hash when the name or distribution changes', () => {
			expect(calculateHash(base)).not.toBe(calculateHash(changedDistribution));
			expect(calculateHash(base)).not.toBe(calculateHash(changedName));
		});
	});

	describe('cleanAssignments', () => {
		it('removes inactive experiments from the current assignments object', () => {
			const current = { test1: { version: 'a' }, test2: { version: 'b' } };
			const active = ['test2', 'test3'];
			expect(cleanAssignments(current, active)).toEqual({ test2: { version: 'b' } });
		});
	});

	describe('getAssignments', () => {
		it('gets current experiment assignments from uiab cookie and setuiab url parameter', () => {
			const cookieStore = new CookieStore({ uiab: 'ab:x:n:n|cd:y:1234:0.4' });
			const router = { currentRoute: { query: { setuiab: 'cd.z' } } };
			expect(getAssignments(cookieStore, router)).toEqual({
				ab: {
					id: 'ab',
					version: 'x',
					hash: NaN,
					population: NaN,
				},
				cd: {
					id: 'cd',
					version: 'z',
				},
			});
		});
	});

	describe('saveAssignments', () => {
		it('stores current assignments in uiab cookie', () => {
			const cookieStore = new CookieStore();
			saveAssignments(cookieStore, { ab: { id: 'ab', version: 'x' } });
			expect(cookieStore.get('uiab')).toEqual('ab:x:n:n');
		});
	});

	describe('fetchActiveExperiments', () => {
		const mockClient = activeExperimentString => {
			const client = createMockClient();
			client.setRequestHandler(experimentIdsQuery, () => Promise.resolve({
				data: {
					general: {
						activeExperiments: {
							key: 'ui.active_experiments',
							value: activeExperimentString,
						},
					},
				},
			}));
			return client;
		};

		it('Returns array of experiment ids from settings manager', async () => {
			const client = mockClient('"exp_foo, exp_bar  ,exp_baz"');
			const result = await fetchActiveExperiments(client);
			expect(result).toEqual(['exp_foo', 'exp_bar', 'exp_baz']);
		});

		it('Returns an empty array when setting is missing', async () => {
			const client = mockClient(null);
			const result = await fetchActiveExperiments(client);
			expect(result).toEqual([]);
		});
	});
});
