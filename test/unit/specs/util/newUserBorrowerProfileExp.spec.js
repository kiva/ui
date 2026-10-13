import {
	NEW_USER_BP_EXP_KEY,
	isNewUserBpExpEligible,
	readNewUserBpExpVersion,
} from '#src/util/newUserBorrowerProfileExp';

describe('newUserBorrowerProfileExp', () => {
	const makeCookieStore = (cookies = {}) => ({ get: name => cookies[name] });

	const eligible = {
		loanStatus: 'fundraising',
		isFullView: true,
		isLoggedIn: false,
		hasEverLoggedIn: false,
		cookieStore: makeCookieStore(),
	};

	describe('isNewUserBpExpEligible', () => {
		it('includes a new logged out visitor on the full profile of a fundraising loan', () => {
			expect(isNewUserBpExpEligible(eligible)).toBe(true);
		});

		it.each([
			['a loan that is not fundraising', { loanStatus: 'funded' }],
			['the minimal profile', { isFullView: false }],
			['a logged in visitor', { isLoggedIn: true }],
			['a visitor who has logged in before', { hasEverLoggedIn: true }],
			['an unknown hasEverLoggedIn', { hasEverLoggedIn: undefined }],
			['a visitor who has lent before', { cookieStore: makeCookieStore({ kvu_lb: 'true' }) }],
			['a visitor who has deposited before', { cookieStore: makeCookieStore({ kvu_db: 'true' }) }],
		])('excludes %s', (_, overrides) => {
			expect(isNewUserBpExpEligible({ ...eligible, ...overrides })).toBe(false);
		});

		it('keeps visitors whose lifetime cookies are false', () => {
			const cookieStore = makeCookieStore({ kvu_lb: 'false', kvu_db: 'false' });

			expect(isNewUserBpExpEligible({ ...eligible, cookieStore })).toBe(true);
		});
	});

	describe('readNewUserBpExpVersion', () => {
		const makeClient = version => ({ readFragment: vi.fn(() => (version ? { version } : null)) });

		it.each(['a', 'b'])('returns the assigned version %s', version => {
			const client = makeClient(version);

			expect(readNewUserBpExpVersion(client)).toBe(version);
			expect(client.readFragment.mock.calls[0][0].id).toBe(`Experiment:${NEW_USER_BP_EXP_KEY}`);
		});

		it.each([null, 'unassigned'])('returns null for %s', version => {
			expect(readNewUserBpExpVersion(makeClient(version))).toBe(null);
		});

		it('returns null when the cache read throws', () => {
			const client = { readFragment: vi.fn(() => { throw new Error('miss'); }) };

			expect(readNewUserBpExpVersion(client)).toBe(null);
		});
	});
});
