import CookieStore from '@/util/cookieStore';
import * as expUtils from '@/util/experimentUtils';
import expResolverFactory from '@/api/localResolvers/experiment';
import clearDocumentCookies from '../../../setup/clearDocumentCookies';

function Experiment(id, version) {
	return { id, version, __typename: 'Experiment' };
}

function getExperimentContext(data = {}) {
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
	const context = {
		cache: {
			readQuery: jest.fn().mockReturnValue({
				general: {
					uiExperimentSetting: {
						key: exp.id,
						value: JSON.stringify(JSON.stringify(exp))
					}
				}
			}),
		}
	};

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
			clearDocumentCookies();
		});

		it('Returns a null assignment when experiment id is unknown', () => {
			const cookieStore = new CookieStore();
			const { typePolicies } = expResolverFactory({ cookieStore });
			const context = getExperimentContext();

			const result = typePolicies.Query.experiment(null, { id: 'ab' }, context);
			expect(result).toEqual(Experiment('ab', null));
		});

		it('Returns a null assignment when experiment is not enabled', () => {
			const cookieStore = new CookieStore();
			const context = getExperimentContext({ enabled: false });
			const { typePolicies } = expResolverFactory({ cookieStore });

			const result = typePolicies.Query.experiment(null, { id: 'ab' }, context);
			expect(result).toEqual(Experiment('ab', null));
		});

		it('Returns a new assignment when no assigment is set', () => {
			const cookieStore = new CookieStore();
			const { typePolicies } = expResolverFactory({ cookieStore });
			const context = getExperimentContext();

			const result = typePolicies.Query.experiment(null, { id: 'ab' }, context);
			expect(result).toEqual(Experiment('ab', null));
		});

		it('Returns a null assignment when assignVersion returns undefined', () => {
			const cookieStore = new CookieStore();
			const { typePolicies } = expResolverFactory({ cookieStore });
			const context = getExperimentContext({
				endTime: Date.now() - 1000,
			});

			const result = typePolicies.Query.experiment(null, { id: 'ab' }, context);
			expect(result).toEqual(Experiment('ab', null));
		});
	});

	describe('Mutation.updateExperimentVersion', () => {
		it('Returns null when version is undefined', () => {
			const cookieStore = new CookieStore();
			const { typePolicies } = expResolverFactory({ cookieStore });

			const result = typePolicies.Mutation.updateExperimentVersion(null, { id: 'ab' });
			expect(result).toEqual(Experiment('ab', null));
		});
	});

	describe('Mutation.cleanExperimentCookie', () => {
		it('Always returns true', () => {
			const cookieStore = new CookieStore();
			const { typePolicies } = expResolverFactory({ cookieStore });
			expect(typePolicies.Mutation.cleanExperimentCookie()).toBe(true);
		});
	});
});
