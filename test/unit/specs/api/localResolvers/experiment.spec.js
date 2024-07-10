import * as expUtils from '@/util/experiment/experimentUtils';
import expResolverFactory from '@/api/localResolvers/experiment';
import Experiment from '@/api/fixtures/Experiment';

const EXP_ID = 'test_experiment';
const HASH = 1234;

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

describe('experiment.js', () => {
	describe('Query.experiment', () => {
		let consoleWarnSpy;
		let getActiveExperimentsSpy;
		let getExperimentSettingSpy;
		let getForcedAssignmentSpy;
		let calculateHashSpy;
		let assignVersionForLoginIdSpy;
		let getLoginIdSpy;
		let getCookieAssignmentsSpy;
		let setCookieAssignmentsSpy;

		beforeEach(() => {
			consoleWarnSpy = jest.spyOn(global.console, 'warn').mockImplementation();
			getActiveExperimentsSpy = jest.spyOn(expUtils, 'getActiveExperiments')
				.mockImplementation(() => Promise.resolve([EXP_ID]));
			getExperimentSettingSpy = jest.spyOn(expUtils, 'getExperimentSetting')
				.mockImplementation(() => Promise.resolve(experiment));
			getForcedAssignmentSpy = jest.spyOn(expUtils, 'getForcedAssignment').mockReturnValue(undefined);
			calculateHashSpy = jest.spyOn(expUtils, 'calculateHash').mockReturnValue(HASH);
			assignVersionForLoginIdSpy = jest.spyOn(expUtils, 'assignVersionForLoginId');
			getLoginIdSpy = jest.spyOn(expUtils, 'getLoginId').mockReturnValue(1234);
			getCookieAssignmentsSpy = jest.spyOn(expUtils, 'getCookieAssignments')
				.mockReturnValue(mockCookieAssignments);
			setCookieAssignmentsSpy = jest.spyOn(expUtils, 'setCookieAssignments').mockImplementation();
		});

		afterEach(jest.restoreAllMocks);

		it('should return undefined assignment when active experiments list is empty', async () => {
			const { resolvers } = expResolverFactory({});
			getActiveExperimentsSpy.mockImplementation(() => Promise.resolve([]));

			const result = await resolvers.Query.experiment(null, { id: 'asd' }, {});

			expect(result).toEqual(Experiment({ id: 'asd' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			// eslint-disable-next-line max-len
			expect(consoleWarnSpy).toHaveBeenCalledWith('{"meta":{},"level":"warn","message":"Active experiments list is empty"}');
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(0);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(0);
			expect(calculateHashSpy).toHaveBeenCalledTimes(0);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});

		it('should return undefined assignment when active experiments list is missing experiment', async () => {
			const { resolvers } = expResolverFactory({});

			const result = await resolvers.Query.experiment(null, { id: 'x' }, {});

			expect(result).toEqual(Experiment({ id: 'x' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			// eslint-disable-next-line max-len
			expect(consoleWarnSpy).toHaveBeenCalledWith('{"meta":{},"level":"warn","message":"Experiment is not in active experiments list: x"}');
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(0);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(0);
			expect(calculateHashSpy).toHaveBeenCalledTimes(0);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});

		it('should return undefined assignment when active experiments has similarly named experiment', async () => {
			const { resolvers } = expResolverFactory({});
			getActiveExperimentsSpy.mockImplementation(() => Promise.resolve([`asd_${EXP_ID}`]));

			const result = await resolvers.Query.experiment(null, { id: 'x' }, {});

			expect(result).toEqual(Experiment({ id: 'x' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			// eslint-disable-next-line max-len
			expect(consoleWarnSpy).toHaveBeenCalledWith('{"meta":{},"level":"warn","message":"Experiment is not in active experiments list: x"}');
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(0);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(0);
			expect(calculateHashSpy).toHaveBeenCalledTimes(0);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});

		it('should return undefined assignment when experiment settings are missing', async () => {
			const { resolvers } = expResolverFactory({});
			getExperimentSettingSpy.mockImplementation(() => Promise.resolve({}));

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			// eslint-disable-next-line max-len
			expect(consoleWarnSpy).toHaveBeenCalledWith('{"meta":{},"level":"warn","message":"Experiment setting is missing: test_experiment"}');
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(0);
			expect(calculateHashSpy).toHaveBeenCalledTimes(0);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});

		it('should return current assignment when assignment is forced', async () => {
			const { resolvers } = expResolverFactory({});
			getForcedAssignmentSpy.mockReturnValue({
				id: EXP_ID, version: 'z', hash: HASH, population: 1
			});

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'z' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(1);
			expect(calculateHashSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});

		it('should return new assignment when assignment is forced and hash was unset', async () => {
			const { resolvers } = expResolverFactory({});
			getForcedAssignmentSpy.mockReturnValue({
				id: EXP_ID, version: 'z', population: 1
			});
			assignVersionForLoginIdSpy.mockReturnValue('b');

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(1);
			expect(calculateHashSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});

		it('should return current assignment when assignment is forced and population was unset', async () => {
			const { resolvers } = expResolverFactory({});
			getForcedAssignmentSpy.mockReturnValue({
				id: EXP_ID, version: 'z', hash: HASH
			});

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'z' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(1);
			expect(calculateHashSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});

		it('should return new assignment when assignment is forced and hash changes', async () => {
			const { resolvers } = expResolverFactory({});
			getForcedAssignmentSpy.mockReturnValue({
				id: EXP_ID, version: 'z', hash: HASH, population: 1
			});
			calculateHashSpy.mockReturnValue(1);
			assignVersionForLoginIdSpy.mockReturnValue('b');

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(1);
			expect(calculateHashSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});

		it('should return current assignment when assignment is forced and population changes', async () => {
			const { resolvers } = expResolverFactory({});
			getExperimentSettingSpy.mockImplementation(() => Promise.resolve({ ...experiment, population: 0.5 }));
			getForcedAssignmentSpy.mockReturnValue({
				id: EXP_ID, version: 'z', hash: HASH, population: 1
			});

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'z' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(1);
			expect(calculateHashSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});

		it('should return new assignment when undefined assignment is forced and population changes', async () => {
			const { resolvers } = expResolverFactory({});
			getExperimentSettingSpy.mockImplementation(() => Promise.resolve({ ...experiment, population: 0.5 }));
			getForcedAssignmentSpy.mockReturnValue({
				id: EXP_ID, version: undefined, hash: HASH, population: 1
			});
			assignVersionForLoginIdSpy.mockReturnValue('b');

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(1);
			expect(calculateHashSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});

		it('should return new assignment when unassigned assignment is forced and population changes', async () => {
			const { resolvers } = expResolverFactory({});
			getExperimentSettingSpy.mockImplementation(() => Promise.resolve({ ...experiment, population: 0.5 }));
			getForcedAssignmentSpy.mockReturnValue({
				id: EXP_ID, version: 'unassigned', hash: HASH, population: 1
			});
			assignVersionForLoginIdSpy.mockReturnValue('b');

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(1);
			expect(calculateHashSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});

		it('should return new assignment when assignment is forced and distribution changes', async () => {
			const { resolvers } = expResolverFactory({});
			getExperimentSettingSpy.mockImplementation(() => Promise.resolve({
				...experiment,
				distribution: {
					control: 0.75,
					variant: 0.25,
				}
			}));
			getForcedAssignmentSpy.mockReturnValue({
				id: EXP_ID, version: 'z', hash: HASH, population: 1
			});
			calculateHashSpy.mockRestore();
			assignVersionForLoginIdSpy.mockReturnValue('b');

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});

		it('should return existing assignment when assignment is query forced', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			const mockAssignment = {
				id: EXP_ID, version: 'z', hash: HASH, population: 1, queryForced: true
			};
			const expectedCookieAssignments = { ...mockCookieAssignments, [EXP_ID]: mockAssignment };
			getForcedAssignmentSpy.mockReturnValue(mockAssignment);

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'z' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(1);
			expect(calculateHashSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(1);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledWith(cookieStore, expectedCookieAssignments);
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
			getExperimentSettingSpy.mockImplementation(() => Promise.resolve({ ...experiment, population: 0 }));
			getForcedAssignmentSpy.mockReturnValue(mockAssignment);

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'z' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(1);
			expect(calculateHashSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(1);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledWith(cookieStore, expectedCookieAssignments);
		});

		it('should return existing assignment when assignment is query forced and hash changes', async () => {
			const cookieStore = {};
			const { resolvers } = expResolverFactory({ cookieStore });
			const mockAssignment = {
				id: EXP_ID, version: 'z', hash: HASH, population: 1, queryForced: true
			};
			const expectedCookieAssignments = { ...mockCookieAssignments, [EXP_ID]: { ...mockAssignment, hash: 1 } };
			getForcedAssignmentSpy.mockReturnValue(mockAssignment);
			calculateHashSpy.mockReturnValue(1);

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'z' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(1);
			expect(calculateHashSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(0);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(1);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledWith(cookieStore, expectedCookieAssignments);
		});

		it('should return new assignment when no assignment is forced', async () => {
			const { resolvers } = expResolverFactory({});
			assignVersionForLoginIdSpy.mockReturnValue('b');

			let result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(1);
			expect(calculateHashSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);

			jest.clearAllMocks();

			result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: 'b' }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(1);
			expect(calculateHashSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});

		it('should return undefined assignment when assignment returns undefined', async () => {
			const { resolvers } = expResolverFactory({});
			assignVersionForLoginIdSpy.mockReturnValue(undefined);

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: undefined }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledTimes(1);
			expect(calculateHashSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});

		it('should pass expected params to get forced assignment', async () => {
			const cookieStore = { asd: 1 };
			const route = { qwe: 2 };
			const { resolvers } = expResolverFactory({ cookieStore, route });
			assignVersionForLoginIdSpy.mockReturnValue(undefined);

			const result = await resolvers.Query.experiment(null, { id: EXP_ID }, {});

			expect(result).toEqual(Experiment({ id: EXP_ID, version: undefined }));
			expect(getActiveExperimentsSpy).toHaveBeenCalledTimes(1);
			expect(getExperimentSettingSpy).toHaveBeenCalledTimes(1);
			expect(getForcedAssignmentSpy).toHaveBeenCalledWith(cookieStore, route, EXP_ID, experiment);
			expect(calculateHashSpy).toHaveBeenCalledTimes(1);
			expect(assignVersionForLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getLoginIdSpy).toHaveBeenCalledTimes(1);
			expect(getCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
			expect(setCookieAssignmentsSpy).toHaveBeenCalledTimes(0);
		});
	});
});
