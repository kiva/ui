import BorrowerProfile from '#src/pages/BorrowerProfile/BorrowerProfile';
import { getOperationName } from '../../../specUtils';

describe('BorrowerProfile.apollo.preFetch', () => {
	const RESTRICTED_STATUSES = ['reviewed', 'deleted', 'issue', 'inactive', 'inactiveExpired'];
	const PUBLIC_STATUSES = [
		'fundraising', 'funded', 'expired', 'raised', 'payingBack', 'refunded', 'ended', 'defaulted',
	];

	const makeLoan = (status, { isPrivileged = false, unreservedAmount = '400' } = {}) => ({
		id: 12345,
		status,
		loanAmount: '500',
		loanFundraisingInfo: { id: 1, fundedAmount: '100' },
		unreservedAmount,
		userProperties: { isPrivileged },
	});

	const makeClient = (loan, my = null) => ({
		query: vi.fn().mockResolvedValue({ data: { lend: { loan }, my } }),
	});

	const makeMy = ({ volunteerId = null } = {}) => ({
		id: 1,
		userAccount: { id: 2, volunteerId },
	});

	const makeContext = ({ kivaId } = {}) => ({
		route: { params: { id: '12345' }, query: {}, fullPath: '/lend/12345' },
		cookieStore: { get: vi.fn() },
		kvAuth0: { getKivaId: () => kivaId },
	});

	const getChildProfileOperationName = client => {
		const call = client.query.mock.calls.find(([{ query }]) => (
			['fullBorrowerProfileData', 'minimalBorrowerProfileData'].includes(getOperationName(query))
		));
		return getOperationName(call[0].query);
	};

	it.each(RESTRICTED_STATUSES)(
		'redirects anonymous viewers to /ui-login for restricted status %s',
		async status => {
			const client = makeClient(makeLoan(status));
			const context = makeContext({ kivaId: undefined });

			await expect(BorrowerProfile.apollo.preFetch({}, client, context))
				.rejects.toEqual({ path: '/ui-login', query: { doneUrl: '/lend/12345' } });
		}
	);

	it.each(RESTRICTED_STATUSES)(
		'redirects logged-in non-privileged viewers to /lend for restricted status %s',
		async status => {
			const client = makeClient(makeLoan(status));
			const context = makeContext({ kivaId: 'auth0|abc' });

			await expect(BorrowerProfile.apollo.preFetch({}, client, context))
				.rejects.toEqual({ path: '/lend', query: {} });
		}
	);

	it.each(RESTRICTED_STATUSES)(
		'allows privileged viewers to load restricted status %s',
		async status => {
			const client = makeClient(makeLoan(status, { isPrivileged: true }));
			const context = makeContext({ kivaId: 'auth0|abc' });

			await expect(BorrowerProfile.apollo.preFetch({}, client, context)).resolves.toBeDefined();
		}
	);

	it.each(PUBLIC_STATUSES)(
		'allows anonymous non-privileged viewers to load public status %s',
		async status => {
			const client = makeClient(makeLoan(status));
			const context = makeContext({ kivaId: undefined });

			await expect(BorrowerProfile.apollo.preFetch({}, client, context)).resolves.toBeDefined();
		}
	);

	it('still rejects with /lend when the loan is missing (regression)', async () => {
		const client = makeClient(null);
		const context = makeContext({ kivaId: undefined });

		await expect(BorrowerProfile.apollo.preFetch({}, client, context))
			.rejects.toEqual({ path: '/lend', query: {} });
	});

	it.each([
		['0', 'minimalBorrowerProfileData'],
		['400', 'fullBorrowerProfileData'],
	])(
		'routes a fundraising loan with unreservedAmount %s to %s for anonymous viewers (AD-297)',
		async (unreservedAmount, expectedOperation) => {
			const client = makeClient(makeLoan('fundraising', { unreservedAmount }));
			const context = makeContext({ kivaId: undefined });

			await BorrowerProfile.apollo.preFetch({}, client, context);

			expect(getChildProfileOperationName(client)).toBe(expectedOperation);
		}
	);

	it.each(RESTRICTED_STATUSES)(
		'allows volunteer viewers to load restricted status %s (CIT-4820)',
		async status => {
			const client = makeClient(makeLoan(status), makeMy({ volunteerId: 987 }));
			const context = makeContext({ kivaId: 'auth0|abc' });

			await expect(BorrowerProfile.apollo.preFetch({}, client, context)).resolves.toBeDefined();
		}
	);

	it.each([
		'funded',
		'fundraising',
	])(
		'routes volunteer viewers to the full profile for a fully-reserved %s loan (CIT-4820)',
		async status => {
			const client = makeClient(makeLoan(status, { unreservedAmount: '0' }), makeMy({ volunteerId: 987 }));
			const context = makeContext({ kivaId: 'auth0|abc' });

			await BorrowerProfile.apollo.preFetch({}, client, context);

			expect(getChildProfileOperationName(client)).toBe('fullBorrowerProfileData');
		}
	);

	it('routes logged-in non-volunteer viewers to the minimal profile for a fully-reserved funded loan', async () => {
		const client = makeClient(makeLoan('funded', { unreservedAmount: '0' }), makeMy());
		const context = makeContext({ kivaId: 'auth0|abc' });

		await BorrowerProfile.apollo.preFetch({}, client, context);

		expect(getChildProfileOperationName(client)).toBe('minimalBorrowerProfileData');
	});
});

