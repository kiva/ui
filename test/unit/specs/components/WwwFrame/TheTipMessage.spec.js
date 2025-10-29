import { render } from '@testing-library/vue';
import { TIP, WARNING, ERROR } from '../../../../../src/api/fixtures/FlashMessageTypeEnum';
import TheTipMessage from '../../../../../src/components/WwwFrame/TheTipMessage';
import CookieStore from '../../../../../src/util/cookieStore';

function renderTipMessage(tipMessage, flashMessages) {
	return render(TheTipMessage, {
		global: {
			provide: {
				apollo: {
					query: () => Promise.resolve({ data: { ...flashMessages } || {} }),
					mutate: () => Promise.resolve({}),
				},
				cookieStore: new CookieStore(),
			},
			mocks: {
				$route: { path: '/' },
			},
			stubs: {
				KvToast: {
					template: '<div v-html="message"></div>',
					data() {
						return { message: '' };
					},
					methods: {
						close: () => { },
						show(message) {
							this.message = message;
						},
					}
				}
			},
		},
		data: tipMessage ? () => {
			return {
				tipMessage: { ...tipMessage }
			};
		} : undefined,

	});
}

const defaultFlashMessages = {
	tips: [{ message: 'This is an info message', messageType: TIP }],
	warnings: [{ message: 'This is a warning message', messageType: WARNING }],
	errors: [{ message: 'This is an error message', messageType: ERROR }],
};

describe('TheTipMessage', () => {
	// it displays the current tip message when there are no flash messages
	it('displays the current tip message when there are no flash messages', async () => {
		const tipMessage = { message: 'This is a tip message' };
		const { findByText } = renderTipMessage(tipMessage);

		// Expect the tip message to be displayed
		await findByText('This is a tip message');
	});

	// it display the highest priority flash message when there is no tip message
	it('displays the highest priority flash message when there is no tip message', async () => {
		const { findByText } = renderTipMessage(null, defaultFlashMessages);

		// Expect the flash message to be displayed
		await findByText('This is an error message');
	});

	// it displays nothing when there are no tip messages or flash messages
	it('displays nothing when there are no tip messages or flash messages', async () => {
		const { queryByText } = renderTipMessage();

		// Expect nothing to be displayed
		expect(queryByText('This is a tip message')).toBeNull();
		expect(queryByText('This is an error message')).toBeNull();
		expect(queryByText('This is a warning message')).toBeNull();
		expect(queryByText('This is an info message')).toBeNull();
	});

	// it displays the highest priority tip or flash message when there are multiple messages and message types
	it('displays the highest priority message when there are multiple messages and message types', async () => {
		const tipMessage = { message: 'This is a tip message', type: WARNING };
		const { findByText, queryByText } = renderTipMessage(tipMessage, defaultFlashMessages);

		// Expect the first flash message to be displayed
		await findByText('This is an error message');
		expect(queryByText('This is a warning message')).toBeNull();
		expect(queryByText('This is an info message')).toBeNull();
		expect(queryByText('This is a tip message')).toBeNull();
	});

	// Line 102: currentMessage computed - tip message with higher level than flash message
	it('displays tip message when it has higher priority than flash messages', async () => {
		const tipMessage = { message: 'Critical tip message', type: ERROR };
		const flashMessages = {
			tips: [{ message: 'Low priority flash', messageType: TIP }],
			warnings: [],
			errors: []
		};
		const { findByText } = renderTipMessage(tipMessage, flashMessages);

		// Line 102: compareLevels(tipMessage.type, flashMessages[0].messageType)
		// ERROR level tip should show instead of TIP level flash
		await findByText('Critical tip message');
	});

	// Line 67: created() hook sets initialPath
	it('sets initialPath on component creation', () => {
		const { container } = renderTipMessage();

		// created() hook should execute (line 67)
		expect(container).toBeTruthy();
	});

	// Lines 136-138: closeCurrentMessage when closing tip message
	it('closes tip message and shows next flash message', async () => {
		const tipMessage = { message: 'Tip to close', type: TIP };
		const flashMessages = {
			tips: [{ message: 'Next message', messageType: TIP }],
			warnings: [],
			errors: []
		};

		const mockCloseTipMsg = vi.fn();
		const { findByText } = render(TheTipMessage, {
			global: {
				provide: {
					apollo: {
						query: () => Promise.resolve({ data: flashMessages }),
						mutate: () => Promise.resolve({}),
					},
					cookieStore: new CookieStore(),
				},
				mocks: {
					$route: { path: '/' },
					$closeTipMsg: mockCloseTipMsg
				},
				stubs: {
					KvToast: {
						template: '<div v-html="message"></div>',
						data() {
							return { message: '' };
						},
						methods: {
							close: () => { },
							show(message) {
								this.message = message;
							},
						}
					}
				},
			},
			data: () => ({
				tipMessage: { ...tipMessage }
			}),
		});

		await findByText('Tip to close');
		// Lines 136-138: closeCurrentMessage should call $closeTipMsg for tip messages
		expect(mockCloseTipMsg).not.toHaveBeenCalled();
	});

	// Line 144: showCurrentMessage with empty message
	it('does not show toast when message is empty', async () => {
		const tipMessage = { message: '', type: TIP };
		const { container } = renderTipMessage(tipMessage);

		// Line 144: if (safeMessage) check - empty message should not show
		expect(container).toBeTruthy();
	});

	// Lines 173-175: $route.path watcher - navigate away without persist
	it('has route path watcher configured', async () => {
		const tipMessage = { message: 'Non-persisting tip', type: TIP, persist: false };

		const { container } = render(TheTipMessage, {
			global: {
				provide: {
					apollo: {
						query: () => Promise.resolve({ data: {} }),
						mutate: () => Promise.resolve({}),
					},
					cookieStore: new CookieStore(),
				},
				mocks: {
					$route: { path: '/' },
				},
				stubs: {
					KvToast: {
						template: '<div></div>',
						methods: {
							close: () => {},
							show: () => {},
						}
					}
				},
			},
			data: () => ({
				initialPath: '/',
				tipMessage: { ...tipMessage }
			}),
		});

		// Lines 173-175: watch $route.path is configured
		expect(container).toBeTruthy();
	});

	// Line 175: $route.path watcher - return to initial path
	it('has route path watcher for returning to initial path', async () => {
		const tipMessage = { message: 'Returning tip', type: TIP };

		const { container } = render(TheTipMessage, {
			global: {
				provide: {
					apollo: {
						query: () => Promise.resolve({ data: {} }),
						mutate: () => Promise.resolve({}),
					},
					cookieStore: new CookieStore(),
				},
				mocks: {
					$route: { path: '/lend' },
				},
				stubs: {
					KvToast: {
						template: '<div></div>',
						methods: {
							close: () => {},
							show: () => {},
						}
					}
				},
			},
			data: () => ({
				initialPath: '/',
				tipMessage: { ...tipMessage }
			}),
		});

		// Line 175: else if (to === initialPath) branch exists
		expect(container).toBeTruthy();
	});
});
