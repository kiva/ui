import { trackMetaEvent } from '@kiva/kv-analytics';
import { getRegistrationMarker, trackAccountCreated } from '#src/util/registrationTracking';

vi.mock('@kiva/kv-analytics', async importOriginal => ({
	...(await importOriginal()),
	trackMetaEvent: vi.fn(),
}));

describe('registrationTracking.js', () => {
	describe('getRegistrationMarker', () => {
		it('matches registration=new, set by the monolith for email and social sign-ups', () => {
			expect(getRegistrationMarker('?registration=new')).toBe('registration');
		});

		it('matches claimed=1, set for guest account claims', () => {
			expect(getRegistrationMarker('?claimed=1')).toBe('claimed');
		});

		it('finds the marker alongside other params', () => {
			expect(getRegistrationMarker('?doneUrl=%2Fportfolio&registration=new')).toBe('registration');
		});

		it('returns null for other registration values', () => {
			expect(getRegistrationMarker('?registration=existing')).toBeNull();
		});

		it('returns null with no params', () => {
			expect(getRegistrationMarker('')).toBeNull();
		});
	});

	describe('trackAccountCreated', () => {
		let cookies;
		let replaceState;

		// Stands in for the cookieStore adapter client-entry passes; shared across "tabs"
		// the way a real cookie is, which is the point of using one.
		const makeCookies = () => {
			const jar = {};
			return {
				jar,
				get: name => jar[name],
				set: (name, value) => { jar[name] = value; },
			};
		};

		const visit = search => {
			window.history.replaceState({}, '', `/portfolio${search}`);
		};

		beforeEach(() => {
			trackMetaEvent.mockClear();
			cookies = makeCookies();
			visit('');
			replaceState = vi.spyOn(window.history, 'replaceState');
		});

		afterEach(() => {
			replaceState.mockRestore();
		});

		it('reports a new registration', () => {
			visit('?registration=new');

			trackAccountCreated('1234', cookies);

			expect(trackMetaEvent).toHaveBeenCalledWith('accountCreated');
		});

		it('reports a claimed guest account', () => {
			visit('?claimed=1');

			trackAccountCreated('1234', cookies);

			expect(trackMetaEvent).toHaveBeenCalledWith('accountCreated');
		});

		it('does nothing without a marker', () => {
			visit('?foo=bar');

			trackAccountCreated('1234', cookies);

			expect(trackMetaEvent).not.toHaveBeenCalled();
			expect(cookies.jar).toEqual({});
		});

		// The URL is left untouched: the cookie is the whole dedup, so a reload still carrying
		// the marker is caught by the cookie rather than by rewriting history.
		it('leaves the URL alone', () => {
			visit('?registration=new&utm_source=email');
			// visit() navigates via replaceState, so only count what the call below does
			replaceState.mockClear();

			trackAccountCreated('1234', cookies);

			expect(window.location.search).toContain('registration=new');
			expect(window.location.search).toContain('utm_source=email');
			expect(replaceState).not.toHaveBeenCalled();
		});

		it('does not report again on a reload that still carries the marker', () => {
			visit('?registration=new');
			trackAccountCreated('1234', cookies);

			// same URL, same cookie jar — what a refresh looks like
			trackAccountCreated('1234', cookies);

			expect(trackMetaEvent).toHaveBeenCalledTimes(1);
		});

		it('reports once per lender when the marker arrives twice', () => {
			visit('?registration=new');
			trackAccountCreated('1234', cookies);

			// The monolith re-adds the marker if the lender re-authenticates inside its
			// 30 second registration window
			visit('?registration=new');
			trackAccountCreated('1234', cookies);

			expect(trackMetaEvent).toHaveBeenCalledTimes(1);
		});

		// A cookie is shared across tabs, unlike sessionStorage — so a second tab landing on
		// the same marked URL must not produce a second event.
		it('reports once across separate cookie reads', () => {
			visit('?registration=new');
			trackAccountCreated('1234', cookies);

			visit('?registration=new');
			trackAccountCreated('1234', { get: cookies.get, set: cookies.set });

			expect(trackMetaEvent).toHaveBeenCalledTimes(1);
		});

		it('reports again for a different lender on the same browser', () => {
			visit('?registration=new');
			trackAccountCreated('1234', cookies);

			visit('?registration=new');
			trackAccountCreated('5678', cookies);

			expect(trackMetaEvent).toHaveBeenCalledTimes(2);
		});
	});
});
