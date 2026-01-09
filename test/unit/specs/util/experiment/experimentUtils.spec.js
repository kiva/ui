import {
	getActiveExperiments,
	getExperimentSettingCached,
	getExperimentSettingAsync,
	getExperimentSetting,
	parseExpCookie,
	serializeExpCookie,
	assignVersionForLoginId,
	trackExperimentVersion,
	calculateHash,
	getCookieAssignments,
	setCookieAssignments,
	cleanupStaleCookieAssignments,
	getForcedAssignment,
	getLoginId,
	assignAllActiveExperiments,
	getInitialExperimentVersion,
	queryExperimentAssignment,
	evictExperimentCacheIfForced,
	initializeExperiment,
} from '#src/util/experiment/experimentUtils';
import * as Alea from '#src/util/experiment/Alea';
import experimentIdsQuery from '#src/graphql/query/experimentIds.graphql';
import experimentSettingQuery from '#src/graphql/query/experimentSetting.graphql';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import CookieStore from '#src/util/cookieStore';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import { HOME_PAGE_EXPERIMENT_KEY } from '#src/util/experiment/fastlyExperimentUtils';
import { runManyTimesAndCompare } from '../../../helpers/runAndCompare';
import clearDocumentCookies from '../../../setup/clearDocumentCookies';

const MOCK_UUID = '123456789';
const homePageExpSetting = { name: 'HomePage', distribution: { a: 0.5, b: 0.5 }, population: 1 };
vi.mock('uuid', () => ({ v4: () => MOCK_UUID }));

