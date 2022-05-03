import { createMockClient } from 'mock-apollo-client';
import experimentSettingQuery from '@/graphql/query/experimentSetting.graphql';
import experimentIdsQuery from '@/graphql/query/experimentIds.graphql';
import Experiment from '@/api/fixtures/Experiment';
import CookieStore from '@/util/cookieStore';
import * as expUtils from '@/util/experimentUtils';
import expResolverFactory from '@/api/localResolvers/experiment';
import clearDocumentCookies from '../../../setup/clearDocumentCookies';

function getExperimentContext(data = {}, activeExperiments = ['ab']) {
	// default hash-code is 1753809052
	const exp = {
		id: 'ab',
		distribution: {
			control: 0.5,
			variant: 0.5,
		},
		...data
	};
	const client = createMockClient();
	// Mock the active experiments array
	client.setRequestHandler(experimentIdsQuery, () => Promise.resolve({
		data: {
			general: {
				activeExperiments: {
					key: 'ui.active_experiments',
					value: JSON.stringify(activeExperiments.join(',')),
				},
			},
		},
	}));
	// Mock the experiment setting
	client.setRequestHandler(experimentSettingQuery, () => Promise.resolve({
		data: {
			general: {
				uiExperimentSetting: {
					key: `uiexp.${exp.id}`,
					value: JSON.stringify(JSON.stringify(exp))
				}
			}
		}
	}));
	return { client };
}

describe('experiment.js', () => {
	describe('Query.experiment', () => {
		let assignVersionSpy;

		beforeEach(() => {
			assignVersionSpy = jest.spyOn(expUtils, 'assignVersion');
		});

		afterEach(() => {
			assignVersionSpy.mockClear();
			clearDocumentCookies();
		});

		it('Returns a null assignment when experiment id is unknown', async () => {
			const cookieStore = new CookieStore();
			const { resolvers } = expResolverFactory({ cookieStore });
			const context = getExperimentContext();

			const result = await resolvers.Query.experiment(null, { id: 'unknown' }, context);
			expect(result).toEqual(Experiment({ id: 'unknown', version: null }));
		});

		it('Returns a null assignment when experiment is not enabled', async () => {
			const cookieStore = new CookieStore();
			const context = getExperimentContext({}, []);
			const { resolvers } = expResolverFactory({ cookieStore });

			const result = await resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(result).toEqual(Experiment({ id: 'ab', version: null }));
		});

		it('Removes inactive experiments from uiab cookie', async () => {
			const cookieStore = new CookieStore({ uiab: 'ab:variant:1753809052:n|ef:z|gh:w:1234' });
			const { resolvers } = expResolverFactory({ cookieStore });
			const context = getExperimentContext({}, ['ab', 'cd']);

			await resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(cookieStore.get('uiab')).toEqual('ab:variant:1753809052:n');
		});

		it('Does not remove inactive experiments from uiab cookie if there are no active experiments', async () => {
			const cookieStore = new CookieStore({ uiab: 'ab:variant:1753809052:n|ef:z|gh:w:1234' });
			const { resolvers } = expResolverFactory({ cookieStore });
			const context = getExperimentContext({}, []);

			await resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(cookieStore.get('uiab')).toEqual('ab:variant:1753809052:n|ef:z|gh:w:1234');
		});

		it('Returns the current assignment when it is already set', async () => {
			const cookieStore = new CookieStore({ uiab: 'ab:variant:1753809052' });
			const { resolvers } = expResolverFactory({ cookieStore });
			const context = getExperimentContext();

			const result = await resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(assignVersionSpy).not.toHaveBeenCalled();
			expect(result).toEqual(Experiment({ id: 'ab', version: 'variant' }));
		});

		it('Returns a new assignment when no assigment is set', async () => {
			const cookieStore = new CookieStore();
			const { resolvers } = expResolverFactory({ cookieStore });
			const context = getExperimentContext();

			const result = await resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(assignVersionSpy).toHaveBeenCalled();
			expect(result).toEqual(Experiment({ id: 'ab', version: expect.any(String) }));
			expect(cookieStore.getSetCookies()[0]).toMatch(`ab:${result.version}`);
		});

		it('Returns a new assignment when the distribution changes', async () => {
			const cookieStore = new CookieStore({ uiab: 'ab:variant:1753809052' });
			const { resolvers } = expResolverFactory({ cookieStore });
			const context = getExperimentContext({
				distribution: {
					control: 0.75,
					variant: 0.25,
				},
			});

			const { version } = await resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(assignVersionSpy).toHaveBeenCalled();
			expect(cookieStore.getSetCookies()[0]).toMatch(`ab:${version}`);
		});

		it('Returns a new assignment when currently "unassigned" and the population changes', async () => {
			const cookieStore = new CookieStore({ uiab: 'ab:unassigned:1753809052:0.5' });
			const { resolvers } = expResolverFactory({ cookieStore });
			const context = getExperimentContext({
				population: 0.75,
			});

			const { version } = await resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(assignVersionSpy).toHaveBeenCalled();
			expect(cookieStore.getSetCookies()[0]).toMatch(`ab:${version}:1753809052:0.75`);
		});

		it('Returns the current assignment if already assigned when the population changes', async () => {
			const cookieStore = new CookieStore({ uiab: 'ab:variant:1753809052:0.5' });
			const { resolvers } = expResolverFactory({ cookieStore });
			const context = getExperimentContext({
				population: 0.75,
			});

			const result = await resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(assignVersionSpy).not.toHaveBeenCalled();
			expect(result).toEqual(Experiment({ id: 'ab', version: 'variant' }));
		});

		it('Returns a null assignment when assignVersion returns undefined', async () => {
			const cookieStore = new CookieStore();
			const { resolvers } = expResolverFactory({ cookieStore });
			const context = getExperimentContext({ targets: { users: ['cookied'] } });

			const result = await resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(assignVersionSpy).toHaveBeenCalled();
			expect(result).toEqual(Experiment({ id: 'ab', version: null }));
		});
	});

	describe('Mutation.updateExperimentVersion', () => {
		it('Returns null when version is undefined', () => {
			const cookieStore = new CookieStore();
			const { resolvers } = expResolverFactory({ cookieStore });

			const result = resolvers.Mutation.updateExperimentVersion(null, { id: 'ab' });
			expect(result).toEqual(Experiment({ id: 'ab', version: null }));
		});

		it('Does not make updates to the version if already assigned to the requested version', () => {
			const cookieStore = new CookieStore({ uiab: 'ab:variant' });
			const { resolvers } = expResolverFactory({ cookieStore });

			const result = resolvers.Mutation.updateExperimentVersion(null, { id: 'ab', version: 'variant' });
			expect(result).toEqual(Experiment({ id: 'ab', version: 'variant' }));
			expect(cookieStore.getSetCookies()).toHaveLength(0);
		});

		it('Updates the uiab cookie and returns the new version', () => {
			const cookieStore = new CookieStore({ uiab: 'ab:variant' });
			const { resolvers } = expResolverFactory({ cookieStore });

			const result = resolvers.Mutation.updateExperimentVersion(null, { id: 'ab', version: 'control' });
			expect(result).toEqual(Experiment({ id: 'ab', version: 'control' }));
			expect(cookieStore.getSetCookies()[0]).toMatch('ab:control');
		});
	});
});
