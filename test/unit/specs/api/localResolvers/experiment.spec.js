import _set from 'lodash/set';
import * as expUtils from '@/util/experimentUtils';
import expResolverFactory from '@/api/localResolvers/experiment';
import Cookie from '../../../fixtures/cookie-universal.mock';

function Experiment(id, version) {
	return { id, version, __typename: 'Experiment' };
}

function getExperimentContext(data = {}) {
	const context = {};
	// default hash-code is 1753809052
	const exp = {
		id: 'ab',
		enabled: true,
		startTime: Date.now() - 2000,
		endTime: Date.now() + 5000,
		distribution: {
			control: 0.5,
			variant: 0.5,
		},
		...data
	};
	_set(context, `cache.data.data['Setting:uiexp.${exp.id}'].value`, JSON.stringify(JSON.stringify(exp)));
	return context;
}

describe('experiment.js', () => {
	describe('Query.experiment', () => {
		let assignVersionSpy;

		beforeEach(() => {
			assignVersionSpy = jest.spyOn(expUtils, 'assignVersion');
		});

		afterEach(() => {
			assignVersionSpy.mockClear();
		});

		it('Returns a null assignment when experiment id is unknown', () => {
			const cookies = Cookie();
			const { resolvers } = expResolverFactory({ cookies });

			const result = resolvers.Query.experiment(null, { id: 'ab' }, {});
			expect(result).toEqual(Experiment('ab', null));
		});

		it('Returns a null assignment when experiment is not enabled', () => {
			const context = getExperimentContext({ enabled: false });
			const cookies = Cookie();
			const { resolvers } = expResolverFactory({ cookies });

			const result = resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(result).toEqual(Experiment('ab', null));
		});

		it('Returns the current assignment when it is already set', () => {
			const cookies = Cookie({ uiab: 'ab:variant:1753809052' });
			const { resolvers } = expResolverFactory({ cookies });
			const context = getExperimentContext();

			const result = resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(assignVersionSpy).not.toHaveBeenCalled();
			expect(result).toEqual(Experiment('ab', 'variant'));
		});

		it('Returns a new assignment when no assigment is set', () => {
			const cookies = Cookie();
			const { resolvers } = expResolverFactory({ cookies });
			const context = getExperimentContext();

			const result = resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(assignVersionSpy).toHaveBeenCalled();
			expect(result).toEqual(Experiment('ab', expect.any(String)));
			expect(cookies.getSetCookie('uiab')).toMatch(`ab:${result.version}`);
		});

		it('Returns a new assignment when the distribution changes', () => {
			const cookies = Cookie({ uiab: 'ab:variant:1753809052' });
			const { resolvers } = expResolverFactory({ cookies });
			const context = getExperimentContext({
				distribution: {
					control: 0.75,
					variant: 0.25,
				},
			});

			const { version } = resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(assignVersionSpy).toHaveBeenCalled();
			expect(cookies.getSetCookie('uiab')).toMatch(`ab:${version}`);
		});

		it('Returns a new assignment when currently "unassigned" and the population changes', () => {
			const cookies = Cookie({ uiab: 'ab:unassigned:1753809052:0.5' });
			const { resolvers } = expResolverFactory({ cookies });
			const context = getExperimentContext({
				population: 0.75,
			});

			const { version } = resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(assignVersionSpy).toHaveBeenCalled();
			expect(cookies.getSetCookie('uiab')).toMatch(`ab:${version}:1753809052:0.75`);
		});

		it('Returns the current assignment if already assigned when the population changes', () => {
			const cookies = Cookie({ uiab: 'ab:variant:1753809052:0.5' });
			const { resolvers } = expResolverFactory({ cookies });
			const context = getExperimentContext({
				population: 0.75,
			});

			const result = resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(assignVersionSpy).not.toHaveBeenCalled();
			expect(result).toEqual(Experiment('ab', 'variant'));
		});

		it('Returns a null assignment when assignVersion returns undefined', () => {
			const cookies = Cookie();
			const { resolvers } = expResolverFactory({ cookies });
			const context = getExperimentContext({
				endTime: Date.now() - 1000,
			});

			const result = resolvers.Query.experiment(null, { id: 'ab' }, context);
			expect(assignVersionSpy).toHaveBeenCalled();
			expect(result).toEqual(Experiment('ab', null));
		});
	});

	describe('Mutation.updateExperimentVersion', () => {
		it('Returns null when version is undefined', () => {
			const cookies = Cookie();
			const { resolvers } = expResolverFactory({ cookies });

			const result = resolvers.Mutation.updateExperimentVersion(null, { id: 'ab' });
			expect(result).toEqual(Experiment('ab', null));
		});

		it('Does not make updates to the version if already assigned to the requested version', () => {
			const cookies = Cookie({ uiab: 'ab:variant' });
			const { resolvers } = expResolverFactory({ cookies });

			const result = resolvers.Mutation.updateExperimentVersion(null, { id: 'ab', version: 'variant' });
			expect(result).toEqual(Experiment('ab', 'variant'));
			expect(cookies.getSetCookie('uiab')).toBeUndefined();
		});

		it('Updates the uiab cookie and returns the new version', () => {
			const cookies = Cookie({ uiab: 'ab:variant' });
			const { resolvers } = expResolverFactory({ cookies });

			const result = resolvers.Mutation.updateExperimentVersion(null, { id: 'ab', version: 'control' });
			expect(result).toEqual(Experiment('ab', 'control'));
			expect(cookies.getSetCookie('uiab')).toMatch('ab:control');
		});
	});

	describe('Mutation.cleanExperimentCookie', () => {
		it('Always returns true', () => {
			const cookies = Cookie();
			const { resolvers } = expResolverFactory({ cookies });
			expect(resolvers.Mutation.cleanExperimentCookie()).toBe(true);
		});
	});
});