describe('experimentUtils.js', () => {
	describe('getActiveExperiments', () => {
		it('should handle missing data', async () => {
			const cache = {
				readQuery: vi.fn().mockReturnValue({})
			};
			const client = {
				query: vi.fn().mockReturnValue({})
			};

			const result = await getActiveExperiments(cache, client);

			expect(result).toEqual([]);
			expect(cache.readQuery).toHaveBeenCalledWith({ query: experimentIdsQuery });
			expect(client.query).toHaveBeenCalledWith({ query: experimentIdsQuery });
		});

		it('should get active experiments from cache', async () => {
			const cache = {
				readQuery: vi.fn().mockReturnValue({
					general: {
						activeExperiments: {
							value: '"asd,qwe"'
						}
					}
				})
			};
			const client = {
				query: vi.fn()
			};

			const result = await getActiveExperiments(cache, client);

			expect(result).toEqual(['asd', 'qwe']);
			expect(cache.readQuery).toHaveBeenCalledWith({ query: experimentIdsQuery });
			expect(client.query).toHaveBeenCalledTimes(0);
		});

		it('should get active experiments from client', async () => {
			const cache = {
				readQuery: vi.fn().mockReturnValue({})
			};
			const client = {
				query: vi.fn().mockReturnValue({
					data: {
						general: {
							activeExperiments: {
								value: '"asd,qwe"'
							}
						}
					}
				})
			};

			const result = await getActiveExperiments(cache, client);

			expect(result).toEqual(['asd', 'qwe']);
			expect(cache.readQuery).toHaveBeenCalledWith({ query: experimentIdsQuery });
			expect(client.query).toHaveBeenCalledWith({ query: experimentIdsQuery });
		});
	});

	describe('getExperimentSettingCached', () => {
		it('should handle missing data', () => {
			const key = 'asd';
			const client = {
				readQuery: vi.fn().mockReturnValue({})
			};

			const result = getExperimentSettingCached(client, key);

			expect(result).toEqual({});
			expect(client.readQuery).toHaveBeenCalledWith({
				query: experimentSettingQuery,
				variables: { key }
			});
		});

		it('should get settings from cache', () => {
			const key = 'asd';
			const mockSettings = { test: 'asd' };
			const client = {
				readQuery: vi.fn().mockReturnValue({
					general: {
						uiExperimentSetting: {
							value: '"{\\"test\\":\\"asd\\"}"'
						}
					}
				})
			};

			const result = getExperimentSettingCached(client, key);

			expect(result).toEqual(mockSettings);
			expect(client.readQuery).toHaveBeenCalledWith({
				query: experimentSettingQuery,
				variables: { key }
			});
		});

		it('should handle error and return empty object', () => {
			const key = 'asd';
			const client = {
				readQuery: vi.fn().mockImplementation(() => {
					throw new Error('Cache read error');
				})
			};

			const result = getExperimentSettingCached(client, key);

			expect(result).toEqual({});
			expect(client.readQuery).toHaveBeenCalledWith({
				query: experimentSettingQuery,
				variables: { key }
			});
		});
	});

	describe('getExperimentSettingAsync', () => {
		it('should handle missing data', async () => {
			const key = 'asd';
			const client = {
				query: vi.fn().mockImplementation(() => Promise.resolve({}))
			};

			const result = await getExperimentSettingAsync(client, key);

			expect(result).toEqual({});
			expect(client.query).toHaveBeenCalledWith({
				query: experimentSettingQuery,
				variables: { key }
			});
		});

		it('should get settings async', async () => {
			const key = 'asd';
			const mockSettings = { test: 'asd' };
			const client = {
				query: vi.fn().mockImplementation(() => Promise.resolve({
					data: {
						general: {
							uiExperimentSetting: {
								value: '"{\\"test\\":\\"asd\\"}"'
							}
						}
					}
				}))
			};

			const result = await getExperimentSettingAsync(client, key);

			expect(result).toEqual(mockSettings);
			expect(client.query).toHaveBeenCalledWith({
				query: experimentSettingQuery,
				variables: { key }
			});
		});
	});

	describe('getExperimentSetting', () => {
		it('should handle missing data', async () => {
			const key = 'asd';
			const client = {
				readQuery: vi.fn().mockReturnValue({}),
				query: vi.fn().mockImplementation(() => Promise.resolve({}))
			};

			const result = await getExperimentSetting(key, client);

			expect(result).toEqual({});
			expect(client.readQuery).toHaveBeenCalledWith({
				query: experimentSettingQuery,
				variables: { key }
			});
			expect(client.query).toHaveBeenCalledWith({
				query: experimentSettingQuery,
				variables: { key }
			});
		});

		it('should get settings from cache', async () => {
			const key = 'asd';
			const client = {
				readQuery: vi.fn().mockReturnValue({
					general: {
						uiExperimentSetting: {
							value: '"{\\"name\\":\\"asd\\"}"'
						}
					}
				}),
				query: vi.fn().mockImplementation(() => Promise.resolve({}))
			};

			const result = await getExperimentSetting(key, client);

			expect(result).toEqual({ name: key });
			expect(client.readQuery).toHaveBeenCalledWith({
				query: experimentSettingQuery,
				variables: { key }
			});
			expect(client.query).toHaveBeenCalledTimes(0);
		});

		it('should get settings async', async () => {
			const key = 'asd';
			const client = {
				readQuery: vi.fn().mockReturnValue({}),
				query: vi.fn().mockImplementation(() => Promise.resolve({
					data: {
						general: {
							uiExperimentSetting: {
								value: '"{\\"name\\":\\"asd\\"}"'
							}
						}
					}
				}))
			};

			const result = await getExperimentSetting(key, client);

			expect(result).toEqual({ name: key });
			expect(client.readQuery).toHaveBeenCalledWith({
				query: experimentSettingQuery,
				variables: { key }
			});
			expect(client.query).toHaveBeenCalledWith({
				query: experimentSettingQuery,
				variables: { key }
			});
		});
	});

	describe('parseExpCookie', () => {
		it('should return an empty object when no valid cookie string is given', () => {
			expect(parseExpCookie()).toEqual({});
			expect(parseExpCookie(null)).toEqual({});
			expect(parseExpCookie(undefined)).toEqual({});
			expect(parseExpCookie('')).toEqual({});
			expect(parseExpCookie('||')).toEqual({});
			expect(parseExpCookie('::|::|::')).toEqual({});
			expect(parseExpCookie(':|:|')).toEqual({});
		});

		it('should return a correctly parsed cookie object', () => {
			expect(parseExpCookie('ab:x:no-hash:no-pop|cd:y:1234:0.4|ef:z|gh:w:1234')).toEqual({
				ab: {
					id: 'ab',
					version: 'x',
					hash: NaN,
					population: NaN,
					queryForced: false,
				},
				cd: {
					id: 'cd',
					version: 'y',
					hash: 1234,
					population: 0.4,
					queryForced: false,
				},
				ef: {
					id: 'ef',
					version: 'z',
					hash: NaN,
					population: NaN,
					queryForced: false,
				},
				gh: {
					id: 'gh',
					version: 'w',
					hash: 1234,
					population: NaN,
					queryForced: false,
				},
			});
		});

		it('should return a correctly parsed cookie object with query forced', () => {
			expect(parseExpCookie('ab:x:no-hash:no-pop:false|cd:y:1234:0.4:true|xd:z:3421:0.5:false')).toEqual({
				ab: {
					id: 'ab',
					version: 'x',
					hash: NaN,
					population: NaN,
					queryForced: false,
				},
				cd: {
					id: 'cd',
					version: 'y',
					hash: 1234,
					population: 0.4,
					queryForced: true
				},
				xd: {
					id: 'xd',
					version: 'z',
					hash: 3421,
					population: 0.5,
					queryForced: false
				},
			});
		});

		it('should return a correctly parsed cookie object with query forced missing', () => {
			expect(parseExpCookie('ab:x:no-hash:no-pop|cd:y:1234:0.4|xd:z:3421:0.5')).toEqual({
				ab: {
					id: 'ab',
					version: 'x',
					hash: NaN,
					population: NaN,
					queryForced: false,
				},
				cd: {
					id: 'cd',
					version: 'y',
					hash: 1234,
					population: 0.4,
					queryForced: false
				},
				xd: {
					id: 'xd',
					version: 'z',
					hash: 3421,
					population: 0.5,
					queryForced: false
				},
			});
		});

		it('should return a correctly parsed cookie object with bad query forced string', () => {
			expect(parseExpCookie('ab:x:no-hash:no-pop:asd|cd:y:1234:0.4:|xd:z:3421:0.5:1')).toEqual({
				ab: {
					id: 'ab',
					version: 'x',
					hash: NaN,
					population: NaN,
					queryForced: false,
				},
				cd: {
					id: 'cd',
					version: 'y',
					hash: 1234,
					population: 0.4,
					queryForced: false
				},
				xd: {
					id: 'xd',
					version: 'z',
					hash: 3421,
					population: 0.5,
					queryForced: false
				},
			});
		});

		it('should return a correctly parsed cookie object with query forced case insensitive', () => {
			expect(parseExpCookie('ab:x:no-hash:no-pop:TRUE|cd:y:1234:0.4:True|xd:z:3421:0.5:trUE')).toEqual({
				ab: {
					id: 'ab',
					version: 'x',
					hash: NaN,
					population: NaN,
					queryForced: true,
				},
				cd: {
					id: 'cd',
					version: 'y',
					hash: 1234,
					population: 0.4,
					queryForced: true
				},
				xd: {
					id: 'xd',
					version: 'z',
					hash: 3421,
					population: 0.5,
					queryForced: true
				},
			});
		});
	});

	describe('serializeExpCookie', () => {
		it('should return an empty string when no assignment object is given', () => {
			expect(serializeExpCookie()).toBe('');
			expect(serializeExpCookie(null)).toBe('');
			expect(serializeExpCookie(undefined)).toBe('');
			expect(serializeExpCookie('')).toBe('');
		});

		it('should return a correctly serialized cookie string', () => {
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
			})).toBe('ab:x:no-hash:no-pop:false|cd:y:1234:0.4:false|ef:z:no-hash:no-pop:false|gh:w:1234:no-pop:false');
		});

		it('should return a correctly serialized cookie string with query forced', () => {
			expect(serializeExpCookie({
				ab: {
					id: 'ab',
					version: 'x',
					hash: NaN,
					population: NaN,
					queryForced: false,
				},
				cd: {
					id: 'cd',
					version: 'y',
					hash: 1234,
					population: 0.4,
					queryForced: true
				},
				xd: {
					id: 'xd',
					version: 'z',
					hash: 3421,
					population: 0.5,
					queryForced: true
				},
			})).toBe('ab:x:no-hash:no-pop:false|cd:y:1234:0.4:true|xd:z:3421:0.5:true');
		});

		it('should return a correctly serialized cookie string with missing query forced', () => {
			expect(serializeExpCookie({
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
				xd: {
					id: 'xd',
					version: 'z',
					hash: 3421,
					population: 0.5,
				},
			})).toBe('ab:x:no-hash:no-pop:false|cd:y:1234:0.4:false|xd:z:3421:0.5:false');
		});

		it('should return a correctly serialized cookie string with bad query forced values', () => {
			expect(serializeExpCookie({
				ab: {
					id: 'ab',
					version: 'x',
					hash: NaN,
					population: NaN,
					queryForced: null,
				},
				cd: {
					id: 'cd',
					version: 'y',
					hash: 1234,
					population: 0.4,
					queryForced: undefined,
				},
				xd: {
					id: 'xd',
					version: 'z',
					hash: 3421,
					population: 0.5,
					queryForced: '',
				},
				zz: {
					id: 'zz',
					version: 'y',
					hash: 54,
					population: 0.3,
					queryForced: 'true',
				},
			})).toBe('ab:x:no-hash:no-pop:false|cd:y:1234:0.4:false|xd:z:3421:0.5:false|zz:y:54:0.3:false');
		});
	});

	describe('assignVersionForLoginId', () => {
		const key = 'asd';
		const loginId = 'ac4abedd-b9fd-487b-8d83-6fb73794e33e';
		const experiment = {
			distribution: {
				control: 0.5,
				variant: 0.5,
			},
			population: 1,
		};
		let spyAlea;

		describe('mocked pseudo random number generator', () => {
			beforeEach(() => {
				spyAlea = vi.spyOn(Alea, 'default').mockReturnValue(() => Math.random());
			});

			afterEach(vi.restoreAllMocks);

			it('should return undefined when experiment props missing', () => {
				expect(assignVersionForLoginId(undefined, {}, loginId)).toBe(undefined);
				expect(assignVersionForLoginId(key, { distribution: 'b' })).toBe(undefined);
				expect(assignVersionForLoginId(key, { distribution: 'b' }, '')).toBe(undefined);
			});

			it('should return undefined when dice roll lands outside population level', () => {
				const data = { ...experiment };

				spyAlea.mockReturnValueOnce(() => 0.5);
				data.population = 0.5;
				expect(assignVersionForLoginId(key, data, loginId)).toBe('variant');
				expect(spyAlea).toHaveBeenCalledTimes(1);

				spyAlea.mockReturnValueOnce(() => 0.51);
				data.population = 0.5;
				expect(assignVersionForLoginId(key, data, loginId)).toBe(undefined);
				expect(spyAlea).toHaveBeenCalledTimes(2);

				spyAlea.mockReturnValueOnce(() => 0.9);
				data.population = 0.5;
				expect(assignVersionForLoginId(key, data, loginId)).toBe(undefined);
				expect(spyAlea).toHaveBeenCalledTimes(3);
			});

			it('should return "control" when dice roll lands in the control distribution', () => {
				spyAlea.mockReturnValueOnce(() => 0);
				expect(assignVersionForLoginId(key, experiment, loginId)).toBe('control');
				expect(spyAlea).toHaveBeenCalledTimes(1);

				spyAlea.mockReturnValueOnce(() => 0.25);
				expect(assignVersionForLoginId(key, experiment, loginId)).toBe('control');
				expect(spyAlea).toHaveBeenCalledTimes(2);

				spyAlea.mockReturnValueOnce(() => 0.5);
				expect(assignVersionForLoginId(key, experiment, loginId)).toBe('control');
				expect(spyAlea).toHaveBeenCalledTimes(3);
			});

			it('should return "variant" when dice roll lands in the variant distribution', () => {
				spyAlea.mockReturnValueOnce(() => 0.51);
				expect(assignVersionForLoginId(key, experiment, loginId)).toBe('variant');
				expect(spyAlea).toHaveBeenCalledTimes(1);

				spyAlea.mockReturnValueOnce(() => 0.75);
				expect(assignVersionForLoginId(key, experiment, loginId)).toBe('variant');
				expect(spyAlea).toHaveBeenCalledTimes(2);

				spyAlea.mockReturnValueOnce(() => 0.99);
				expect(assignVersionForLoginId(key, experiment, loginId)).toBe('variant');
				expect(spyAlea).toHaveBeenCalledTimes(3);
			});

			it('should return assignment when more than two distributions', () => {
				const data = { ...experiment, distribution: { a: 0.5, b: 0.25, c: 0.25 } };

				spyAlea.mockReturnValueOnce(() => 0);
				expect(assignVersionForLoginId(key, data, loginId)).toBe('a');
				expect(spyAlea).toHaveBeenCalledTimes(1);

				spyAlea.mockReturnValueOnce(() => 0.5);
				expect(assignVersionForLoginId(key, data, loginId)).toBe('a');
				expect(spyAlea).toHaveBeenCalledTimes(2);

				spyAlea.mockReturnValueOnce(() => 0.51);
				expect(assignVersionForLoginId(key, data, loginId)).toBe('b');
				expect(spyAlea).toHaveBeenCalledTimes(3);

				spyAlea.mockReturnValueOnce(() => 0.75);
				expect(assignVersionForLoginId(key, data, loginId)).toBe('b');
				expect(spyAlea).toHaveBeenCalledTimes(4);

				spyAlea.mockReturnValueOnce(() => 0.76);
				expect(assignVersionForLoginId(key, data, loginId)).toBe('c');
				expect(spyAlea).toHaveBeenCalledTimes(5);

				spyAlea.mockReturnValueOnce(() => 0.99);
				expect(assignVersionForLoginId(key, data, loginId)).toBe('c');
				expect(spyAlea).toHaveBeenCalledTimes(6);
			});

			it('should return a version when the population is undefined', () => {
				const data = { ...experiment };
				delete data.population;
				expect(['control', 'variant']).toContain(assignVersionForLoginId(key, data, loginId));
				expect(spyAlea).toHaveBeenCalledTimes(1);
			});

			it('should use weight without population multiplier when population is undefined', () => {
				const data = { distribution: { a: 0.3, b: 0.7 } };
				delete data.population;

				spyAlea.mockReturnValueOnce(() => 0.3);
				expect(assignVersionForLoginId(key, data, loginId)).toBe('a');
				expect(spyAlea).toHaveBeenCalledTimes(1);

				spyAlea.mockReturnValueOnce(() => 0.31);
				expect(assignVersionForLoginId(key, data, loginId)).toBe('b');
				expect(spyAlea).toHaveBeenCalledTimes(2);
			});
		});

		describe('original pseudo random number generator', () => {
			it('should return same variation over many runs', () => {
				runManyTimesAndCompare(() => assignVersionForLoginId(key, experiment, loginId));
			});
		});
	});

	describe('trackExperimentVersion', () => {
		it('should not call track event for undefined version', () => {
			const data = { version: undefined };
			const client = {
				readFragment: vi.fn().mockReturnValue(data),
			};
			const trackEvent = vi.fn();
			const key = 'asd';
			const category = 'category';
			const action = 'action';

			const result = trackExperimentVersion(client, trackEvent, category, key, action);

			expect(client.readFragment).toHaveBeenCalledWith({
				id: `Experiment:${key}`,
				fragment: experimentVersionFragment
			});
			expect(trackEvent).toHaveBeenCalledTimes(0);
			expect(result).toBe(data);
		});

		it('should handle null fragment result', () => {
			const client = {
				readFragment: vi.fn().mockReturnValue(null),
			};
			const trackEvent = vi.fn();
			const key = 'asd';
			const category = 'category';
			const action = 'action';

			const result = trackExperimentVersion(client, trackEvent, category, key, action);

			expect(client.readFragment).toHaveBeenCalledWith({
				id: `Experiment:${key}`,
				fragment: experimentVersionFragment
			});
			expect(trackEvent).toHaveBeenCalledTimes(0);
			expect(result).toEqual({});
		});

		it('should not call track event for unassigned version', () => {
			const data = { version: 'unassigned' };
			const client = {
				readFragment: vi.fn().mockReturnValue(data),
			};
			const trackEvent = vi.fn();
			const key = 'asd';
			const category = 'category';
			const action = 'action';

			const result = trackExperimentVersion(client, trackEvent, category, key, action);

			expect(client.readFragment).toHaveBeenCalledWith({
				id: `Experiment:${key}`,
				fragment: experimentVersionFragment
			});
			expect(trackEvent).toHaveBeenCalledTimes(0);
			expect(result).toBe(data);
		});

		it('should call track event', () => {
			const data = { version: 'a' };
			const client = {
				readFragment: vi.fn().mockReturnValue(data),
			};
			const trackEvent = vi.fn();
			const key = 'asd';
			const category = 'category';
			const action = 'action';

			const result = trackExperimentVersion(client, trackEvent, category, key, action);

			expect(client.readFragment).toHaveBeenCalledWith({
				id: `Experiment:${key}`,
				fragment: experimentVersionFragment
			});
			expect(trackEvent).toHaveBeenCalledWith(category, action, data.version, undefined);
			expect(result).toBe(data);
		});

		it('should call track event with undefined action', () => {
			const data = { version: 'a' };
			const client = {
				readFragment: vi.fn().mockReturnValue(data),
			};
			const trackEvent = vi.fn();
			const key = 'asd';
			const category = 'category';

			const result = trackExperimentVersion(client, trackEvent, category, key);

			expect(client.readFragment).toHaveBeenCalledWith({
				id: `Experiment:${key}`,
				fragment: experimentVersionFragment
			});
			expect(trackEvent).toHaveBeenCalledWith(category, key, data.version, undefined);
			expect(result).toBe(data);
		});
	});

	describe('calculateHash', () => {
		const base = {
			name: 'test',
			control: { key: 'a', name: 'control' },
			variants: { a: { name: 'a' }, b: { name: 'b' } },
			distribution: { a: 0.5, b: 0.5 },
			population: 0.1,
		};
		const changedName = {
			...base,
			name: 'renamed',
		};
		const changedDistribution = {
			...base,
			distribution: { a: 0, b: 1 },
		};
		const changedVariants = {
			...base,
			variants: { a: { name: 'a' }, c: { name: 'c' } },
		};
		const changedControl = {
			...base,
			control: { key: 'b', name: 'control' },
		};
		const changedPopulation = {
			...base,
			population: 1,
		};

		it('should generate the same hash when only population changes', () => {
			expect(calculateHash(base)).toBe(calculateHash(changedPopulation));
		});

		it('should generate a different hash when the name changes', () => {
			expect(calculateHash(base)).not.toBe(calculateHash(changedName));
		});

		it('should generate a different hash when the distribution changes', () => {
			expect(calculateHash(base)).not.toBe(calculateHash(changedDistribution));
		});

		it('should generate a different hash when the variants changes', () => {
			expect(calculateHash(base)).not.toBe(calculateHash(changedVariants));
		});

		it('should generate a different hash when the control changes', () => {
			expect(calculateHash(base)).not.toBe(calculateHash(changedControl));
		});

		it('should handle undefined experiment parameter', () => {
			const hash1 = calculateHash();
			const hash2 = calculateHash(undefined);
			const hash3 = calculateHash(null);

			// All should produce the same hash since they default to {}
			expect(hash1).toBe(hash2);
			expect(hash1).toBe(hash3);
			expect(typeof hash1).toBe('number');
		});
	});

	describe('getCookieAssignments', () => {
		it('should handle empty cookie', () => {
			const cookieStore = new CookieStore();

			expect(getCookieAssignments(cookieStore)).toEqual({});
		});

		it('should get cookie assignments', () => {
			const cookieStore = new CookieStore({ uiab: 'ab:variant:1753809052:0.5' });

			expect(getCookieAssignments(cookieStore)).toEqual({
				ab: {
					id: 'ab',
					version: 'variant',
					hash: 1753809052,
					population: 0.5,
					queryForced: false,
				}
			});
		});
	});

	describe('setCookieAssignments', () => {
		afterEach(clearDocumentCookies);

		it('should not modify cookie when assignments is undefined', () => {
			const cookieStore = new CookieStore();

			setCookieAssignments(cookieStore);

			expect(cookieStore.getSetCookies()[0]).toBe(undefined);
		});

		it('should remove cookie when assignments is empty', () => {
			const cookieStore = new CookieStore({ uiab: 'exp1:a:123:0.5' });

			setCookieAssignments(cookieStore, {});

			// Cookie should be removed (js-cookie sets an expired cookie to delete)
			expect(cookieStore.get('uiab')).toBe(undefined);
		});

		it('should set cookie', () => {
			const mockAssignments = {
				ab: {
					id: 'ab',
					version: 'variant',
					hash: 1753809052,
					population: 0.5
				}
			};
			const cookieStore = new CookieStore();

			setCookieAssignments(cookieStore, mockAssignments);

			expect(cookieStore.getSetCookies()[0]).toBe('uiab=ab:variant:1753809052:0.5:false; Path=/');
		});
	});

	describe('cleanupStaleCookieAssignments', () => {
		beforeEach(clearDocumentCookies);
		afterEach(clearDocumentCookies);

		it('should return false when activeExperiments is empty', () => {
			const cookieStore = new CookieStore({ uiab: 'exp1:a:123:0.5' });

			expect(cleanupStaleCookieAssignments(cookieStore, [])).toBe(false);
			expect(cleanupStaleCookieAssignments(cookieStore, null)).toBe(false);
			expect(cleanupStaleCookieAssignments(cookieStore, undefined)).toBe(false);
		});

		it('should return false when cookie has no assignments', () => {
			const cookieStore = new CookieStore({});

			const result = cleanupStaleCookieAssignments(cookieStore, ['exp1', 'exp2']);

			expect(result).toBe(false);
		});

		it('should return false when all assignments are active', () => {
			const cookieStore = new CookieStore({ uiab: 'exp1:a:123:0.5|exp2:b:456:0.5' });

			const result = cleanupStaleCookieAssignments(cookieStore, ['exp1', 'exp2', 'exp3']);

			expect(result).toBe(false);
			// Cookie should remain unchanged
			expect(cookieStore.get('uiab')).toBe('exp1:a:123:0.5|exp2:b:456:0.5');
		});

		it('should remove stale assignments and return true', () => {
			const cookieStore = new CookieStore({
				uiab: 'exp1:a:123:0.5:false|stale_exp:b:456:0.5:false|exp2:c:789:0.5:false'
			});

			const result = cleanupStaleCookieAssignments(cookieStore, ['exp1', 'exp2']);

			expect(result).toBe(true);
			// Check the cookie was updated (stale_exp removed)
			const setCookies = cookieStore.getSetCookies();
			expect(setCookies[setCookies.length - 1]).toContain('exp1:a:123:0.5:false');
			expect(setCookies[setCookies.length - 1]).toContain('exp2:c:789:0.5:false');
			expect(setCookies[setCookies.length - 1]).not.toContain('stale_exp');
		});

		it('should remove all assignments if all are stale', () => {
			const cookieStore = new CookieStore({
				uiab: 'stale1:a:123:0.5:false|stale2:b:456:0.5:false'
			});

			const result = cleanupStaleCookieAssignments(cookieStore, ['active_exp']);

			expect(result).toBe(true);
			// Cookie should be removed entirely
			expect(cookieStore.get('uiab')).toBe(undefined);
		});

		it('should handle single stale assignment', () => {
			const cookieStore = new CookieStore({ uiab: 'stale_exp:a:123:0.5:false' });

			const result = cleanupStaleCookieAssignments(cookieStore, ['exp1', 'exp2']);

			expect(result).toBe(true);
			expect(cookieStore.get('uiab')).toBe(undefined);
		});

		it('should preserve queryForced flag in retained assignments', () => {
			const cookieStore = new CookieStore({
				uiab: 'exp1:a:123:0.5:true|stale_exp:b:456:0.5:false|exp2:c:789:0.5:false'
			});

			const result = cleanupStaleCookieAssignments(cookieStore, ['exp1', 'exp2']);

			expect(result).toBe(true);
			const setCookies = cookieStore.getSetCookies();
			expect(setCookies[setCookies.length - 1]).toContain('exp1:a:123:0.5:true');
		});
	});

	describe('getForcedAssignment', () => {
		const experimentSetting = {
			name: 'test',
			control: { key: 'a', name: 'control' },
			variants: { a: { name: 'a' }, b: { name: 'b' } },
			distribution: { a: 0.5, b: 0.5 },
			population: 0.1,
		};

		afterEach(clearDocumentCookies);

		it('should handle undefined props', () => {
			const cookieStore = new CookieStore();

			let result = getForcedAssignment(cookieStore, undefined, 'asd', experimentSetting);

			expect(result).toBe(undefined);

			result = getForcedAssignment(cookieStore, undefined, undefined, experimentSetting);

			expect(result).toBe(undefined);

			result = getForcedAssignment(cookieStore, {}, undefined, experimentSetting);

			expect(result).toBe(undefined);

			result = getForcedAssignment(cookieStore, { query: {} }, undefined, experimentSetting);

			expect(result).toBe(undefined);

			result = getForcedAssignment(cookieStore, { query: { setuiab: [] } }, undefined, experimentSetting);

			expect(result).toBe(undefined);

			result = getForcedAssignment(cookieStore, { query: { setuiab: '' } }, undefined, experimentSetting);

			expect(result).toBe(undefined);

			result = getForcedAssignment(cookieStore, { query: { setuiab: null } }, undefined, experimentSetting);

			expect(result).toBe(undefined);
		});

		it('should get forced assignment from query string', () => {
			const cookieStore = new CookieStore();
			const route = { query: { setuiab: 'asd.x' } };

			const result = getForcedAssignment(cookieStore, route, 'asd', experimentSetting);

			expect(result).toEqual({ ...experimentSetting, version: 'x', queryForced: true });
		});

		it('should get multiple forced assignments from query string', () => {
			const cookieStore = new CookieStore();
			const route = { query: { setuiab: ['asd.x', 'qwe.b'] } };

			let result = getForcedAssignment(cookieStore, route, 'asd', experimentSetting);

			expect(result).toEqual({ ...experimentSetting, version: 'x', queryForced: true });

			result = getForcedAssignment(cookieStore, route, 'qwe', experimentSetting);

			expect(result).toEqual({ ...experimentSetting, version: 'b', queryForced: true });
		});

		it('should get forced assignment from cookie', () => {
			const hash = 1753809052;
			const cookieStore = new CookieStore({ uiab: `asd:variant:${hash}:0.5` });

			const result = getForcedAssignment(cookieStore, {}, 'asd', experimentSetting);

			expect(result).toEqual({
				...experimentSetting,
				version: 'variant',
				hash,
				queryForced: false
			});
		});

		it('should ensure query forced assignment matches', () => {
			const cookieStore = new CookieStore();
			const route = { query: { setuiab: 'asd.x' } };

			const result = getForcedAssignment(cookieStore, route, 'a', experimentSetting);

			expect(result).toEqual(undefined);
		});

		it('should handle bad query string', () => {
			const cookieStore = new CookieStore();
			let route = { query: { setuiab: 'asd' } };

			let result = getForcedAssignment(cookieStore, route, 'asd', experimentSetting);

			expect(result).toEqual(undefined);

			route = { query: { setuiab: 'asd.' } };

			result = getForcedAssignment(cookieStore, route, 'asd', experimentSetting);

			expect(result).toEqual(undefined);
		});

		it('should handle bad cookie', () => {
			const cookieStore = new CookieStore({ uiab: 'asd' });

			const result = getForcedAssignment(cookieStore, '', 'asd', experimentSetting);

			expect(result).toEqual(undefined);
		});

		it('should get forced unassigned assignment from cookie', () => {
			const hash = 1753809052;
			const cookieStore = new CookieStore({ uiab: `asd:unassigned:${hash}:0.5` });

			const result = getForcedAssignment(cookieStore, '', 'asd', experimentSetting);

			expect(result).toEqual({
				...experimentSetting,
				version: 'unassigned',
				hash,
				queryForced: false
			});
		});

		it('should get query forced setting from cookie', () => {
			const hash1 = 1753809052;
			const hash2 = 456;
			const cookieStore = new CookieStore({ uiab: `asd:variant:${hash1}:0.5:true|qwe:a:${hash2}:0.1:false` });

			let result = getForcedAssignment(cookieStore, '', 'asd', experimentSetting);

			expect(result).toEqual({
				...experimentSetting,
				version: 'variant',
				hash: hash1,
				queryForced: false // queryForced is only true with active query param, not from cookie
			});

			result = getForcedAssignment(cookieStore, '', 'qwe', experimentSetting);

			expect(result).toEqual({
				...experimentSetting,
				version: 'a',
				hash: hash2,
				queryForced: false
			});
		});

		it('should respect new query param even when cookie has queryForced=true', () => {
			const hash = 1753809052;
			// Cookie has queryForced=true from previous setuiab, but no active query param now
			const cookieStore = new CookieStore({ uiab: `asd:variant:${hash}:0.5:true` });

			const result = getForcedAssignment(cookieStore, { query: {} }, 'asd', experimentSetting);

			expect(result).toEqual({
				...experimentSetting,
				version: 'variant',
				hash,
				queryForced: false // Should be false since there's no active query param
			});
		});

		it('should set queryForced=true only with active setuiab query param', () => {
			const hash = 1753809052;
			const cookieStore = new CookieStore({ uiab: `asd:a:${hash}:0.5:false` });
			const route = { query: { setuiab: 'asd.b' } };

			const result = getForcedAssignment(cookieStore, route, 'asd', experimentSetting);

			expect(result).toEqual({
				...experimentSetting,
				version: 'b',
				hash,
				queryForced: true // Should be true because of active query param
			});
		});

		it(`should get forced assignment for "${HOME_PAGE_EXPERIMENT_KEY}" from query string`, () => {
			const cookieStore = new CookieStore({ uiab: `${HOME_PAGE_EXPERIMENT_KEY}` });
			const result = getForcedAssignment(
				cookieStore,
				{ query: { setuiab: `${HOME_PAGE_EXPERIMENT_KEY}.variant` } },
				HOME_PAGE_EXPERIMENT_KEY,
				homePageExpSetting,
			);

			expect(result).toEqual({
				...homePageExpSetting,
				version: 'variant',
				queryForced: true,
			});
		});

		it(
			`should get forced assignment from Fastly header for "${HOME_PAGE_EXPERIMENT_KEY}" over query string`,
			() => {
				const cookieStore = new CookieStore({ uiab: `${HOME_PAGE_EXPERIMENT_KEY}` });
				const result = getForcedAssignment(
					cookieStore,
					{ query: { setuiab: `${HOME_PAGE_EXPERIMENT_KEY}.variant` } },
					HOME_PAGE_EXPERIMENT_KEY,
					homePageExpSetting,
					'a'
				);

				expect(result).toEqual({
					...homePageExpSetting,
					version: 'a',
					headerForced: true,
					queryForced: false,
				});
			}
		);

		it(`should get forced assignment from Fastly header for "${HOME_PAGE_EXPERIMENT_KEY}" over cookie`, () => {
			const hash1 = 1753809093;
			const hash2 = 424;

			const cookieStore = new CookieStore({
				uiab: `${HOME_PAGE_EXPERIMENT_KEY}:a:${hash1}:0.5:true|fake:a:${hash2}:0.1:false`
			});
			const result = getForcedAssignment(
				cookieStore,
				{},
				HOME_PAGE_EXPERIMENT_KEY,
				homePageExpSetting,
				'variant'
			);

			expect(result).toEqual({
				...homePageExpSetting,
				hash: hash1,
				version: 'variant',
				headerForced: true,
				queryForced: false, // queryForced is only true with active query param, not from cookie
			});
		});

		it('should handle setuiab array with undefined/null values', () => {
			const cookieStore = new CookieStore();
			const route = { query: { setuiab: [undefined, null, 'asd.x'] } };

			const result = getForcedAssignment(cookieStore, route, 'asd', experimentSetting);

			expect(result).toEqual({ ...experimentSetting, version: 'x', queryForced: true });
		});
	});

	describe('getLoginId', () => {
		afterEach(clearDocumentCookies);

		it('should handle empty cookies', () => {
			const cookieStore = new CookieStore();

			const result = getLoginId(cookieStore);

			expect(result).toBe(MOCK_UUID);
		});

		it('should handle bad kvu cookie', () => {
			const cookieStore = new CookieStore({ kvu: 'asd' });

			const result = getLoginId(cookieStore);

			expect(result).toBe(MOCK_UUID);
		});

		it('should handle get user ID from kvu cookie', () => {
			const mockUserId = 'qwe';
			const cookieStore = new CookieStore({ kvu: `1.1678406427.1679673172.${mockUserId}` });

			const result = getLoginId(cookieStore);

			expect(result).toBe(mockUserId);
		});

		it('should handle empty user ID from kvu cookie', () => {
			const cookieStore = new CookieStore({ kvu: '1.1678406427.1679673172' });

			const result = getLoginId(cookieStore);

			expect(result).toBe(MOCK_UUID);
		});

		it('should handle empty visitor ID from uiv cookie', () => {
			const cookieStore = new CookieStore({ uiv: '' });

			const result = getLoginId(cookieStore);

			expect(result).toBe(MOCK_UUID);
		});

		it('should handle get visitor ID from uiv cookie', () => {
			const mockVisitorId = 'qwe';
			const cookieStore = new CookieStore({ uiv: mockVisitorId });

			const result = getLoginId(cookieStore);

			expect(result).toBe(mockVisitorId);
		});
	});

	describe('assignAllActiveExperiments', () => {
		it('should get active experiments', async () => {
			const apollo = {
				cache: {
					readQuery: vi.fn()
				}
			};

			await assignAllActiveExperiments(apollo);

			expect(apollo.cache.readQuery).toHaveBeenCalledTimes(1);
		});

		it('should assign active experiments', async () => {
			const apollo = {
				cache: {
					readQuery: vi.fn().mockReturnValue({
						general: {
							activeExperiments: {
								value: '"a,b"'
							}
						}
					})
				},
				query: vi.fn()
			};

			await assignAllActiveExperiments(apollo);

			expect(apollo.query).toHaveBeenCalledTimes(2);
			expect(apollo.query).toHaveBeenCalledWith({
				query: experimentAssignmentQuery,
				variables: { id: 'a' }
			});
			expect(apollo.query).toHaveBeenCalledWith({
				query: experimentAssignmentQuery,
				variables: { id: 'b' }
			});
		});

		it('should handle errors when getting active experiments', async () => {
			const mockError = new Error('Cache error');
			const apollo = {
				cache: {
					readQuery: vi.fn().mockImplementation(() => {
						throw mockError;
					})
				},
				query: vi.fn().mockImplementation(() => Promise.reject(mockError))
			};

			await assignAllActiveExperiments(apollo);

			expect(apollo.cache.readQuery).toHaveBeenCalledTimes(1);
			// getActiveExperiments will try async query when cache fails
			expect(apollo.query).toHaveBeenCalledWith({ query: experimentIdsQuery });
		});
	});

	describe('getInitialExperimentVersion', () => {
		afterEach(clearDocumentCookies);

		it('should return undefined when no cookie and no apollo cache exists', () => {
			const cookieStore = new CookieStore();
			const apollo = null;
			const experimentKey = 'test_experiment';

			const result = getInitialExperimentVersion(cookieStore, apollo, experimentKey);

			expect(result).toBe(undefined);
		});

		it('should return undefined when experiment is not in cookie and no apollo', () => {
			const cookieStore = new CookieStore({ uiab: 'other_exp:a:123:0.5' });
			const apollo = null;
			const experimentKey = 'test_experiment';

			const result = getInitialExperimentVersion(cookieStore, apollo, experimentKey);

			expect(result).toBe(undefined);
		});

		it('should return version from cookie when cookie exists', () => {
			const experimentKey = 'test_experiment';
			const cookieStore = new CookieStore({ uiab: `${experimentKey}:b:123:0.5` });
			const apollo = null;

			const result = getInitialExperimentVersion(cookieStore, apollo, experimentKey);

			expect(result).toBe('b');
		});

		it('should return correct version when multiple experiments in cookie', () => {
			const experimentKey = 'test_experiment';
			const cookieValue = `other:a:456:0.3|${experimentKey}:b:123:0.5|another:c:789:0.8`;
			const cookieStore = new CookieStore({ uiab: cookieValue });
			const apollo = null;

			const result = getInitialExperimentVersion(cookieStore, apollo, experimentKey);

			expect(result).toBe('b');
		});

		it('should return unassigned version from cookie', () => {
			const experimentKey = 'test_experiment';
			const cookieStore = new CookieStore({ uiab: `${experimentKey}:unassigned:123:0.5` });
			const apollo = null;

			const result = getInitialExperimentVersion(cookieStore, apollo, experimentKey);

			expect(result).toBe('unassigned');
		});

		it('should return version from apollo cache when no cookie exists', () => {
			const experimentKey = 'test_experiment';
			const cookieStore = new CookieStore();
			const apollo = {
				readFragment: vi.fn().mockReturnValue({ version: 'a' }),
			};

			const result = getInitialExperimentVersion(cookieStore, apollo, experimentKey);

			expect(result).toBe('a');
			expect(apollo.readFragment).toHaveBeenCalledWith({
				id: `Experiment:${experimentKey}`,
				fragment: experimentVersionFragment,
			});
		});

		it('should prefer cookie over apollo cache', () => {
			const experimentKey = 'test_experiment';
			const cookieStore = new CookieStore({ uiab: `${experimentKey}:b:123:0.5` });
			const apollo = {
				readFragment: vi.fn().mockReturnValue({ version: 'a' }),
			};

			const result = getInitialExperimentVersion(cookieStore, apollo, experimentKey);

			expect(result).toBe('b');
			// Apollo cache should not be checked when cookie exists
			expect(apollo.readFragment).not.toHaveBeenCalled();
		});

		it('should handle apollo cache miss gracefully', () => {
			const experimentKey = 'test_experiment';
			const cookieStore = new CookieStore();
			const apollo = {
				readFragment: vi.fn().mockReturnValue(null),
			};

			const result = getInitialExperimentVersion(cookieStore, apollo, experimentKey);

			expect(result).toBe(undefined);
		});

		it('should handle apollo cache error gracefully', () => {
			const experimentKey = 'test_experiment';
			const cookieStore = new CookieStore();
			const apollo = {
				readFragment: vi.fn().mockImplementation(() => {
					throw new Error('Cache read error');
				}),
			};

			const result = getInitialExperimentVersion(cookieStore, apollo, experimentKey);

			expect(result).toBe(undefined);
		});

		it('should handle apollo cache with undefined version', () => {
			const experimentKey = 'test_experiment';
			const cookieStore = new CookieStore();
			const apollo = {
				readFragment: vi.fn().mockReturnValue({ version: undefined }),
			};

			const result = getInitialExperimentVersion(cookieStore, apollo, experimentKey);

			expect(result).toBe(undefined);
		});
	});

	describe('evictExperimentCacheIfForced', () => {
		it('should not evict cache when no setuiab query param', () => {
			const apollo = {
				cache: {
					evict: vi.fn(),
					gc: vi.fn(),
				}
			};
			const route = { query: {} };
			const experimentKey = 'test_experiment';

			evictExperimentCacheIfForced(apollo, route, experimentKey);

			expect(apollo.cache.evict).not.toHaveBeenCalled();
			expect(apollo.cache.gc).not.toHaveBeenCalled();
		});

		it('should evict cache when setuiab query param is present', () => {
			const apollo = {
				cache: {
					evict: vi.fn(),
					gc: vi.fn(),
				}
			};
			const route = { query: { setuiab: 'test_experiment.b' } };
			const experimentKey = 'test_experiment';

			evictExperimentCacheIfForced(apollo, route, experimentKey);

			expect(apollo.cache.evict).toHaveBeenCalledWith({
				id: `Experiment:${experimentKey}`,
			});
			expect(apollo.cache.gc).toHaveBeenCalled();
		});

		it('should evict cache when setuiab is for different experiment', () => {
			const apollo = {
				cache: {
					evict: vi.fn(),
					gc: vi.fn(),
				}
			};
			const route = { query: { setuiab: 'other_experiment.a' } };
			const experimentKey = 'test_experiment';

			evictExperimentCacheIfForced(apollo, route, experimentKey);

			expect(apollo.cache.evict).toHaveBeenCalledWith({
				id: `Experiment:${experimentKey}`,
			});
			expect(apollo.cache.gc).toHaveBeenCalled();
		});

		it('should handle undefined route', () => {
			const apollo = {
				cache: {
					evict: vi.fn(),
					gc: vi.fn(),
				}
			};
			const experimentKey = 'test_experiment';

			evictExperimentCacheIfForced(apollo, undefined, experimentKey);

			expect(apollo.cache.evict).not.toHaveBeenCalled();
			expect(apollo.cache.gc).not.toHaveBeenCalled();
		});
	});

	describe('queryExperimentAssignment', () => {
		it('should call apollo.query with correct parameters', async () => {
			const apollo = {
				cache: {
					evict: vi.fn(),
					gc: vi.fn(),
				},
				query: vi.fn().mockResolvedValue({
					data: { experiment: { version: 'b' } }
				}),
			};
			const route = { query: {} };
			const experimentKey = 'test_experiment';

			const result = await queryExperimentAssignment(apollo, route, experimentKey);

			expect(apollo.query).toHaveBeenCalledWith({
				query: experimentAssignmentQuery,
				variables: { id: experimentKey },
			});
			expect(result.data.experiment.version).toBe('b');
		});

		it('should evict cache when setuiab is present', async () => {
			const apollo = {
				cache: {
					evict: vi.fn(),
					gc: vi.fn(),
				},
				query: vi.fn().mockResolvedValue({
					data: { experiment: { version: 'a' } }
				}),
			};
			const route = { query: { setuiab: 'test_experiment.a' } };
			const experimentKey = 'test_experiment';

			await queryExperimentAssignment(apollo, route, experimentKey);

			expect(apollo.cache.evict).toHaveBeenCalledWith({
				id: `Experiment:${experimentKey}`,
			});
			expect(apollo.cache.gc).toHaveBeenCalled();
			expect(apollo.query).toHaveBeenCalledWith({
				query: experimentAssignmentQuery,
				variables: { id: experimentKey },
			});
		});

		it('should not evict cache when setuiab is not present', async () => {
			const apollo = {
				cache: {
					evict: vi.fn(),
					gc: vi.fn(),
				},
				query: vi.fn().mockResolvedValue({
					data: { experiment: { version: 'b' } }
				}),
			};
			const route = { query: {} };
			const experimentKey = 'test_experiment';

			await queryExperimentAssignment(apollo, route, experimentKey);

			expect(apollo.cache.evict).not.toHaveBeenCalled();
			expect(apollo.cache.gc).not.toHaveBeenCalled();
			expect(apollo.query).toHaveBeenCalledWith({
				query: experimentAssignmentQuery,
				variables: { id: experimentKey },
			});
		});

		it('should return promise from apollo.query', async () => {
			const mockData = { data: { experiment: { version: 'a' } } };
			const apollo = {
				cache: {
					evict: vi.fn(),
					gc: vi.fn(),
				},
				query: vi.fn().mockResolvedValue(mockData),
			};
			const route = { query: {} };
			const experimentKey = 'test_experiment';

			const result = await queryExperimentAssignment(apollo, route, experimentKey);

			expect(result).toBe(mockData);
		});
	});

	describe('initializeExperiment', () => {
		it('should call callback immediately with initial version from cookie', () => {
			const cookieStore = new CookieStore({ uiab: 'test_exp:b:123:0.5' });
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: 'b' } } }),
				readFragment: vi.fn().mockReturnValue({ version: 'b' }),
			};
			const route = { query: {} };
			const callback = vi.fn();

			const result = initializeExperiment(cookieStore, apollo, route, 'test_exp', callback);

			expect(result).toBe('b');
			expect(callback).toHaveBeenCalledWith('b');
		});

		it('should call callback with undefined if no cookie exists', () => {
			const cookieStore = new CookieStore({});
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: 'a' } } }),
				readFragment: vi.fn().mockReturnValue(null), // No cache hit
			};
			const route = { query: {} };
			const callback = vi.fn();

			const result = initializeExperiment(cookieStore, apollo, route, 'test_exp', callback);

			expect(result).toBeUndefined();
			expect(callback).toHaveBeenCalledWith(undefined);
		});

		it('should only call callback once when no setuiab query param', async () => {
			const cookieStore = new CookieStore({ uiab: 'test_exp:a:123:0.5' });
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: 'b' } } }),
				readFragment: vi.fn().mockReturnValue({ version: 'a' }),
			};
			const route = { query: {} };
			const callback = vi.fn();

			initializeExperiment(cookieStore, apollo, route, 'test_exp', callback);

			// Should only be called once with cookie value, no async query
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith('a');
			expect(apollo.query).not.toHaveBeenCalled();
		});

		it('should call callback twice when setuiab query param is present', async () => {
			const cookieStore = new CookieStore({ uiab: 'test_exp:a:123:0.5' });
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: 'b' } } }),
				readFragment: vi.fn().mockReturnValue({ version: 'b' }),
			};
			const route = { query: { setuiab: 'test_exp.b' } };
			const callback = vi.fn();

			initializeExperiment(cookieStore, apollo, route, 'test_exp', callback);

			// Wait for promise to resolve
			await vi.waitFor(() => expect(callback).toHaveBeenCalledTimes(2));

			expect(callback).toHaveBeenNthCalledWith(1, 'a');
			expect(callback).toHaveBeenNthCalledWith(2, 'b');
			expect(apollo.query).toHaveBeenCalled();
		});

		it('should not query for experiment assignment when no setuiab param', () => {
			const cookieStore = new CookieStore({});
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: 'a' } } }),
				readFragment: vi.fn().mockReturnValue({ version: 'a' }),
			};
			const route = { query: {} };

			initializeExperiment(cookieStore, apollo, route, 'test_exp', vi.fn());

			expect(apollo.query).not.toHaveBeenCalled();
		});

		it('should query for experiment assignment when setuiab param is present', () => {
			const cookieStore = new CookieStore({});
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: 'a' } } }),
				readFragment: vi.fn().mockReturnValue({ version: 'a' }),
			};
			const route = { query: { setuiab: 'test_exp.a' } };

			initializeExperiment(cookieStore, apollo, route, 'test_exp', vi.fn());

			expect(apollo.query).toHaveBeenCalledWith({
				query: experimentAssignmentQuery,
				variables: { id: 'test_exp' },
			});
		});

		it('should evict cache if setuiab is present', () => {
			const cookieStore = new CookieStore({ uiab: 'test_exp:a:123:0.5' });
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: 'b' } } }),
				readFragment: vi.fn().mockReturnValue({ version: 'b' }),
			};
			const route = { query: { setuiab: 'test_exp.b' } };

			initializeExperiment(cookieStore, apollo, route, 'test_exp', vi.fn());

			expect(apollo.cache.evict).toHaveBeenCalledWith({ id: 'Experiment:test_exp' });
			expect(apollo.cache.gc).toHaveBeenCalled();
		});

		it('should work without callback', async () => {
			const cookieStore = new CookieStore({ uiab: 'test_exp:a:123:0.5' });
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: 'b' } } }),
				readFragment: vi.fn().mockReturnValue({ version: 'a' }),
			};
			const route = { query: {} };

			const result = initializeExperiment(cookieStore, apollo, route, 'test_exp');

			expect(result).toBe('a');
			// Should not query when no setuiab param
			expect(apollo.query).not.toHaveBeenCalled();
		});

		it('should handle callback being called with different versions when setuiab is present', async () => {
			const cookieStore = new CookieStore({ uiab: 'test_exp:control:123:0.5' });
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: 'variant' } } }),
				readFragment: vi.fn().mockReturnValue({ version: 'variant' }),
			};
			const route = { query: { setuiab: 'test_exp.variant' } };
			const callback = vi.fn();

			initializeExperiment(cookieStore, apollo, route, 'test_exp', callback);

			// Wait for promise to resolve
			await vi.waitFor(() => expect(callback).toHaveBeenCalledTimes(2));

			expect(callback).toHaveBeenNthCalledWith(1, 'control');
			expect(callback).toHaveBeenNthCalledWith(2, 'variant');
		});

		it('should not call trackEvent when trackEvent is not provided', async () => {
			const cookieStore = new CookieStore({ uiab: 'test_exp:a:123:0.5' });
			const readFragment = vi.fn().mockReturnValue({ version: 'a' });
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: 'a' } } }),
				readFragment,
			};
			const route = { query: {} };
			const callback = vi.fn();

			initializeExperiment(cookieStore, apollo, route, 'test_exp', callback);

			// Should only be called once (no async query without setuiab)
			expect(callback).toHaveBeenCalledTimes(1);

			// readFragment should not be called if trackEvent is not provided
			expect(readFragment).not.toHaveBeenCalled();
		});

		it('should call trackExperimentVersion when trackEvent is provided and no setuiab', () => {
			const cookieStore = new CookieStore({ uiab: 'test_exp:a:123:0.5' });
			const readFragment = vi.fn().mockReturnValue({ version: 'a' });
			const trackEvent = vi.fn();
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: 'a' } } }),
				readFragment,
			};
			const route = { query: {} };
			const callback = vi.fn();

			initializeExperiment(cookieStore, apollo, route, 'test_exp', callback, trackEvent);

			// Should track immediately without async query
			expect(readFragment).toHaveBeenCalledWith({
				id: 'Experiment:test_exp',
				fragment: experimentVersionFragment,
			});
			expect(trackEvent).toHaveBeenCalledWith('event-tracking', 'test_exp', 'a', undefined);
			expect(apollo.query).not.toHaveBeenCalled();
		});

		it('should call trackExperimentVersion with custom action when provided', () => {
			const cookieStore = new CookieStore({ uiab: 'test_exp:b:123:0.5' });
			const readFragment = vi.fn().mockReturnValue({ version: 'b' });
			const trackEvent = vi.fn();
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: 'b' } } }),
				readFragment,
			};
			const route = { query: {} };
			const callback = vi.fn();
			const customAction = 'custom-action';

			initializeExperiment(cookieStore, apollo, route, 'test_exp', callback, trackEvent, customAction);

			// Should track immediately without async query
			expect(trackEvent).toHaveBeenCalledWith('event-tracking', customAction, 'b', undefined);
		});

		it('should call trackExperimentVersion with custom category when provided', () => {
			const cookieStore = new CookieStore({ uiab: 'test_exp:b:123:0.5' });
			const readFragment = vi.fn().mockReturnValue({ version: 'b' });
			const trackEvent = vi.fn();
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: 'b' } } }),
				readFragment,
			};
			const route = { query: {} };
			const callback = vi.fn();
			const customAction = 'custom-action';
			const customCategory = 'custom-category';

			initializeExperiment(
				cookieStore,
				apollo,
				route,
				'test_exp',
				callback,
				trackEvent,
				customAction,
				customCategory
			);

			// Should track immediately without async query
			expect(trackEvent).toHaveBeenCalledWith(customCategory, customAction, 'b', undefined);
		});

		it('should not call trackEvent for unassigned version', () => {
			const cookieStore = new CookieStore({ uiab: 'test_exp:unassigned:123:0.5' });
			const readFragment = vi.fn().mockReturnValue({ version: 'unassigned' });
			const trackEvent = vi.fn();
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: 'unassigned' } } }),
				readFragment,
			};
			const route = { query: {} };
			const callback = vi.fn();

			initializeExperiment(cookieStore, apollo, route, 'test_exp', callback, trackEvent);

			expect(readFragment).toHaveBeenCalledWith({
				id: 'Experiment:test_exp',
				fragment: experimentVersionFragment,
			});
			// trackEvent should not be called for unassigned version
			expect(trackEvent).not.toHaveBeenCalled();
		});

		it('should not call trackEvent for undefined version', () => {
			const cookieStore = new CookieStore({});
			const readFragment = vi.fn().mockReturnValue({ version: undefined });
			const trackEvent = vi.fn();
			const apollo = {
				cache: { evict: vi.fn(), gc: vi.fn() },
				query: vi.fn().mockResolvedValue({ data: { experiment: { version: undefined } } }),
				readFragment,
			};
			const route = { query: {} };
			const callback = vi.fn();

			initializeExperiment(cookieStore, apollo, route, 'test_exp', callback, trackEvent);

			expect(readFragment).toHaveBeenCalledWith({
				id: 'Experiment:test_exp',
				fragment: experimentVersionFragment,
			});
			// trackEvent should not be called for undefined version
			expect(trackEvent).not.toHaveBeenCalled();
		});
	});
});
