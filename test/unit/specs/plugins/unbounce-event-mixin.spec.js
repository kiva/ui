import unbounceEventMixin from '#src/plugins/unbounce-event-mixin';

// Mock the dependencies
vi.mock('#src/util/logReadQueryError', () => ({
	default: vi.fn()
}));

vi.mock('#src/graphql/query/shared/hasEverLoggedIn.graphql', () => ({
	default: 'hasEverLoggedInQuery'
}));

describe('unbounce-event-mixin.js', () => {
	let mockApollo;
	let mockCookieStore;
	let mockRoute;
	let mockWindow;
	let context;

	beforeEach(() => {
		mockApollo = {
			readQuery: vi.fn()
		};

		mockCookieStore = {
			get: vi.fn(),
			set: vi.fn()
		};

		mockRoute = {
			meta: {},
			query: {}
		};

		mockWindow = {
			dataLayer: []
		};

		vi.stubGlobal('window', mockWindow);

		context = {
			apollo: mockApollo,
			cookieStore: mockCookieStore,
			$route: mockRoute
		};
	});

	afterEach(() => {
		// vi.unstubAllGlobals();
		// vi.clearAllMocks();
	});

	describe('mounted', () => {
		it('should set email cookie when utm_medium=email in query params', () => {
			mockRoute.query.utm_medium = 'email';
			mockRoute.meta.unbounceEmailCapture = true;
			mockApollo.readQuery.mockReturnValue({ hasEverLoggedIn: false });
			mockCookieStore.get.mockReturnValue(undefined);

			unbounceEventMixin.mounted.call(context);

			expect(mockCookieStore.set).toHaveBeenCalledWith(
				'kvutm_medium_email',
				true,
				expect.objectContaining({ expires: expect.any(Date) })
			);
		});

		it('should push activateUnbounceEvent when eligible for email capture', () => {
			mockRoute.meta.unbounceEmailCapture = true;
			mockRoute.query.utm_medium = undefined;
			mockApollo.readQuery.mockReturnValue({ hasEverLoggedIn: false });
			mockCookieStore.get.mockReturnValue(undefined);

			unbounceEventMixin.mounted.call(context);

			expect(mockWindow.dataLayer).toContainEqual({ event: 'activateUnbounceEvent' });
		});

		it('should not push activateUnbounceEvent when user has ever logged in', () => {
			mockRoute.meta.unbounceEmailCapture = true;
			mockRoute.query.utm_medium = undefined;
			mockApollo.readQuery.mockReturnValue({ hasEverLoggedIn: true });
			mockCookieStore.get.mockReturnValue(undefined);

			unbounceEventMixin.mounted.call(context);

			expect(mockWindow.dataLayer).not.toContainEqual({ event: 'activateUnbounceEvent' });
		});

		it('should not push activateUnbounceEvent when utm_medium=email in query', () => {
			mockRoute.meta.unbounceEmailCapture = true;
			mockRoute.query.utm_medium = 'email';
			mockApollo.readQuery.mockReturnValue({ hasEverLoggedIn: false });
			mockCookieStore.get.mockReturnValue(undefined);

			unbounceEventMixin.mounted.call(context);

			expect(mockWindow.dataLayer).not.toContainEqual({ event: 'activateUnbounceEvent' });
		});

		it('should not push activateUnbounceEvent when email cookie exists', () => {
			mockRoute.meta.unbounceEmailCapture = true;
			mockRoute.query.utm_medium = undefined;
			mockApollo.readQuery.mockReturnValue({ hasEverLoggedIn: false });
			mockCookieStore.get.mockReturnValue(true);

			unbounceEventMixin.mounted.call(context);

			expect(mockWindow.dataLayer).not.toContainEqual({ event: 'activateUnbounceEvent' });
		});

		it('should not push activateUnbounceEvent when route is not marked for email capture', () => {
			mockRoute.meta.unbounceEmailCapture = false;
			mockRoute.query.utm_medium = undefined;
			mockApollo.readQuery.mockReturnValue({ hasEverLoggedIn: false });
			mockCookieStore.get.mockReturnValue(undefined);

			unbounceEventMixin.mounted.call(context);

			expect(mockWindow.dataLayer).not.toContainEqual({ event: 'activateUnbounceEvent' });
		});

		it('should push activateUnbouncePopUp when user has logged in and route is marked', () => {
			mockRoute.meta.unbouncePopUp = true;
			mockApollo.readQuery.mockReturnValue({ hasEverLoggedIn: true });

			unbounceEventMixin.mounted.call(context);

			expect(mockWindow.dataLayer).toContainEqual({ event: 'activateUnbouncePopUp' });
		});

		it('should not push activateUnbouncePopUp when user has not logged in', () => {
			mockRoute.meta.unbouncePopUp = true;
			mockApollo.readQuery.mockReturnValue({ hasEverLoggedIn: false });

			unbounceEventMixin.mounted.call(context);

			expect(mockWindow.dataLayer).not.toContainEqual({ event: 'activateUnbouncePopUp' });
		});

		it('should not push activateUnbouncePopUp when route is not marked', () => {
			mockRoute.meta.unbouncePopUp = false;
			mockApollo.readQuery.mockReturnValue({ hasEverLoggedIn: true });

			unbounceEventMixin.mounted.call(context);

			expect(mockWindow.dataLayer).not.toContainEqual({ event: 'activateUnbouncePopUp' });
		});

		it('should handle Apollo readQuery error gracefully', () => {
			mockRoute.meta.unbounceEmailCapture = true;
			mockRoute.query.utm_medium = undefined;
			mockApollo.readQuery.mockImplementation(() => {
				throw new Error('Query error');
			});
			mockCookieStore.get.mockReturnValue(undefined);

			// Should not throw error
			expect(() => unbounceEventMixin.mounted.call(context)).not.toThrow();

			// When error occurs, hasEverLoggedIn is undefined, so !hasEverLoggedIn is true
			// and the event IS pushed
			expect(mockWindow.dataLayer).toContainEqual({ event: 'activateUnbounceEvent' });
		});

		it('should handle missing route meta gracefully', () => {
			context.$route = {
				query: {}
			};
			mockApollo.readQuery.mockReturnValue({ hasEverLoggedIn: false });

			// Should not throw error
			expect(() => unbounceEventMixin.mounted.call(context)).not.toThrow();
		});

		it('should handle missing route query gracefully', () => {
			context.$route = {
				meta: { unbounceEmailCapture: true }
			};
			mockApollo.readQuery.mockReturnValue({ hasEverLoggedIn: false });
			mockCookieStore.get.mockReturnValue(undefined);

			// Should not throw error
			expect(() => unbounceEventMixin.mounted.call(context)).not.toThrow();
		});
	});
});