describe('BorrowerProfile.apollo.result', () => {
	const makeRoutingLoan = (status, { isPrivileged = false, unreservedAmount = '400' } = {}) => ({
		id: 12345,
		status,
		unreservedAmount,
		userProperties: { isPrivileged },
	});

	const makeCtx = ({ cached = null, routeQuery = {} } = {}) => ({
		apollo: {
			readQuery: vi.fn(() => cached),
		},
		$route: { query: routeQuery },
		inviterIsGuestOrAnonymous: false,
		expRegionList: [],
	});

	const invokeResult = (ctx, loan, { volunteerId = null } = {}) => {
		BorrowerProfile.apollo.result.call(ctx, {
			data: { lend: { loan }, my: { userAccount: { volunteerId } } },
		});
	};

	const readQueryOperation = ctx => getOperationName(ctx.apollo.readQuery.mock.calls[0][0].query);

	it.each([
		{
			title: 'a fundraising loan with shares remaining',
			loan: makeRoutingLoan('fundraising'),
			options: {},
			routeQuery: {},
			expected: 'fullBorrowerProfileData',
		},
		{
			title: 'a fully-reserved funded loan',
			loan: makeRoutingLoan('funded', { unreservedAmount: '0' }),
			options: {},
			routeQuery: {},
			expected: 'minimalBorrowerProfileData',
		},
		{
			title: 'a privileged viewer on a reviewed loan',
			loan: makeRoutingLoan('reviewed', { isPrivileged: true }),
			options: {},
			routeQuery: {},
			expected: 'fullBorrowerProfileData',
		},
		{
			title: 'a volunteer viewer on a fully-reserved loan',
			loan: makeRoutingLoan('funded', { unreservedAmount: '0' }),
			options: { volunteerId: 987 },
			routeQuery: {},
			expected: 'fullBorrowerProfileData',
		},
		{
			title: 'a minimal=false override on a fully-reserved loan',
			loan: makeRoutingLoan('funded', { unreservedAmount: '0' }),
			options: {},
			routeQuery: { minimal: 'false' },
			expected: 'fullBorrowerProfileData',
		},
	])('reads back $expected for $title', ({
		loan, options, routeQuery, expected,
	}) => {
		const ctx = makeCtx({ routeQuery });

		invokeResult(ctx, loan, options);

		expect(readQueryOperation(ctx)).toBe(expected);
	});

	it('surfaces the cached minimal-profile loan rather than the routing loan', () => {
		const loan = makeRoutingLoan('ended', { unreservedAmount: '0' });
		const ctx = makeCtx({
			cached: { lend: { loan: { id: 12345, status: 'ended', statusLabel: 'Repaid' } } },
		});

		invokeResult(ctx, loan);

		expect(ctx.loan.statusLabel).toBe('Repaid');
		expect(ctx.routingLoan).toEqual(loan);
	});

	it('carries the cached account rail preference into the SSR initial state', () => {
		const loan = makeRoutingLoan('fundraising');
		const ctx = makeCtx({
			cached: {
				lend: { loan: { id: 12345, status: 'fundraising' } },
				my: { id: 1, userPreferences: { id: 2, preferences: '{"showLoanDetailsInRail":true}' } },
			},
		});

		invokeResult(ctx, loan);

		expect(ctx.initialShowDetailsInRail).toBe(true);
	});

	it('falls back to the routing loan when the child query is not cached', () => {
		const loan = makeRoutingLoan('ended', { unreservedAmount: '0' });
		const ctx = makeCtx();

		invokeResult(ctx, loan);

		expect(ctx.loan).toEqual(loan);
	});
});

