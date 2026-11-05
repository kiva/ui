import { render, waitFor, fireEvent } from '@testing-library/vue';
import InviteComposer from '#src/components/Portfolio/Invites/InviteComposer';
import logFormatter from '#src/util/logFormatter';
import { getOperationName } from '../../../../specUtils';

vi.mock('#src/util/logFormatter', () => ({ default: vi.fn() }));

const DEFAULT_MESSAGE = 'With Kiva, you can make a difference by lending just $25 to people around the globe. '
	+ 'I\'m already lending on Kiva and thought you\'d like to join me!';

const sendResponse = ({ success = true, lines = ['Invitations Sent: friend@example.com'], results } = {}) => ({
	data: {
		my: {
			sendInvites: {
				success,
				lines,
				results: results ?? [{ email: 'friend@example.com', status: 'SENT' }],
			},
		},
	},
});

const renderComposer = ({
	props = { firstName: 'Casey', isPublic: true }, mutate = vi.fn(), kvTrackEvent = vi.fn(),
} = {}) => render(InviteComposer, {
	props,
	global: {
		provide: { apollo: { mutate } },
		mocks: { $kvTrackEvent: kvTrackEvent },
		stubs: {
			KvButton: {
				props: ['state', 'type'],
				// Like KvButton, disabled while loading
				template: '<button :type="type" :data-state="state" '
					+ ':disabled="state === \'disabled\' || state === \'loading\'"><slot /></button>',
			},
			// Like KvTextInput, passes other listeners, such as change, to the input
			KvTextInput: {
				inheritAttrs: false,
				props: ['modelValue', 'id', 'disabled'],
				emits: ['update:modelValue'],
				template: '<input :id="id" :value="modelValue" :disabled="disabled" v-bind="$attrs" '
					+ '@input="$emit(\'update:modelValue\', $event.target.value)">',
			},
		},
	},
});

// Resolves the next mutate call when called
const deferredMutate = () => {
	let resolve;
	const mutate = vi.fn(() => new Promise(r => { resolve = r; }));
	return { mutate, resolve: value => resolve(value) };
};

