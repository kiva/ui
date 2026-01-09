import {
	getActiveExperiments,
	getExperimentSetting,
	getForcedAssignment,
	calculateHash,
	assignVersionForLoginId,
	getLoginId,
	getCookieAssignments,
	setCookieAssignments,
	cleanupStaleCookieAssignments,
} from '#src/util/experiment/experimentUtils';
import expResolverFactory from '#src/api/localResolvers/experiment';
import Experiment from '#src/api/fixtures/Experiment';

const EXP_ID = 'test_experiment';

const mockCookieAssignments = {
	asd: {
		name: 'asd',
		version: 'y',
	},
	[EXP_ID]: {
		name: EXP_ID,
		version: 'q',
	},
};

const experiment = {
	name: EXP_ID,
	distribution: {
		control: 0.5,
		variant: 0.5,
	},
	population: 1
};

const HASH = calculateHash(experiment);
calculateHash.mockClear();

vi.mock('#src/util/experiment/experimentUtils', async () => {
	const expUtils = await vi.importActual('#src/util/experiment/experimentUtils');
	return {
		getActiveExperiments: vi.fn(() => Promise.resolve([EXP_ID])),
		getExperimentSetting: vi.fn(() => Promise.resolve(experiment)),
		getForcedAssignment: vi.fn(),
		calculateHash: vi.spyOn(expUtils, 'calculateHash'),
		assignVersionForLoginId: vi.spyOn(expUtils, 'assignVersionForLoginId'),
		getLoginId: vi.fn(() => 1234),
		getCookieAssignments: vi.fn(() => mockCookieAssignments),
		setCookieAssignments: vi.fn(),
		cleanupStaleCookieAssignments: vi.fn(),
	};
});

