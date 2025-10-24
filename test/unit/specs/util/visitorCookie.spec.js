import setVisitorIdCookie from '#src/util/visitorCookie';

// Mock uuid to return a predictable value
const MOCK_UUID = 'mock-uuid-1234';
vi.mock('uuid', () => ({ v4: () => MOCK_UUID }));

describe('setVisitorIdCookie', () => {
	it('should set a new visitor id cookie if not present', () => {
		const cookieStore = {
			has: vi.fn().mockReturnValue(false),
			set: vi.fn(),
		};

		setVisitorIdCookie(cookieStore);

		expect(cookieStore.set).toHaveBeenCalledWith(
			'uiv',
			MOCK_UUID,
			expect.objectContaining({
				expires: expect.any(Date),
				sameSite: true,
				secure: true,
				path: '/',
			})
		);
	});

	it('should not set a visitor id cookie if already present', () => {
		const cookieStore = {
			has: vi.fn().mockReturnValue(true),
			set: vi.fn(),
		};

		setVisitorIdCookie(cookieStore);

		expect(cookieStore.set).not.toHaveBeenCalled();
	});

	it('should set cookie with expiration 2 years from now', () => {
		const cookieStore = {
			has: vi.fn().mockReturnValue(false),
			set: vi.fn(),
		};

		const beforeCall = new Date();
		setVisitorIdCookie(cookieStore);
		const afterCall = new Date();

		const setCallArgs = cookieStore.set.mock.calls[0];
		const expiresDate = setCallArgs[2].expires;

		// Should be 2 years from now, allow for small time differences during test execution
		const twoYearsFromBefore = new Date(beforeCall);
		twoYearsFromBefore.setFullYear(twoYearsFromBefore.getFullYear() + 2);
		const twoYearsFromAfter = new Date(afterCall);
		twoYearsFromAfter.setFullYear(twoYearsFromAfter.getFullYear() + 2);

		expect(expiresDate.getTime()).toBeGreaterThanOrEqual(twoYearsFromBefore.getTime() - 1000);
		expect(expiresDate.getTime()).toBeLessThanOrEqual(twoYearsFromAfter.getTime() + 1000);
	});

	it('should call cookieStore.has with correct cookie name', () => {
		const cookieStore = {
			has: vi.fn().mockReturnValue(true),
			set: vi.fn(),
		};

		setVisitorIdCookie(cookieStore);

		expect(cookieStore.has).toHaveBeenCalledWith('uiv');
	});

	it('should set cookie with correct path', () => {
		const cookieStore = {
			has: vi.fn().mockReturnValue(false),
			set: vi.fn(),
		};

		setVisitorIdCookie(cookieStore);

		const setCallArgs = cookieStore.set.mock.calls[0];
		expect(setCallArgs[2].path).toBe('/');
	});

	it('should set cookie with secure flag', () => {
		const cookieStore = {
			has: vi.fn().mockReturnValue(false),
			set: vi.fn(),
		};

		setVisitorIdCookie(cookieStore);

		const setCallArgs = cookieStore.set.mock.calls[0];
		expect(setCallArgs[2].secure).toBe(true);
	});

	it('should set cookie with sameSite flag', () => {
		const cookieStore = {
			has: vi.fn().mockReturnValue(false),
			set: vi.fn(),
		};

		setVisitorIdCookie(cookieStore);

		const setCallArgs = cookieStore.set.mock.calls[0];
		expect(setCallArgs[2].sameSite).toBe(true);
	});

	it('should use uuid v4 for generating visitor id', () => {
		const cookieStore = {
			has: vi.fn().mockReturnValue(false),
			set: vi.fn(),
		};

		setVisitorIdCookie(cookieStore);

		const setCallArgs = cookieStore.set.mock.calls[0];
		expect(setCallArgs[1]).toBe(MOCK_UUID);
	});
});
