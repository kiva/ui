import { gql } from 'graphql-tag';
import createApolloClient from '#src/api/apollo';
import AutolendProfile, { getCacheableProfile } from '#src/api/fixtures/AutolendProfile';
import bothProfilesQuery from '#src/graphql/query/autolending/bothProfiles.graphql';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import { applyStateToCache, mergeStateObjects, omitUnchangedState } from '#src/util/apolloCacheUtils';
import CookieStore from '#src/util/cookieStore';
import { assignAllActiveExperiments } from '#src/util/experiment/experimentUtils';
import { MockKvAuth0 } from '#src/util/KvAuth0';

const experimentKey = 'test_exp';

const experimentDataQuery = gql`query esiTestExperimentData($key: String!) {
	general {
		activeExperiments: uiConfigSetting(key: "active_experiments") {
			key
			value
		}
		uiExperimentSetting(key: $key) {
			key
			value
		}
	}
}`;

const userQuery = gql`query esiTestUser {
	my {
		id
		userAccount {
			id
			firstName
		}
	}
}`;

const makeClient = () => createApolloClient({
	appConfig: {},
	cookieStore: new CookieStore({ uiv: 'visitor-1' }),
	kvAuth0: MockKvAuth0,
	types: {},
	uri: 'http://localhost/graphql',
	fetch: () => Promise.reject(new Error('network not available in tests')),
	route: { query: {} },
});

const writeActiveExperiment = client => {
	client.cache.writeQuery({
		query: experimentDataQuery,
		variables: { key: experimentKey },
		data: {
			general: {
				__typename: 'General',
				activeExperiments: {
					__typename: 'Setting',
					key: 'ui.active_experiments',
					value: JSON.stringify(experimentKey),
				},
				uiExperimentSetting: {
					__typename: 'Setting',
					key: `ui.${experimentKey}`,
					value: JSON.stringify(JSON.stringify({
						name: experimentKey,
						distribution: { b: 1 },
						population: 1,
					})),
				},
			},
		},
	});
};

const writeUser = client => {
	client.cache.writeQuery({
		query: userQuery,
		data: {
			my: {
				__typename: 'My',
				id: 1,
				userAccount: { __typename: 'UserAccount', id: 1, firstName: 'Lender' },
			},
		},
	});
};

const writeAutolendProfiles = client => {
	const profile = { ...AutolendProfile(), pauseUntil: '2027-01-27T17:34:06Z' };
	client.cache.writeQuery({
		query: bothProfilesQuery,
		data: {
			autolending: {
				...client.cache.readQuery({ query: bothProfilesQuery }).autolending,
				currentProfile: getCacheableProfile({ ...profile, id: 0 }),
				savedProfile: getCacheableProfile({ ...profile, id: 2625803 }),
			},
		},
	});
};

// Mirrors the server: the ESI head ships only what it changed from its local state defaults
const renderEsiState = async work => {
	const esi = makeClient();
	const defaultState = esi.cache.extract();
	await work(esi);
	return omitUnchangedState(esi.cache.extract(), defaultState);
};

const renderPageState = async work => {
	const page = makeClient();
	await work(page);
	return page.cache.extract();
};

// Mirrors client-entry hydration: the ESI state is merged over the page state
const hydrate = (pageState, esiState) => {
	const browser = makeClient();
	applyStateToCache(browser, mergeStateObjects(pageState, esiState));
	return browser;
};

const readExperimentVersion = client => client.readQuery({
	query: experimentAssignmentQuery,
	variables: { id: experimentKey },
})?.experiment?.version;

const localStateDefaults = [
	['ROOT_QUERY', 'usingTouch', true],
	['ActiveLoan:0', 'hoverLoanId', 42],
	['Autolending:0', 'profileChanged', true],
	['BasketAddInterstitial:0', 'visible', true],
	['TipMessage:0', 'visible', true],
	['VerificationLightbox:0', 'visible', true],
];

const setField = (dataId, field, value) => client => {
	client.cache.modify({ id: dataId, fields: { [field]: () => value } });
};

describe('ESI and page apollo state hydration', () => {
	it('covers every entity written by local state defaults', () => {
		const defaultEntityIds = Object.keys(makeClient().cache.extract()).filter(id => id !== 'ROOT_QUERY');
		const coveredIds = localStateDefaults.map(([dataId]) => dataId);

		expect(defaultEntityIds.filter(id => !coveredIds.includes(id))).toEqual([]);
	});

	it('ships nothing from the ESI head when it changes nothing', async () => {
		expect(await renderEsiState(() => {})).toEqual({});
	});

	describe('experiments', () => {
		it('hydrates an experiment assigned by the ESI head', async () => {
			const esiState = await renderEsiState(async esi => {
				writeActiveExperiment(esi);
				await assignAllActiveExperiments(esi);
			});
			const pageState = await renderPageState(() => {});

			const browser = hydrate(pageState, esiState);

			expect(readExperimentVersion(browser)).toBe('b');
		});

		it('hydrates an experiment assigned by the page when the ESI head assigns none', async () => {
			const esiState = await renderEsiState(() => {});
			const pageState = await renderPageState(async page => {
				writeActiveExperiment(page);
				await assignAllActiveExperiments(page);
			});

			const browser = hydrate(pageState, esiState);

			expect(readExperimentVersion(browser)).toBe('b');
		});

		it('hydrates the active experiment settings', async () => {
			const esiState = await renderEsiState(async esi => {
				writeActiveExperiment(esi);
				await assignAllActiveExperiments(esi);
			});

			const browser = hydrate(await renderPageState(() => {}), esiState);

			expect(browser.cache.readQuery({
				query: experimentDataQuery,
				variables: { key: experimentKey },
			}).general.activeExperiments.value).toBe(JSON.stringify(experimentKey));
		});
	});

	it('hydrates user data from the ESI head alongside page local state', async () => {
		const esiState = await renderEsiState(writeUser);
		const pageState = await renderPageState(writeAutolendProfiles);

		const browser = hydrate(pageState, esiState);

		expect(browser.cache.readQuery({ query: userQuery }).my.userAccount.firstName).toBe('Lender');
		expect(browser.cache.readQuery({ query: bothProfilesQuery }).autolending.currentProfile.id).toBe(0);
	});

	it('keeps the page autolending profiles when the ESI head assigns experiments', async () => {
		const esiState = await renderEsiState(async esi => {
			writeActiveExperiment(esi);
			await assignAllActiveExperiments(esi);
		});
		const pageState = await renderPageState(writeAutolendProfiles);

		const { autolending } = hydrate(pageState, esiState).cache.readQuery({ query: bothProfilesQuery });

		expect(autolending.currentProfile.pauseUntil).toBe('2027-01-27T17:34:06Z');
		expect(autolending.savedProfile.id).toBe(2625803);
	});

	describe.each(localStateDefaults)('%s.%s', (dataId, field, value) => {
		it('keeps a value the page changed from its default', async () => {
			const esiState = await renderEsiState(() => {});
			const pageState = await renderPageState(setField(dataId, field, value));

			expect(hydrate(pageState, esiState).cache.extract()[dataId][field]).toEqual(value);
		});

		it('applies a value the ESI head changed from its default', async () => {
			const esiState = await renderEsiState(setField(dataId, field, value));
			const pageState = await renderPageState(() => {});

			expect(hydrate(pageState, esiState).cache.extract()[dataId][field]).toEqual(value);
		});
	});
});
