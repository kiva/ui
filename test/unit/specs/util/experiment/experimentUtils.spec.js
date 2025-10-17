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
	getForcedAssignment,
	getLoginId,
	assignAllActiveExperiments,
	handleSetuiabAndExperimentTracking,
	getExperimentEnabledFromCache,
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

		it('should handle empty assignments', () => {
			const cookieStore = new CookieStore();

			setCookieAssignments(cookieStore);

			expect(cookieStore.getSetCookies()[0]).toBe(undefined);

			setCookieAssignments(cookieStore, []);

			expect(cookieStore.getSetCookies()[0]).toBe(undefined);
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
				queryForced: true
			});

			result = getForcedAssignment(cookieStore, '', 'qwe', experimentSetting);

			expect(result).toEqual({
				...experimentSetting,
				version: 'a',
				hash: hash2,
				queryForced: false
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
				queryForced: true,
			});
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
	});

	describe('getExperimentEnabledFromCache', () => {
		const experimentKey = 'test-experiment';

		it('should return true when experiment version is "b"', () => {
			const mockApollo = {
				readQuery: vi.fn().mockReturnValue({
					experiment: {
						version: 'b'
					}
				})
			};

			const result = getExperimentEnabledFromCache(mockApollo, experimentKey);

			expect(mockApollo.readQuery).toHaveBeenCalledWith({
				query: experimentAssignmentQuery,
				variables: { id: experimentKey }
			});
			expect(result).toBe(true);
		});

		it('should return false when experiment version is "a"', () => {
			const mockApollo = {
				readQuery: vi.fn().mockReturnValue({
					experiment: {
						version: 'a'
					}
				})
			};

			const result = getExperimentEnabledFromCache(mockApollo, experimentKey);

			expect(mockApollo.readQuery).toHaveBeenCalledWith({
				query: experimentAssignmentQuery,
				variables: { id: experimentKey }
			});
			expect(result).toBe(false);
		});

		it('should return false when experiment version is "control"', () => {
			const mockApollo = {
				readQuery: vi.fn().mockReturnValue({
					experiment: {
						version: 'control'
					}
				})
			};

			const result = getExperimentEnabledFromCache(mockApollo, experimentKey);

			expect(result).toBe(false);
		});

		it('should return false when experiment version is undefined', () => {
			const mockApollo = {
				readQuery: vi.fn().mockReturnValue({
					experiment: {
						version: undefined
					}
				})
			};

			const result = getExperimentEnabledFromCache(mockApollo, experimentKey);

			expect(result).toBe(false);
		});

		it('should return false when experiment is undefined', () => {
			const mockApollo = {
				readQuery: vi.fn().mockReturnValue({
					experiment: undefined
				})
			};

			const result = getExperimentEnabledFromCache(mockApollo, experimentKey);

			expect(result).toBe(false);
		});

		it('should return false when readQuery returns null', () => {
			const mockApollo = {
				readQuery: vi.fn().mockReturnValue(null)
			};

			const result = getExperimentEnabledFromCache(mockApollo, experimentKey);

			expect(result).toBe(false);
		});

		it('should return false when readQuery throws an error', () => {
			const mockApollo = {
				readQuery: vi.fn().mockImplementation(() => {
					throw new Error('Cache miss');
				})
			};

			const result = getExperimentEnabledFromCache(mockApollo, experimentKey);

			expect(mockApollo.readQuery).toHaveBeenCalledWith({
				query: experimentAssignmentQuery,
				variables: { id: experimentKey }
			});
			expect(result).toBe(false);
		});

		it('should return false when experiment data is empty object', () => {
			const mockApollo = {
				readQuery: vi.fn().mockReturnValue({})
			};

			const result = getExperimentEnabledFromCache(mockApollo, experimentKey);

			expect(result).toBe(false);
		});

		it('should return false when version is "unassigned"', () => {
			const mockApollo = {
				readQuery: vi.fn().mockReturnValue({
					experiment: {
						version: 'unassigned'
					}
				})
			};

			const result = getExperimentEnabledFromCache(mockApollo, experimentKey);

			expect(result).toBe(false);
		});

		it('should return false when version is empty string', () => {
			const mockApollo = {
				readQuery: vi.fn().mockReturnValue({
					experiment: {
						version: ''
					}
				})
			};

			const result = getExperimentEnabledFromCache(mockApollo, experimentKey);

			expect(result).toBe(false);
		});
	});

	describe('handleSetuiabAndExperimentTracking', () => {
		const experimentKey = 'test-experiment';
		const trackingAction = 'test-action';

		it('should not query when setuiab is not present in route', async () => {
			const mockTrackEvent = vi.fn();
			const mockApollo = {
				query: vi.fn(),
				readFragment: vi.fn().mockReturnValue({ version: 'control' })
			};
			const route = { query: {} };

			const result = await handleSetuiabAndExperimentTracking({
				apollo: mockApollo,
				trackEvent: mockTrackEvent,
				route,
				experimentKey,
				trackingAction,
			});

			expect(mockApollo.query).not.toHaveBeenCalled();
			expect(mockApollo.readFragment).toHaveBeenCalledWith({
				id: `Experiment:${experimentKey}`,
				fragment: experimentVersionFragment
			});
			expect(mockTrackEvent).toHaveBeenCalledWith(
				'event-tracking',
				trackingAction,
				'control',
				undefined
			);
			expect(result).toBe(false);
		});

		it('should query when setuiab is present in route', async () => {
			const mockTrackEvent = vi.fn();
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: {
						experiment: {
							version: 'b'
						}
					}
				}),
				readFragment: vi.fn().mockReturnValue({ version: 'control' })
			};
			const route = { query: { setuiab: 'test-experiment.b' } };

			const result = await handleSetuiabAndExperimentTracking({
				apollo: mockApollo,
				trackEvent: mockTrackEvent,
				route,
				experimentKey,
				trackingAction,
			});

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: experimentAssignmentQuery,
				variables: { id: experimentKey },
				fetchPolicy: 'network-only'
			});
			expect(mockApollo.readFragment).toHaveBeenCalledWith({
				id: `Experiment:${experimentKey}`,
				fragment: experimentVersionFragment
			});
			expect(mockTrackEvent).toHaveBeenCalledWith(
				'event-tracking',
				trackingAction,
				'control',
				undefined
			);
			expect(result).toBe(true);
		});

		it('should return true when assignment data version is "b"', async () => {
			const mockTrackEvent = vi.fn();
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: {
						experiment: {
							version: 'b'
						}
					}
				}),
				readFragment: vi.fn().mockReturnValue({ version: 'a' })
			};
			const route = { query: { setuiab: 'test' } };

			const result = await handleSetuiabAndExperimentTracking({
				apollo: mockApollo,
				trackEvent: mockTrackEvent,
				route,
				experimentKey,
				trackingAction,
			});

			expect(result).toBe(true);
		});

		it('should return false when assignment data version is not "b"', async () => {
			const mockTrackEvent = vi.fn();
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: {
						experiment: {
							version: 'a'
						}
					}
				}),
				readFragment: vi.fn().mockReturnValue({ version: 'control' })
			};
			const route = { query: { setuiab: 'test' } };

			const result = await handleSetuiabAndExperimentTracking({
				apollo: mockApollo,
				trackEvent: mockTrackEvent,
				route,
				experimentKey,
				trackingAction,
			});

			expect(result).toBe(false);
		});

		it('should return true when cached experiment version is "b"', async () => {
			const mockTrackEvent = vi.fn();
			const mockApollo = {
				query: vi.fn(),
				readFragment: vi.fn().mockReturnValue({ version: 'b' })
			};
			const route = { query: {} };

			const result = await handleSetuiabAndExperimentTracking({
				apollo: mockApollo,
				trackEvent: mockTrackEvent,
				route,
				experimentKey,
				trackingAction,
			});

			expect(result).toBe(true);
		});

		it('should handle query error and continue with cached assignment', async () => {
			const mockTrackEvent = vi.fn();
			const mockApollo = {
				query: vi.fn().mockRejectedValue(new Error('Network error')),
				readFragment: vi.fn().mockReturnValue({ version: 'control' })
			};
			const route = { query: { setuiab: 'test' } };

			const result = await handleSetuiabAndExperimentTracking({
				apollo: mockApollo,
				trackEvent: mockTrackEvent,
				route,
				experimentKey,
				trackingAction,
			});

			expect(mockApollo.query).toHaveBeenCalled();
			expect(mockTrackEvent).toHaveBeenCalledWith(
				'event-tracking',
				trackingAction,
				'control',
				undefined
			);
			expect(result).toBe(false);
		});

		it('should handle undefined route', async () => {
			const mockTrackEvent = vi.fn();
			const mockApollo = {
				query: vi.fn(),
				readFragment: vi.fn().mockReturnValue({ version: 'a' })
			};

			const result = await handleSetuiabAndExperimentTracking({
				apollo: mockApollo,
				trackEvent: mockTrackEvent,
				route: undefined,
				experimentKey,
				trackingAction,
			});

			expect(mockApollo.query).not.toHaveBeenCalled();
			expect(mockTrackEvent).toHaveBeenCalled();
			expect(result).toBe(false);
		});

		it('should handle undefined experiment version', async () => {
			const mockTrackEvent = vi.fn();
			const mockApollo = {
				query: vi.fn(),
				readFragment: vi.fn().mockReturnValue({ version: undefined })
			};
			const route = { query: {} };

			const result = await handleSetuiabAndExperimentTracking({
				apollo: mockApollo,
				trackEvent: mockTrackEvent,
				route,
				experimentKey,
				trackingAction,
			});

			expect(mockTrackEvent).not.toHaveBeenCalled();
			expect(result).toBe(false);
		});

		it('should handle unassigned experiment version', async () => {
			const mockTrackEvent = vi.fn();
			const mockApollo = {
				query: vi.fn(),
				readFragment: vi.fn().mockReturnValue({ version: 'unassigned' })
			};
			const route = { query: {} };

			const result = await handleSetuiabAndExperimentTracking({
				apollo: mockApollo,
				trackEvent: mockTrackEvent,
				route,
				experimentKey,
				trackingAction,
			});

			expect(mockTrackEvent).not.toHaveBeenCalled();
			expect(result).toBe(false);
		});

		it('should prioritize assignment data over cached experiment version', async () => {
			const mockTrackEvent = vi.fn();
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: {
						experiment: {
							version: 'a'
						}
					}
				}),
				readFragment: vi.fn().mockReturnValue({ version: 'b' })
			};
			const route = { query: { setuiab: 'test' } };

			const result = await handleSetuiabAndExperimentTracking({
				apollo: mockApollo,
				trackEvent: mockTrackEvent,
				route,
				experimentKey,
				trackingAction,
			});

			expect(result).toBe(false); // assignment data version 'a' takes priority
		});

		it('should handle empty assignment data', async () => {
			const mockTrackEvent = vi.fn();
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: {}
				}),
				readFragment: vi.fn().mockReturnValue({ version: 'b' })
			};
			const route = { query: { setuiab: 'test' } };

			const result = await handleSetuiabAndExperimentTracking({
				apollo: mockApollo,
				trackEvent: mockTrackEvent,
				route,
				experimentKey,
				trackingAction,
			});

			expect(result).toBe(true); // falls back to cached version 'b'
		});
	});
});
