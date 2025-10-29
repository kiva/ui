import {
	getActiveExperiments,
	getExperimentSetting,
	getForcedAssignment,
	calculateHash,
	assignVersionForLoginId,
	getLoginId,
	getCookieAssignments,
	setCookieAssignments,
} from '../../../../../src/util/experiment/experimentUtils';
import expResolverFactory from '../../../../../src/api/localResolvers/experiment';
import Experiment from '../../../../../src/api/fixtures/Experiment';

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
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
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
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
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
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
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
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
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
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
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

		it('should return new assignment when no assignment is forced', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			assignVersionForLoginId.mockReturnValue('b');

			let result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
			expect(getLoginId).toHaveBeenCalledTimes(1);
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);

			vi.clearAllMocks();

			result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperiments).toHaveBeenCalledTimes(1);
			expect(getExperimentSetting).toHaveBeenCalledTimes(1);
			expect(getForcedAssignment).toHaveBeenCalledTimes(1);
			expect(calculateHash).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginId).toHaveBeenCalledTimes(1);
			expect(getLoginId).toHaveBeenCalledTimes(1);
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
		});

		it('should return undefined assignment when assignment returns undefined', async () => {
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
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
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
			expect(getCookieAssignments).toHaveBeenCalledTimes(0);
			expect(setCookieAssignments).toHaveBeenCalledTimes(0);
		});
	});
});