describe('BorrowerProfile new_user_borrower_profile experiment', () => {
	const makeLoan = (status, { unreservedAmount = '400' } = {}) => ({
		id: 12345,
		status,
		loanAmount: '500',
		loanFundraisingInfo: { id: 1, fundedAmount: '100' },
		unreservedAmount,
		userProperties: { isPrivileged: false },
	});

	describe('preFetch', () => {
		const makeClient = (loan, { hasEverLoggedIn = false, my = null } = {}) => ({
			query: vi.fn(({ query }) => Promise.resolve({
				data: getOperationName(query) === 'hasEverLoggedIn'
					? { hasEverLoggedIn }
					: { lend: { loan }, my },
			})),
		});

		const makeContext = ({ kivaId, cookies = {} } = {}) => ({
			route: { params: { id: '12345' }, query: {}, fullPath: '/lend/12345' },
			cookieStore: { get: name => cookies[name] },
			kvAuth0: { getKivaId: () => kivaId },
		});

		const assignedExperimentIds = client => client.query.mock.calls
			.filter(([{ query }]) => getOperationName(query) === 'experimentAssignment')
			.map(([{ variables }]) => variables.id);

		it('assigns the experiment for a new logged out visitor on a fundraising loan', async () => {
			const client = makeClient(makeLoan('fundraising'));

			await BorrowerProfile.apollo.preFetch({}, client, makeContext());

			expect(assignedExperimentIds(client)).toContain('new_user_borrower_profile');
		});

		it.each([
			['a logged in visitor', makeLoan('fundraising'), {}, { kivaId: 'auth0|abc' }],
			['a returning visitor', makeLoan('fundraising'), { hasEverLoggedIn: true }, {}],
			['a visitor who has lent before', makeLoan('fundraising'), {}, { cookies: { kvu_lb: 'true' } }],
			['a loan that is not fundraising', makeLoan('funded'), {}, {}],
			['a fully reserved fundraising loan', makeLoan('fundraising', { unreservedAmount: '0' }), {}, {}],
		])('does not assign the experiment for %s', async (_, loan, clientOptions, contextOptions) => {
			const client = makeClient(loan, clientOptions);

			await BorrowerProfile.apollo.preFetch({}, client, makeContext(contextOptions));

			expect(assignedExperimentIds(client)).not.toContain('new_user_borrower_profile');
		});
	});

	describe('result', () => {
		const makeCtx = ({ version = 'b', hasEverLoggedIn = false, cookies = {} } = {}) => ({
			apollo: {
				readQuery: vi.fn(({ query }) => (
					getOperationName(query) === 'hasEverLoggedIn' ? { hasEverLoggedIn } : null
				)),
				readFragment: vi.fn(() => ({ id: 'new_user_borrower_profile', version })),
			},
			cookieStore: { get: name => cookies[name] },
			$route: { query: {} },
			inviterIsGuestOrAnonymous: false,
			expRegionList: [],
			isMounted: false,
			trackNewUserBpExp: vi.fn(),
		});

		const invokeResult = (ctx, loan, my = null) => {
			BorrowerProfile.apollo.result.call(ctx, { data: { lend: { loan }, my } });
		};

		it.each(['a', 'b'])('exposes version %s for a new logged out visitor', version => {
			const ctx = makeCtx({ version });

			invokeResult(ctx, makeLoan('fundraising'));

			expect(ctx.newUserBpExpVersion).toBe(version);
		});

		it('exposes no version for a logged in visitor', () => {
			const ctx = makeCtx();

			invokeResult(ctx, makeLoan('fundraising'), { id: 1, userAccount: { id: 2 } });

			expect(ctx.newUserBpExpVersion).toBe(null);
		});

		it('exposes no version for a returning visitor', () => {
			const ctx = makeCtx({ hasEverLoggedIn: true });

			invokeResult(ctx, makeLoan('fundraising'));

			expect(ctx.newUserBpExpVersion).toBe(null);
		});

		it('exposes no version for a loan that is not fundraising', () => {
			const ctx = makeCtx();

			invokeResult(ctx, makeLoan('funded', { unreservedAmount: '0' }));

			expect(ctx.newUserBpExpVersion).toBe(null);
		});

		it('tracks client-side navigations once mounted', () => {
			const ctx = makeCtx();
			ctx.isMounted = true;

			invokeResult(ctx, makeLoan('fundraising'));

			expect(ctx.trackNewUserBpExp).toHaveBeenCalled();
		});
	});

	describe('trackNewUserBpExp', () => {
		const makeCtx = version => ({
			newUserBpExpVersion: version,
			newUserBpExpTrackedLoanId: null,
			routingLoan: { id: 12345 },
			$kvTrackEvent: vi.fn(),
		});

		it('fires the experiment event once per page view', () => {
			const ctx = makeCtx('b');

			BorrowerProfile.methods.trackNewUserBpExp.call(ctx);
			BorrowerProfile.methods.trackNewUserBpExp.call(ctx);

			expect(ctx.$kvTrackEvent).toHaveBeenCalledTimes(1);
			expect(ctx.$kvTrackEvent).toHaveBeenCalledWith('event-tracking', 'EXP-MP-3035-Oct2026', 'b');
		});

		it('fires again for a different loan', () => {
			const ctx = makeCtx('a');

			BorrowerProfile.methods.trackNewUserBpExp.call(ctx);
			ctx.routingLoan = { id: 67890 };
			BorrowerProfile.methods.trackNewUserBpExp.call(ctx);

			expect(ctx.$kvTrackEvent).toHaveBeenCalledTimes(2);
		});

		it('does not fire for visitors outside the experiment', () => {
			const ctx = makeCtx(null);

			BorrowerProfile.methods.trackNewUserBpExp.call(ctx);

			expect(ctx.$kvTrackEvent).not.toHaveBeenCalled();
		});
	});
});
