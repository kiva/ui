import { render, waitFor, fireEvent } from '@testing-library/vue';
import InviteComposerTabs from '#src/components/Portfolio/Invites/InviteComposerTabs';
import logFormatter from '#src/util/logFormatter';
import { getOperationName } from '../../../../specUtils';
import { FAILED_MUTATIONS, KvButtonStub, trackEventDirective } from './invitesSpecHelpers';

vi.mock('#src/util/logFormatter', () => ({ default: vi.fn() }));

const PERSONAL_URL = 'https://www.kiva.org/invitedby/caseyd';

const shareResponse = url => ({ data: { my: { createInviteShareUrl: { url } } } });

// A window the browser opened: blank until the page sets its location
const fakeWindow = () => {
	const win = {
		closed: false,
		opener: {},
		location: { href: '' },
		focus: vi.fn(),
		close: vi.fn(() => { win.closed = true; }),
	};
	return win;
};

const renderTabs = ({
	props = { personalUrl: PERSONAL_URL },
	mutate = vi.fn().mockResolvedValue(shareResponse('https://kiva.org/i/abc')),
	kvTrackEvent = vi.fn(),
} = {}) => ({
	mutate,
	kvTrackEvent,
	...render(InviteComposerTabs, {
		props,
		slots: { email: '<button data-testid="composer-stub" />' },
		global: {
			provide: { apollo: { mutate } },
			mocks: { $kvTrackEvent: kvTrackEvent, $appConfig: { fbApplicationId: '123' } },
			directives: { 'kv-track-event': trackEventDirective },
			stubs: {
				KvButton: KvButtonStub,
				KvLoadingText: { template: '<div />' },
			},
		},
	}),
});

// Whether the tab panel holding the element is the one showing
const isShown = el => el.closest('[role="tabpanel"]').style.display !== 'none';

const tabButton = (getByTestId, tab) => getByTestId(`invite-tab-${tab}`);

// Choose the Tweet tab and click its button
const showTweet = async getByTestId => {
	await fireEvent.click(tabButton(getByTestId, 'twitter'));
	await fireEvent.click(getByTestId('invite-share-twitter'));
};

