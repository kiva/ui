import { render } from '@testing-library/vue';
import { TIP, WARNING, ERROR } from '@/api/fixtures/FlashMessageTypeEnum';
import TheTipMessage from '@/components/WwwFrame/TheTipMessage';
import CookieStore from '@/util/cookieStore';

function renderTipMessage(tipMessage, flashMessages) {
	return render(TheTipMessage, {
		provide: {
			apollo: {
				query: () => Promise.resolve({ data: { ...flashMessages } || {} }),
				mutate: () => Promise.resolve({}),
			},
			cookieStore: new CookieStore(),
		},
		mocks: {
			$route: { path: '/' }
		},
		stubs: {
			KvToast: {
				template: '<div v-html="message"></div>',
				data() {
					return { message: '' };
				},
				methods: {
					close: () => {},
					show(message) {
						this.message = message;
					},
				}
			}
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
});