describe('experiment.js', () => {
	it('should return empty object when cookieStore is not provided', () => {
		const result = expResolverFactory({ cookieStore: null });
		expect(result).toEqual({});
	});

	it('should return empty object when cookieStore is undefined', () => {
		const result = expResolverFactory({});
		expect(result).toEqual({});
	});

	describe('Query.experiment', () => {
		let consoleWarnSpy;

		beforeEach(() => {
			consoleWarnSpy = vi.spyOn(global.console, 'warn').mockImplementation();
		});

		afterEach(vi.clearAllMocks);

		it('should return undefined assignment when active experiments list is empty', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			getActiveExperiments.mockImplementationOnce(() => Promise.resolve([]));

			const result = await resolvers.Query.experiment(null, { id: 'asd' }, {});

			expect(result).toEqual(Experiment({ id: 'asd' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			// eslint-disable-next-line max-len
			expect(consoleWarnSpy).toHaveBeenCalledWith('{"meta":{},"level":"warn","message":"Active experiments list is empty"}');
			expect(getExperimentSetting).toHaveBeenCalledTimes(0);
			expect(getForcedAssignment).toHaveBeenCalledTimes(0);
			expect(calculateHash).toHaveBeenCalledTimes(0);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(0);
			expect(getLoginId).toHaveBeenCalledTimes(0);
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
			// Cleanup should NOT be called when active experiments list is empty
			expect(cleanupStaleCookieAssignments).toHaveBeenCalledTimes(0);
		});

		it('should return undefined assignment when active experiments list is missing experiment', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });

			const result = await resolvers.Query.experiment(null, { id: 'x' }, {});

			expect(result).toEqual(Experiment({ id: 'x' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			// eslint-disable-next-line max-len
			expect(consoleWarnSpy).toHaveBeenCalledWith('{"meta":{},"level":"warn","message":"Experiment is not in active experiments list: x"}');
			expect(getExperimentSetting).toHaveBeenCalledTimes(0);
			expect(getForcedAssignment).toHaveBeenCalledTimes(0);
			expect(calculateHash).toHaveBeenCalledTimes(0);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(0);
			expect(getLoginId).toHaveBeenCalledTimes(0);
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
			// Cleanup should be called with cookieStore and active experiments list
			expect(cleanupStaleCookieAssignments).toHaveBeenCalledTimes(1);
			expect(cleanupStaleCookieAssignments).toHaveBeenCalledWith(cookieStore, [EXP_ID]);
		});

		it('should return undefined assignment when active experiments has similarly named experiment', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			getActiveExperiments.mockImplementationOnce(() => Promise.resolve([`asd_${EXP_ID}`]));

			const result = await resolvers.Query.experiment(null, { id: 'x' }, {});

			expect(result).toEqual(Experiment({ id: 'x' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			// eslint-disable-next-line max-len
			expect(consoleWarnSpy).toHaveBeenCalledWith('{"meta":{},"level":"warn","message":"Experiment is not in active experiments list: x"}');
			expect(getExperimentSetting).toHaveBeenCalledTimes(0);
			expect(getForcedAssignment).toHaveBeenCalledTimes(0);
			expect(calculateHash).toHaveBeenCalledTimes(0);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(0);
			expect(getLoginId).toHaveBeenCalledTimes(0);
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
			// Cleanup should be called with correct active experiments list
			expect(cleanupStaleCookieAssignments).toHaveBeenCalledTimes(1);
			expect(cleanupStaleCookieAssignments).toHaveBeenCalledWith(cookieStore, [`asd_${EXP_ID}`]);
		});

		it('should return undefined assignment when experiment settings are missing', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			getExperimentSetting.mockImplementationOnce(() => Promise.resolve({}));

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			// eslint-disable-next-line max-len
			expect(consoleWarnSpy).toHaveBeenCalledWith('{"meta":{},"level":"warn","message":"Experiment setting is missing: test_experiment"}');
			expect(getForcedAssignment).toHaveBeenCalledTimes(0);
			expect(calculateHash).toHaveBeenCalledTimes(0);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(0);
			expect(getLoginId).toHaveBeenCalledTimes(0);
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
		});

		it('should return current assignment when assignment is forced', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			getForcedAssignment.mockReturnValueOnce({
				id: EXP_ID, version: 'z', hash: HASH, population: 1
			});

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'z' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(0);
			expect(getLoginId).toHaveBeenCalledTimes(0);
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
		});

		it('should return new assignment when assignment is forced and hash was unset', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			getForcedAssignment.mockReturnValueOnce({
				id: EXP_ID, version: 'z', population: 1
			});
			assignVersionForLoginId.mockReturnValueOnce('b');

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
			expect(getLoginId).toHaveBeenCalledTimes(1);
			// Default behavior: save to cookie
			expect(getCookieAssignments).toHaveBeenCalledTimes(1);
			expect(setCookieAssignments).toHaveBeenCalledTimes(1);
		});

		it('should return current assignment when assignment is forced and population was unset', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			getForcedAssignment.mockReturnValueOnce({
				id: EXP_ID, version: 'z', hash: HASH
			});

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'z' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(0);
			expect(getLoginId).toHaveBeenCalledTimes(0);
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
		});

		it('should return new assignment when assignment is forced and hash changes', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			getForcedAssignment.mockReturnValueOnce({
				id: EXP_ID, version: 'z', hash: HASH, population: 1
			});
			calculateHash.mockReturnValueOnce(1);
			assignVersionForLoginId.mockReturnValueOnce('b');

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
			expect(getLoginId).toHaveBeenCalledTimes(1);
			// Default behavior: save to cookie
			expect(getCookieAssignments).toHaveBeenCalledTimes(1);
			expect(setCookieAssignments).toHaveBeenCalledTimes(1);
		});

		it('should return current assignment when assignment is forced and population changes', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			getExperimentSetting.mockImplementationOnce(() => Promise.resolve({ ...experiment, population: 0.5 }));
			getForcedAssignment.mockReturnValueOnce({
				id: EXP_ID, version: 'z', hash: HASH, population: 1
			});

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'z' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(0);
			expect(getLoginId).toHaveBeenCalledTimes(0);
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
		});

		it('should return new assignment when undefined assignment is forced and population changes', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			getExperimentSetting.mockImplementationOnce(() => Promise.resolve({ ...experiment, population: 0.5 }));
			getForcedAssignment.mockReturnValueOnce({
				id: EXP_ID, version: undefined, hash: HASH, population: 1
			});
			assignVersionForLoginId.mockReturnValueOnce('b');

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
			expect(getLoginId).toHaveBeenCalledTimes(1);
			// Default behavior: save to cookie
			expect(getCookieAssignments).toHaveBeenCalledTimes(1);
			expect(setCookieAssignments).toHaveBeenCalledTimes(1);
		});

		it('should return new assignment when unassigned assignment is forced and population changes', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			getExperimentSetting.mockImplementationOnce(() => Promise.resolve({ ...experiment, population: 0.5 }));
			getForcedAssignment.mockReturnValueOnce({
				id: EXP_ID, version: 'unassigned', hash: HASH, population: 1
			});
			assignVersionForLoginId.mockReturnValueOnce('b');

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
			expect(getLoginId).toHaveBeenCalledTimes(1);
			// Default behavior: save to cookie
			expect(getCookieAssignments).toHaveBeenCalledTimes(1);
			expect(setCookieAssignments).toHaveBeenCalledTimes(1);
		});

		it('should return new assignment when assignment is forced and distribution changes', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			getExperimentSetting.mockImplementationOnce(() => Promise.resolve({
				...experiment,
				distribution: {
					control: 0.75,
					variant: 0.25,
				}
			}));
			getForcedAssignment.mockReturnValueOnce({
				id: EXP_ID, version: 'z', hash: HASH, population: 1
			});
			assignVersionForLoginId.mockReturnValueOnce('b');

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
			expect(getLoginId).toHaveBeenCalledTimes(1);
			// Default behavior: save to cookie
			expect(getCookieAssignments).toHaveBeenCalledTimes(1);
			expect(setCookieAssignments).toHaveBeenCalledTimes(1);
		});

		it('should return existing assignment when assignment is query forced', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			const mockAssignment = {
				id: EXP_ID, version: 'z', hash: HASH, population: 1, queryForced: true
			};
			const expectedCookieAssignments = { ...mockCookieAssignments, [EXP_ID]: mockAssignment };
			getForcedAssignment.mockReturnValueOnce(mockAssignment);

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'z' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(0);
			expect(getLoginId).toHaveBeenCalledTimes(0);
			expect(getCookieAssignments).toHaveBeenCalledTimes(1);
			expect(setCookieAssignments).toHaveBeenCalledWith(cookieStore, expectedCookieAssignments);
		});

		it('should return existing assignment when assignment is query forced and population is 0', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			const mockAssignment = {
				id: EXP_ID, version: 'z', hash: HASH, population: 1, queryForced: true
			};
			const expectedCookieAssignments = {
				...mockCookieAssignments,
				[EXP_ID]: {
					...mockAssignment,
					population: 0,
				}
			};
			getExperimentSetting.mockImplementationOnce(() => Promise.resolve({ ...experiment, population: 0 }));
			getForcedAssignment.mockReturnValueOnce(mockAssignment);

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'z' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(0);
			expect(getLoginId).toHaveBeenCalledTimes(0);
			expect(getCookieAssignments).toHaveBeenCalledTimes(1);
			expect(setCookieAssignments).toHaveBeenCalledWith(cookieStore, expectedCookieAssignments);
		});

		it('should return existing assignment when assignment is query forced and hash changes', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			const mockAssignment = {
				id: EXP_ID, version: 'z', hash: HASH, population: 1, queryForced: true
			};
			const expectedCookieAssignments = { ...mockCookieAssignments, [EXP_ID]: { ...mockAssignment, hash: 1 } };
			getForcedAssignment.mockReturnValueOnce(mockAssignment);
			calculateHash.mockReturnValueOnce(1);

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'z' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(0);
			expect(getLoginId).toHaveBeenCalledTimes(0);
			expect(getCookieAssignments).toHaveBeenCalledTimes(1);
			expect(setCookieAssignments).toHaveBeenCalledWith(cookieStore, expectedCookieAssignments);
		});

		it('should return new assignment and save to cookie when no forced assignment (default)', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			assignVersionForLoginId.mockReturnValue('b');

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
			expect(getLoginId).toHaveBeenCalledTimes(1);
			// Default behavior: save to cookie
			expect(getCookieAssignments).toHaveBeenCalledTimes(1);
			expect(setCookieAssignments).toHaveBeenCalledTimes(1);
		});

		it('should return undefined assignment when assignment returns undefined and save to cookie', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			assignVersionForLoginId.mockReturnValueOnce(undefined);

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: undefined }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
			expect(getLoginId).toHaveBeenCalledTimes(1);
			// Default behavior: save to cookie (even undefined assignments)
			expect(getCookieAssignments).toHaveBeenCalledTimes(1);
			expect(setCookieAssignments).toHaveBeenCalledTimes(1);
		});

		it('should pass expected params to get forced assignment', async () => {
			const cookieStore = { asd: 1 };
			const route = { qwe: 2 };
			const { resolvers } = expResolverFactory({ cookieStore, route });
			assignVersionForLoginId.mockReturnValueOnce(undefined);

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: undefined }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledWith(cookieStore, route, EXP_ID, experiment, undefined);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
			expect(getLoginId).toHaveBeenCalledTimes(1);
			// Default behavior: save to cookie
			expect(getCookieAssignments).toHaveBeenCalledTimes(1);
			expect(setCookieAssignments).toHaveBeenCalledTimes(1);
		});

		it('should pass expected params to get login ID', async () => {
			const cookieStore = { asd: 1 };
			const { resolvers } = expResolverFactory({ cookieStore });
			assignVersionForLoginId.mockReturnValueOnce(undefined);

			await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(getLoginId).toHaveBeenCalledWith(cookieStore);
		});

		describe('userIdExperiment flag', () => {
			it('should NOT save to cookie when userIdExperiment is true', async () => {
				const cookieStore = {};
				const { resolvers } = expResolverFactory({ cookieStore });
				getExperimentSetting.mockImplementationOnce(() => Promise.resolve({
					...experiment,
					userIdExperiment: true
				}));
				assignVersionForLoginId.mockReturnValueOnce('b');

				const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

				expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
				expect(getActiveExperiments).toHaveBeenCalledTimes(1);
				expect(getExperimentSetting).toHaveBeenCalledTimes(1);
				expect(getForcedAssignment).toHaveBeenCalledTimes(1);
				expect(calculateHash).toHaveBeenCalledTimes(1);
				expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
				expect(getLoginId).toHaveBeenCalledTimes(1);
				// userIdExperiment: should NOT save to cookie
				expect(getCookieAssignments).toHaveBeenCalledTimes(0);
				expect(setCookieAssignments).toHaveBeenCalledTimes(0);
			});

			it('should save to cookie when userIdExperiment is false', async () => {
				const cookieStore = {};
				const { resolvers } = expResolverFactory({ cookieStore });
				getExperimentSetting.mockImplementationOnce(() => Promise.resolve({
					...experiment,
					userIdExperiment: false
				}));
				assignVersionForLoginId.mockReturnValueOnce('b');

				const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

				expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
				expect(getActiveExperiments).toHaveBeenCalledTimes(1);
				expect(getExperimentSetting).toHaveBeenCalledTimes(1);
				expect(getForcedAssignment).toHaveBeenCalledTimes(1);
				expect(calculateHash).toHaveBeenCalledTimes(1);
				expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
				expect(getLoginId).toHaveBeenCalledTimes(1);
				// userIdExperiment: false means save to cookie (default behavior)
				expect(getCookieAssignments).toHaveBeenCalledTimes(1);
				expect(setCookieAssignments).toHaveBeenCalledTimes(1);
			});

			it('should save to cookie when userIdExperiment is undefined (default)', async () => {
				const cookieStore = {};
				const { resolvers } = expResolverFactory({ cookieStore });
				// experiment object doesn't have userIdExperiment defined
				assignVersionForLoginId.mockReturnValueOnce('b');

				const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

				expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
				expect(getActiveExperiments).toHaveBeenCalledTimes(1);
				expect(getExperimentSetting).toHaveBeenCalledTimes(1);
				expect(getForcedAssignment).toHaveBeenCalledTimes(1);
				expect(calculateHash).toHaveBeenCalledTimes(1);
				expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
				expect(getLoginId).toHaveBeenCalledTimes(1);
				// userIdExperiment: undefined means save to cookie (default behavior)
				expect(getCookieAssignments).toHaveBeenCalledTimes(1);
				expect(setCookieAssignments).toHaveBeenCalledTimes(1);
			});

			it('should still save to cookie via setuiab even when userIdExperiment is true', async () => {
				const cookieStore = {};
				const { resolvers } = expResolverFactory({ cookieStore });
				getExperimentSetting.mockImplementationOnce(() => Promise.resolve({
					...experiment,
					userIdExperiment: true
				}));
				const mockAssignment = {
					id: EXP_ID, version: 'forced_variant', hash: HASH, population: 1, queryForced: true
				};
				const expectedCookieAssignments = { ...mockCookieAssignments, [EXP_ID]: mockAssignment };
				getForcedAssignment.mockReturnValueOnce(mockAssignment);

				const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

				expect(result).toEqual(Experiment({ id: EXP_ID, version: 'forced_variant' }));
				expect(getActiveExperiments).toHaveBeenCalledTimes(1);
				expect(getExperimentSetting).toHaveBeenCalledTimes(1);
				expect(getForcedAssignment).toHaveBeenCalledTimes(1);
				expect(calculateHash).toHaveBeenCalledTimes(1);
				// setuiab should still save to cookie even for userIdExperiment
				expect(getCookieAssignments).toHaveBeenCalledTimes(1);
				expect(setCookieAssignments).toHaveBeenCalledWith(cookieStore, expectedCookieAssignments);
			});

			// eslint-disable-next-line max-len
			it('should remove existing cookie and NOT save new assignment when userIdExperiment is true and hash changes', async () => {
				const cookieStore = {};
				const { resolvers } = expResolverFactory({ cookieStore });
				getExperimentSetting.mockImplementationOnce(() => Promise.resolve({
					...experiment,
					userIdExperiment: true
				}));
				// Existing cookie assignment (will be removed because userIdExperiment is true)
				getForcedAssignment.mockReturnValueOnce({
					id: EXP_ID, version: 'z', hash: HASH, population: 1
				});
				calculateHash.mockReturnValueOnce(1);
				assignVersionForLoginId.mockReturnValueOnce('b');

				const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

				expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
				expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
				expect(getLoginId).toHaveBeenCalledTimes(1);
				// userIdExperiment: should remove existing cookie but NOT save new assignment
				// getCookieAssignments called once to get current assignments for removal
				expect(getCookieAssignments).toHaveBeenCalledTimes(1);
				// setCookieAssignments called once to remove the existing assignment
				expect(setCookieAssignments).toHaveBeenCalledTimes(1);
				// Verify the experiment was removed from cookie
				const setCookieCall = setCookieAssignments.mock.calls[0];
				expect(setCookieCall[1][EXP_ID]).toBeUndefined();
			});

			it('should remove existing cookie assignment and recalculate when userIdExperiment is true', async () => {
				// When experiment transitions to userIdExperiment, existing cookie assignment should be removed
				// and assignment recalculated based on current loginId
				const cookieStore = {};
				const { resolvers } = expResolverFactory({ cookieStore });
				getExperimentSetting.mockImplementationOnce(() => Promise.resolve({
					...experiment,
					userIdExperiment: true
				}));
				// Existing cookie assignment with matching hash (from when it was a regular experiment)
				getForcedAssignment.mockReturnValueOnce({
					id: EXP_ID, version: 'cookie_variant', hash: HASH, population: 1
				});
				// Ensure getCookieAssignments returns an object containing this experiment
				getCookieAssignments.mockReturnValueOnce({
					[EXP_ID]: {
						id: EXP_ID, version: 'cookie_variant', hash: HASH, population: 1
					}
				});
				assignVersionForLoginId.mockReturnValueOnce('new_variant');

				const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

				// Returns recalculated value based on loginId, NOT the stale cookie value
				expect(result).toEqual(Experiment({ id: EXP_ID, version: 'new_variant' }));
				// Should recalculate based on loginId
				expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
				expect(getLoginId).toHaveBeenCalledTimes(1);
				// Should remove the existing cookie assignment (setCookieAssignments called once)
				expect(getCookieAssignments).toHaveBeenCalledTimes(1);
				expect(setCookieAssignments).toHaveBeenCalledTimes(1);
				// Verify the cookie was updated with the experiment removed
				const setCookieCall = setCookieAssignments.mock.calls[0];
				expect(setCookieCall[0]).toBe(cookieStore);
				expect(setCookieCall[1][EXP_ID]).toBeUndefined();
			});
		});

		describe('headerForced experiments', () => {
			it('should return header forced assignment without saving to cookie', async () => {
				const cookieStore = {};
				const { resolvers } = expResolverFactory({ cookieStore });
				getForcedAssignment.mockReturnValueOnce({
					id: EXP_ID, version: 'header_variant', hash: HASH, population: 1, headerForced: true
				});

				const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

				expect(result).toEqual(Experiment({ id: EXP_ID, version: 'header_variant' }));
				expect(assignVersionForLoginId).toHaveBeenCalledTimes(0);
				expect(getLoginId).toHaveBeenCalledTimes(0);
				// headerForced should NOT save to cookie
				expect(getCookieAssignments).toHaveBeenCalledTimes(0);
				expect(setCookieAssignments).toHaveBeenCalledTimes(0);
			});

			it('should return header forced assignment without re-assignment even if hash changes', async () => {
				const cookieStore = {};
				const { resolvers } = expResolverFactory({ cookieStore });
				getForcedAssignment.mockReturnValueOnce({
					id: EXP_ID, version: 'header_variant', hash: 999, population: 1, headerForced: true
				});
				calculateHash.mockReturnValueOnce(1);

				const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

				expect(result).toEqual(Experiment({ id: EXP_ID, version: 'header_variant' }));
				// Should NOT trigger re-assignment for header forced
				expect(assignVersionForLoginId).toHaveBeenCalledTimes(0);
				expect(getLoginId).toHaveBeenCalledTimes(0);
				expect(getCookieAssignments).toHaveBeenCalledTimes(0);
				expect(setCookieAssignments).toHaveBeenCalledTimes(0);
			});
		});
	});
});