describe('InviteComposerTabs', () => {
	let openSpy;
	let windows;

	beforeEach(() => {
		window.ResizeObserver = vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn() }));
		Element.prototype.scrollIntoView = vi.fn();
		windows = [];
		openSpy = vi.spyOn(window, 'open').mockImplementation(() => {
			const win = fakeWindow();
			windows.push(win);
			return win;
		});
	});

	afterEach(() => {
		openSpy.mockRestore();
		vi.clearAllMocks();
	});

	it('shows the email form first', async () => {
		const { getByTestId } = renderTabs();
		await waitFor(() => expect(isShown(getByTestId('composer-stub'))).toBe(true));
	});

	it('leaves the URL alone when a tab is chosen', async () => {
		const before = window.location.href;
		const { getByTestId } = renderTabs();
		await fireEvent.click(tabButton(getByTestId, 'url'));
		expect(tabButton(getByTestId, 'url').getAttribute('aria-selected')).toBe('true');
		expect(window.location.href).toBe(before);
	});

	it('opens the Facebook share dialog with a new share link', async () => {
		const {
			mutate, kvTrackEvent, getByTestId, emitted,
		} = renderTabs();
		await fireEvent.click(tabButton(getByTestId, 'facebook'));
		await fireEvent.click(getByTestId('invite-share-facebook'));
		// The window opens before the link is made, while the click still allows it to
		expect(openSpy).toHaveBeenCalledWith('', 'facebook', expect.stringContaining('width=626,height=436'));
		expect(windows[0].opener).toBeNull();
		await waitFor(() => expect(windows[0].location.href).not.toBe(''));
		const [{ mutation, variables }] = mutate.mock.calls[0];
		expect(getOperationName(mutation)).toBe('CreateInviteShareUrl');
		expect(variables).toEqual({ source: 'FACEBOOK' });
		const target = new URL(windows[0].location.href);
		expect(target.origin + target.pathname).toBe('https://www.facebook.com/dialog/share');
		expect(Object.fromEntries(target.searchParams)).toEqual({
			app_id: '123',
			display: 'popup',
			href: 'https://kiva.org/i/abc',
		});
		expect(kvTrackEvent).toHaveBeenCalledWith('portfolio', 'share', 'facebook');
		expect(emitted().shared).toHaveLength(1);
	});

	it('reuses the share link for later shares', async () => {
		const { mutate, getByTestId, emitted } = renderTabs();
		await fireEvent.click(tabButton(getByTestId, 'facebook'));
		await fireEvent.click(getByTestId('invite-share-facebook'));
		await waitFor(() => expect(windows[0].location.href).not.toBe(''));
		await fireEvent.click(getByTestId('invite-share-facebook'));
		await waitFor(() => expect(windows[1].location.href).toContain(encodeURIComponent('https://kiva.org/i/abc')));
		expect(mutate).toHaveBeenCalledTimes(1);
		expect(emitted().shared).toHaveLength(1);
	});

	it('opens no window when the Tweet tab is chosen', async () => {
		const { getByTestId, mutate } = renderTabs();
		await fireEvent.click(tabButton(getByTestId, 'twitter'));
		expect(isShown(getByTestId('invite-share-twitter'))).toBe(true);
		expect(openSpy).not.toHaveBeenCalled();
		expect(mutate).not.toHaveBeenCalled();
	});

	it('opens the Twitter window from the Tweet tab button', async () => {
		const mutate = vi.fn().mockResolvedValue(shareResponse('https://kiva.org/i/tw'));
		const { getByTestId, kvTrackEvent, emitted } = renderTabs({ mutate });
		await showTweet(getByTestId);
		expect(openSpy).toHaveBeenCalledWith('', 'tweet', expect.stringContaining('width=550,height=370'));
		await waitFor(() => expect(windows[0].location.href).not.toBe(''));
		expect(mutate.mock.calls[0][0].variables).toEqual({ source: 'TWITTER' });
		const target = new URL(windows[0].location.href);
		expect(target.origin + target.pathname).toBe('https://twitter.com/intent/tweet');
		expect(Object.fromEntries(target.searchParams)).toEqual({
			text: 'Join @Kiva and help change the world with just $25!',
			url: 'https://kiva.org/i/tw',
			via: 'Kiva',
		});
		expect(kvTrackEvent).toHaveBeenCalledWith('portfolio', 'share', 'twitter');
		expect(emitted().shared).toHaveLength(1);
	});

	it.each([
		['the main screen', { screenX: 100, screenY: 50 }, 'left=400,top=250'],
		['a screen left of and above the main one', { screenX: -1500, screenY: -900 }, 'left=-1200,top=-700'],
	])('centers a share window over the browser window on %s', async (_, position, expected) => {
		Object.assign(window, { ...position, outerWidth: 1226, outerHeight: 836 });
		const { getByTestId } = renderTabs();
		await fireEvent.click(tabButton(getByTestId, 'facebook'));
		await fireEvent.click(getByTestId('invite-share-facebook'));
		expect(openSpy.mock.calls[0][2]).toContain(expected);
	});

	it.each([
		...FAILED_MUTATIONS,
		['a missing link', () => vi.fn().mockResolvedValue({ data: { my: { createInviteShareUrl: { url: '' } } } })],
	])('shows an error after %s, leaving the window open, then makes a link on retry', async (_, makeMutate) => {
		const mutate = makeMutate();
		const {
			getByTestId, findByTestId, queryByTestId, emitted,
		} = renderTabs({ mutate });
		await fireEvent.click(tabButton(getByTestId, 'facebook'));
		await fireEvent.click(getByTestId('invite-share-facebook'));
		expect((await findByTestId('invite-share-facebook-error')).textContent.trim())
			.toBe('An error occurred. Please try again.');
		expect(windows[0].close).not.toHaveBeenCalled();
		expect(logFormatter).toHaveBeenCalledWith(expect.stringContaining('Error creating invite share link'), 'error');
		expect(emitted().shared).toBeUndefined();

		mutate.mockResolvedValue(shareResponse('https://kiva.org/i/retry'));
		await fireEvent.click(getByTestId('invite-share-facebook'));
		await waitFor(() => expect(windows[1].location.href).toContain(encodeURIComponent('https://kiva.org/i/retry')));
		expect(queryByTestId('invite-share-facebook-error')).toBeNull();
		expect(emitted().shared).toHaveLength(1);
	});

	it('opens another Twitter window with the same link on a second click', async () => {
		const { getByTestId, mutate, emitted } = renderTabs();
		await showTweet(getByTestId);
		await waitFor(() => expect(windows[0].location.href).not.toBe(''));
		await fireEvent.click(getByTestId('invite-share-twitter'));
		await waitFor(() => expect(windows[1].location.href).toBe(windows[0].location.href));
		expect(mutate).toHaveBeenCalledTimes(1);
		expect(emitted().shared).toHaveLength(1);
	});

	it.each(['facebook', 'twitter'])('leaves the %s window open for the viewer to close', async source => {
		const { getByTestId, unmount } = renderTabs();
		await fireEvent.click(tabButton(getByTestId, source));
		await fireEvent.click(getByTestId(`invite-share-${source}`));
		await waitFor(() => expect(windows[0].location.href).not.toBe(''));
		await fireEvent.click(tabButton(getByTestId, 'email'));
		window.dispatchEvent(new Event('pagehide'));
		unmount();
		expect(windows[0].close).not.toHaveBeenCalled();
	});

	it('does not make a link when the browser blocks the window', async () => {
		openSpy.mockReturnValue(null);
		const {
			getByTestId, findByTestId, mutate, kvTrackEvent,
		} = renderTabs();
		await fireEvent.click(tabButton(getByTestId, 'facebook'));
		await fireEvent.click(getByTestId('invite-share-facebook'));
		expect((await findByTestId('invite-share-facebook-error')).textContent).toContain('blocked the share window');
		expect(mutate).not.toHaveBeenCalled();
		expect(kvTrackEvent).not.toHaveBeenCalled();
	});

	it('shows the blocked-window message on the Tweet tab', async () => {
		openSpy.mockReturnValue(null);
		const { getByTestId, findByTestId, mutate } = renderTabs();
		await showTweet(getByTestId);
		expect((await findByTestId('invite-share-twitter-error')).textContent).toContain('blocked the share window');
		expect(mutate).not.toHaveBeenCalled();
	});

	it('shows the share button loading while the link is made', async () => {
		let resolve;
		const mutate = vi.fn(() => new Promise(r => { resolve = r; }));
		const { getByTestId } = renderTabs({ mutate });
		await fireEvent.click(tabButton(getByTestId, 'facebook'));
		await fireEvent.click(getByTestId('invite-share-facebook'));
		expect(getByTestId('invite-share-facebook').dataset.state).toBe('loading');
		resolve(shareResponse('https://kiva.org/i/abc'));
		await waitFor(() => expect(getByTestId('invite-share-facebook').dataset.state).toBe(''));
		expect(windows[0].location.href).toContain(encodeURIComponent('https://kiva.org/i/abc'));
	});

	it('shares in a window already showing the share site', async () => {
		openSpy.mockImplementation(() => {
			const win = fakeWindow();
			Object.defineProperty(win, 'opener', {
				get: () => null,
				set: () => { throw new Error('SecurityError'); },
			});
			windows.push(win);
			return win;
		});
		const { getByTestId } = renderTabs();
		await fireEvent.click(tabButton(getByTestId, 'facebook'));
		await fireEvent.click(getByTestId('invite-share-facebook'));
		await waitFor(() => expect(windows[0].location.href).toContain('facebook.com/dialog/share'));
	});

	it('leaves the link out of a window the viewer already closed', async () => {
		let resolve;
		const mutate = vi.fn(() => new Promise(r => { resolve = r; }));
		const { getByTestId, emitted } = renderTabs({ mutate });
		await fireEvent.click(tabButton(getByTestId, 'facebook'));
		await fireEvent.click(getByTestId('invite-share-facebook'));
		windows[0].closed = true;
		resolve(shareResponse('https://kiva.org/i/abc'));
		await waitFor(() => expect(emitted().shared).toHaveLength(1));
		expect(windows[0].location.href).toBe('');
	});

	it('shows the personal invite URL and tracks a copy', async () => {
		const { getByTestId, getByLabelText, kvTrackEvent } = renderTabs();
		await fireEvent.click(tabButton(getByTestId, 'url'));
		const input = getByLabelText('Your personal invite URL');
		expect(input.value).toBe(PERSONAL_URL);
		expect(input.readOnly).toBe(true);
		const view = getByTestId('invite-url-view');
		expect(view.getAttribute('href')).toBe(PERSONAL_URL);
		expect(view.getAttribute('target')).toBe('_blank');
		expect(JSON.parse(view.dataset.trackEvent)).toEqual(['portfolio', 'click', 'Invites view personal page']);
		await fireEvent.click(input);
		expect([input.selectionStart, input.selectionEnd]).toEqual([0, PERSONAL_URL.length]);
		await fireEvent.copy(input);
		expect(kvTrackEvent).toHaveBeenCalledWith('portfolio', 'share', 'url');
	});

	it('shows a loader in place of the personal invite URL until it loads', () => {
		const { getByTestId, queryByTestId } = renderTabs({ props: { personalUrl: '', loading: true } });
		expect(getByTestId('invite-url-loading')).toBeTruthy();
		expect(queryByTestId('invite-url-input')).toBeNull();
		expect(queryByTestId('invite-url-view')).toBeNull();
	});

	it('shows the error in place of the personal invite URL when it failed to load', () => {
		const { getByTestId, queryByTestId } = renderTabs({ props: { personalUrl: '', loadError: true } });
		expect(getByTestId('invite-url-error').textContent.trim()).toBe('An error occurred. Please try again.');
		expect(queryByTestId('invite-url-input')).toBeNull();
		expect(queryByTestId('invite-url-view')).toBeNull();
	});

	it('shows an empty personal invite URL, without a loader, when there is none', () => {
		const { getByTestId, queryByTestId } = renderTabs({ props: { personalUrl: '', loading: false } });
		expect(queryByTestId('invite-url-loading')).toBeNull();
		expect(getByTestId('invite-url-input').value).toBe('');
		expect(queryByTestId('invite-url-view')).toBeNull();
	});
});
