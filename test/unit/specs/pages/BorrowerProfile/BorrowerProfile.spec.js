import BorrowerProfile from '#src/pages/BorrowerProfile/BorrowerProfile';

// We invoke apollo.preFetch directly with a mock apollo client and a plain
// context object. This avoids mounting the SSR app and exercises exactly the
// routing/auth decisions added for AD-248.
describe('BorrowerProfile.apollo.preFetch', () => {
	const RESTRICTED_STATUSES = ['reviewed', 'deleted', 'issue', 'inactive', 'inactiveExpired'];
	const PUBLIC_STATUSES = ['fundraising', 'expired', 'raised', 'payingBack', 'refunded', 'ended', 'defaulted'];

	const makeLoan = (status, { isPrivileged = false } = {}) => ({
		id: 12345,
		status,
		loanAmount: '500',
		loanFundraisingInfo: { id: 1, fundedAmount: '100' },
		userProperties: { isPrivileged },
	});

	const makeClient = loan => ({
		query: vi.fn().mockResolvedValue({ data: { lend: { loan } } }),
	});

	const makeContext = ({ kivaId } = {}) => ({
		route: { params: { id: '12345' }, query: {}, fullPath: '/lend/12345' },
		cookieStore: { get: vi.fn() },
		kvAuth0: { getKivaId: () => kivaId },
	});

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
});
