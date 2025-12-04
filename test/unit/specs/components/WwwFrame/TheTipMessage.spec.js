import { render } from '@testing-library/vue';
import { TIP, WARNING, ERROR } from '#src/api/fixtures/FlashMessageTypeEnum';
import TheTipMessage from '#src/components/WwwFrame/TheTipMessage';
import CookieStore from '#src/util/cookieStore';

function renderTipMessage(tipMessage, flashMessages, withUiv = false) {
	// Create cookieStore with or without uiv based on parameter
	const cookies = withUiv ? { uiv: 'test-visitor-id-123' } : {};
	const cookieStore = new CookieStore(cookies);

	return render(TheTipMessage, {
		global: {
			provide: {
				apollo: {
					query: () => Promise.resolve({ data: { ...flashMessages } || {} }),
					mutate: () => Promise.resolve({}),
				},
				cookieStore,
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
		const { findByText } = renderTipMessage(null, defaultFlashMessages, true);

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
		const { findByText, queryByText } = renderTipMessage(tipMessage, defaultFlashMessages, true);

		// Expect the first flash message to be displayed
		await findByText('This is an error message');
		expect(queryByText('This is a warning message')).toBeNull();
		expect(queryByText('This is an info message')).toBeNull();
		expect(queryByText('This is a tip message')).toBeNull();
	});

	// it calls apollo.query and apollo.mutate when uiv cookie is present
	it('calls apollo.query and apollo.mutate when uiv cookie is present', async () => {
		const cookies = { uiv: 'test-visitor-id-123' };
		const cookieStore = new CookieStore(cookies);

		const apolloQuerySpy = vi.fn(() => Promise.resolve({ data: defaultFlashMessages }));
		const apolloMutateSpy = vi.fn(() => Promise.resolve({}));

		render(TheTipMessage, {
			global: {
				provide: {
					apollo: {
						query: apolloQuerySpy,
						mutate: apolloMutateSpy,
					},
					cookieStore,
				},
				mocks: {
					$route: { path: '/' },
				},
				stubs: {
					KvToast: {
						template: '<div></div>',
						methods: {
							close: () => { },
							show: () => { },
						}
					}
				},
			},
		});

		// Wait for mounted hook and promises to complete
		await vi.waitFor(() => expect(apolloQuerySpy).toHaveBeenCalled());
		await vi.waitFor(() => expect(apolloMutateSpy).toHaveBeenCalled());

		// Expect apollo.query to have been called with visitorId
		expect(apolloQuerySpy).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: expect.objectContaining({
					visitorId: 'test-visitor-id-123',
				}),
			})
		);

		// Expect apollo.mutate to have been called with visitorId
		expect(apolloMutateSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: expect.objectContaining({
					visitorId: 'test-visitor-id-123',
				}),
			})
		);
	});

	// it does not call apollo.query or apollo.mutate when uiv cookie is absent
	it('does not call apollo.query or apollo.mutate when uiv cookie is absent', async () => {
		const cookieStore = new CookieStore({});
		// Do not set uiv cookie

		const apolloQuerySpy = vi.fn(() => Promise.resolve({ data: defaultFlashMessages }));
		const apolloMutateSpy = vi.fn(() => Promise.resolve({}));

		render(TheTipMessage, {
			global: {
				provide: {
					apollo: {
						query: apolloQuerySpy,
						mutate: apolloMutateSpy,
					},
					cookieStore,
				},
				mocks: {
					$route: { path: '/' },
				},
				stubs: {
					KvToast: {
						template: '<div></div>',
						methods: {
							close: () => { },
							show: () => { },
						}
					}
				},
			},
		});

		// Wait a bit to ensure mounted hook has completed
		await new Promise(resolve => { setTimeout(resolve, 100); });

		// Expect apollo.query to NOT have been called
		expect(apolloQuerySpy).not.toHaveBeenCalled();

		// Expect apollo.mutate to NOT have been called
		expect(apolloMutateSpy).not.toHaveBeenCalled();
	});
});
