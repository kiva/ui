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
});