describe('InviteComposer', () => {
	it('signs the defaults with the first name of a public viewer', () => {
		const { getByLabelText } = renderComposer();
		expect(getByLabelText('Email addresses').tagName).toBe('TEXTAREA');
		expect(getByLabelText('From').value).toBe('Casey');
		// The sender can't be changed here
		expect(getByLabelText('From').disabled).toBe(true);
		expect(getByLabelText('Subject').value).toBe('Casey invites you to make a difference on Kiva!');
		expect(getByLabelText('Message').value).toBe(`${DEFAULT_MESSAGE}\n\n- Casey`);
	});

	it.each([
		['a private viewer', { firstName: 'Casey', isPublic: false }],
		['a public viewer without a first name', { firstName: '', isPublic: true }],
	])('keeps %s anonymous', (_, props) => {
		const { getByLabelText } = renderComposer({ props });
		expect(getByLabelText('From').value).toBe('Anonymous');
		expect(getByLabelText('Subject').value).toBe('You\'re invited to make a difference on Kiva!');
		expect(getByLabelText('Message').value).toBe(DEFAULT_MESSAGE);
	});

	it('fills the defaults once the viewer loads', async () => {
		const { getByLabelText, rerender } = renderComposer({ props: { disabled: true } });
		expect(getByLabelText('Subject').value).toBe('You\'re invited to make a difference on Kiva!');
		await rerender({ firstName: 'Casey', isPublic: true, disabled: false });
		expect(getByLabelText('Subject').value).toBe('Casey invites you to make a difference on Kiva!');
		expect(getByLabelText('Message').value).toBe(`${DEFAULT_MESSAGE}\n\n- Casey`);
	});

	it('disables every control while disabled, and does not send', async () => {
		const mutate = vi.fn();
		const { getByTestId, getByRole, container } = renderComposer({ props: { disabled: true }, mutate });
		['invite-composer-emails', 'invite-composer-message'].forEach(id => {
			expect(getByTestId(id).disabled).toBe(true);
		});
		['From', 'Subject'].forEach(label => {
			expect(container.querySelector(`#invite-composer-${label.toLowerCase()}`).disabled).toBe(true);
		});
		expect(getByRole('button', { name: 'Send invitations' }).disabled).toBe(true);
		await fireEvent.submit(container.querySelector('form'));
		expect(mutate).not.toHaveBeenCalled();
	});

	it('sends what the viewer entered and tracks the send', async () => {
		const mutate = vi.fn().mockResolvedValue(sendResponse());
		const kvTrackEvent = vi.fn();
		const {
			getByTestId, getByLabelText, getByRole,
		} = renderComposer({ mutate, kvTrackEvent });
		await fireEvent.update(getByTestId('invite-composer-emails'), 'a@example.com, b@example.com');
		await fireEvent.update(getByLabelText('Subject'), 'Hi');
		await fireEvent.update(getByLabelText('Message'), 'Join me');
		await fireEvent.click(getByRole('button', { name: 'Send invitations' }));
		await waitFor(() => expect(mutate).toHaveBeenCalledTimes(1));
		const [{ mutation, variables }] = mutate.mock.calls[0];
		expect(getOperationName(mutation)).toBe('SendInvites');
		expect(variables).toEqual({ emails: 'a@example.com, b@example.com', subject: 'Hi', message: 'Join me' });
		expect(kvTrackEvent).toHaveBeenCalledWith('portfolio', 'click', 'Invites send email');
	});

	it.each([
		['recipients', 'invite-composer-emails'],
		['subject', 'invite-composer-subject'],
		['message', 'invite-composer-message'],
	])('tracks a change to the %s', async (field, testId) => {
		const kvTrackEvent = vi.fn();
		const { getByTestId } = renderComposer({ kvTrackEvent });
		await fireEvent.update(getByTestId(testId), 'edited');
		expect(kvTrackEvent).not.toHaveBeenCalled();
		await fireEvent.change(getByTestId(testId));
		expect(kvTrackEvent).toHaveBeenCalledTimes(1);
		expect(kvTrackEvent).toHaveBeenCalledWith('portfolio', 'change', `Invites email ${field}`);
	});

	it('does not track a change when the form resets after a send', async () => {
		const mutate = vi.fn().mockResolvedValue(sendResponse());
		const kvTrackEvent = vi.fn();
		const { getByTestId, getByRole, findByText } = renderComposer({ mutate, kvTrackEvent });
		await fireEvent.update(getByTestId('invite-composer-emails'), 'a@example.com');
		await fireEvent.click(getByRole('button', { name: 'Send invitations' }));
		await findByText('Invitations Sent: friend@example.com');
		expect(getByTestId('invite-composer-emails').value).toBe('');
		expect(kvTrackEvent.mock.calls).toEqual([['portfolio', 'click', 'Invites send email']]);
	});

	it('shows each result line as text and resets the form after a successful send', async () => {
		const lines = ['Invitations Sent: <b>a@example.com</b>', 'Already Invited: b@example.com'];
		const mutate = vi.fn().mockResolvedValue(sendResponse({ lines }));
		const {
			getByTestId, getByLabelText, getByRole, findByText, emitted,
		} = renderComposer({ mutate });
		await fireEvent.update(getByTestId('invite-composer-emails'), 'a@example.com b@example.com');
		await fireEvent.update(getByLabelText('Subject'), 'Hi');
		await fireEvent.update(getByLabelText('Message'), 'Join me');
		await fireEvent.click(getByRole('button', { name: 'Send invitations' }));
		expect(await findByText('Invitations Sent: <b>a@example.com</b>')).toBeTruthy();
		expect(getByTestId('invite-composer-result').querySelectorAll('p')).toHaveLength(2);
		expect(getByTestId('invite-composer-result').querySelector('b')).toBeNull();
		expect(getByTestId('invite-composer-emails').value).toBe('');
		expect(getByLabelText('Subject').value).toBe('Casey invites you to make a difference on Kiva!');
		expect(getByLabelText('Message').value).toBe(`${DEFAULT_MESSAGE}\n\n- Casey`);
		expect(emitted().sent).toHaveLength(1);
	});

	it('keeps what was entered and does not report a send when the send is refused', async () => {
		const lines = ['In order to send invites, you will need to make a loan using your own funds first.'];
		const mutate = vi.fn().mockResolvedValue(sendResponse({ success: false, lines, results: [] }));
		const {
			getByTestId, getByLabelText, getByRole, findByText, emitted,
		} = renderComposer({ mutate });
		await fireEvent.update(getByTestId('invite-composer-emails'), 'a@example.com');
		await fireEvent.update(getByLabelText('Subject'), 'Hi');
		await fireEvent.click(getByRole('button', { name: 'Send invitations' }));
		expect(await findByText(lines[0])).toBeTruthy();
		expect(getByTestId('invite-composer-emails').value).toBe('a@example.com');
		expect(getByLabelText('Subject').value).toBe('Hi');
		expect(emitted().sent).toBeUndefined();
	});

	it('resets the form but does not report a send when no address was sent', async () => {
		const mutate = vi.fn().mockResolvedValue(sendResponse({
			lines: ['Already Invited: a@example.com'],
			results: [{ email: 'a@example.com', status: 'ALREADY_INVITED' }],
		}));
		const {
			getByTestId, getByRole, findByText, emitted,
		} = renderComposer({ mutate });
		await fireEvent.update(getByTestId('invite-composer-emails'), 'a@example.com');
		await fireEvent.click(getByRole('button', { name: 'Send invitations' }));
		await findByText('Already Invited: a@example.com');
		expect(getByTestId('invite-composer-emails').value).toBe('');
		expect(emitted().sent).toBeUndefined();
	});

	it.each([
		['GraphQL errors', () => vi.fn().mockResolvedValue({ data: null, errors: [{ message: 'boom' }] })],
		['a missing result', () => vi.fn().mockResolvedValue({ data: { my: null } })],
		['a network failure', () => vi.fn().mockRejectedValue(new Error('offline'))],
	])('shows a generic error and keeps what was entered after %s', async (_, makeMutate) => {
		const {
			getByTestId, getByRole, findByText, emitted,
		} = renderComposer({ mutate: makeMutate() });
		await fireEvent.update(getByTestId('invite-composer-emails'), 'a@example.com');
		await fireEvent.click(getByRole('button', { name: 'Send invitations' }));
		expect(await findByText('An error occurred. Please try again.')).toBeTruthy();
		expect(getByTestId('invite-composer-emails').value).toBe('a@example.com');
		expect(emitted().sent).toBeUndefined();
		expect(logFormatter).toHaveBeenCalledWith(expect.stringContaining('Error sending invites'), 'error');
	});

	it('disables the form while sending and ignores another submit', async () => {
		const { mutate, resolve } = deferredMutate();
		const {
			getByTestId, getByLabelText, getByRole, container, findByText,
		} = renderComposer({ mutate });
		await fireEvent.update(getByTestId('invite-composer-emails'), 'a@example.com');
		await fireEvent.click(getByRole('button', { name: 'Send invitations' }));
		expect(getByRole('button', { name: 'Send invitations' }).dataset.state).toBe('loading');
		expect(getByTestId('invite-composer-emails').disabled).toBe(true);
		expect(getByLabelText('Subject').disabled).toBe(true);
		expect(getByLabelText('Message').disabled).toBe(true);
		await fireEvent.submit(container.querySelector('form'));
		expect(mutate).toHaveBeenCalledTimes(1);
		resolve(sendResponse());
		await findByText('Invitations Sent: friend@example.com');
		expect(getByRole('button', { name: 'Send invitations' }).disabled).toBe(false);
		expect(getByTestId('invite-composer-emails').disabled).toBe(false);
	});

	it('clears the previous result while sending', async () => {
		const mutate = vi.fn().mockResolvedValueOnce(sendResponse());
		const {
			getByTestId, getByRole, findByText, queryByText,
		} = renderComposer({ mutate });
		await fireEvent.click(getByRole('button', { name: 'Send invitations' }));
		await findByText('Invitations Sent: friend@example.com');
		mutate.mockReturnValueOnce(new Promise(() => {}));
		await fireEvent.update(getByTestId('invite-composer-emails'), 'b@example.com');
		await fireEvent.click(getByRole('button', { name: 'Send invitations' }));
		expect(queryByText('Invitations Sent: friend@example.com')).toBeNull();
	});

	it('moves focus to the result when the send button loses it', async () => {
		const mutate = vi.fn().mockResolvedValue(sendResponse());
		const { getByRole, getByTestId } = renderComposer({ mutate });
		// Focus stays on the page, as when a browser drops it from the button once it is disabled
		await fireEvent.click(getByRole('button', { name: 'Send invitations' }));
		expect(document.activeElement).toBe(document.body);
		await waitFor(() => expect(document.activeElement).toBe(getByTestId('invite-composer-result')));
	});

	it('leaves focus alone when it is still in the form', async () => {
		const mutate = vi.fn().mockResolvedValue(sendResponse());
		const { getByRole, getByTestId, findByText } = renderComposer({ mutate });
		const emails = getByTestId('invite-composer-emails');
		await fireEvent.click(getByRole('button', { name: 'Send invitations' }));
		emails.focus();
		await findByText('Invitations Sent: friend@example.com');
		expect(document.activeElement).toBe(emails);
	});
});
