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
		let replaceState;

		const visit = search => {
			window.history.replaceState({}, '', `/portfolio${search}`);
		};

		beforeEach(() => {
			trackMetaEvent.mockClear();
			window.sessionStorage.clear();
			visit('');
			replaceState = vi.spyOn(window.history, 'replaceState');
		});

		afterEach(() => {
			replaceState.mockRestore();
		});

		it('reports a new registration', () => {
			visit('?registration=new');

			trackAccountCreated('1234');

			expect(trackMetaEvent).toHaveBeenCalledWith('accountCreated');
		});

		it('reports a claimed guest account', () => {
			visit('?claimed=1');

			trackAccountCreated('1234');

			expect(trackMetaEvent).toHaveBeenCalledWith('accountCreated');
		});

		it('does nothing without a marker', () => {
			visit('?foo=bar');

			trackAccountCreated('1234');

			expect(trackMetaEvent).not.toHaveBeenCalled();
		});

		it('removes the marker so a reload cannot replay it', () => {
			visit('?registration=new');

			trackAccountCreated('1234');

			expect(window.location.search).not.toContain('registration');
		});

		it('keeps other params when removing the marker', () => {
			visit('?registration=new&utm_source=email');

			trackAccountCreated('1234');

			expect(window.location.search).toContain('utm_source=email');
			expect(window.location.search).not.toContain('registration');
		});

		it('preserves existing history state when removing the marker', () => {
			const state = { position: 2, scroll: { left: 0, top: 100 } };
			window.history.replaceState(state, '', '/portfolio?registration=new');

			trackAccountCreated('1234');

			expect(window.history.state).toEqual(state);
		});

		it('reports once per session when the marker arrives twice', () => {
			visit('?registration=new');
			trackAccountCreated('1234');

			// The monolith re-adds the marker if the lender re-authenticates inside its
			// 30 second registration window
			visit('?registration=new');
			trackAccountCreated('1234');

			expect(trackMetaEvent).toHaveBeenCalledTimes(1);
		});

		it('still reports when sessionStorage is unavailable', () => {
			const getItem = vi.spyOn(window.sessionStorage, 'getItem').mockImplementation(() => {
				throw new Error('denied');
			});
			visit('?registration=new');

			trackAccountCreated('1234');

			expect(trackMetaEvent).toHaveBeenCalledWith('accountCreated');
			getItem.mockRestore();
		});
	});
});
