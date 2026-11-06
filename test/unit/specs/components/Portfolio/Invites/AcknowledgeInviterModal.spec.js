import { render, waitFor, fireEvent } from '@testing-library/vue';
import AcknowledgeInviterModal from '#src/components/Portfolio/Invites/AcknowledgeInviterModal';
import logFormatter from '#src/util/logFormatter';
import { getOperationName } from '../../../../specUtils';
import { FAILED_MUTATIONS, KvButtonStub, KvTextInputStub } from './invitesSpecHelpers';

vi.mock('#src/util/logFormatter', () => ({ default: vi.fn() }));

const NOT_FOUND = 'Oops… we can\'t find your friend\'s invitation in our system! Please try again.';
const INVALID_FORMAT = 'Only your inviter\'s email address, lender url and invitation url are accepted.';
const THANKS = 'Thank you. You helped your friend to get the credit to invite you.';

const inviter = { lender: { id: 601, name: 'Inviter Ivy', publicId: 'ivy' } };

const ackResponse = ({ status = 'ACKNOWLEDGED', lines = [THANKS], inviter: credited = inviter } = {}) => ({
	data: { my: { acknowledgeInviter: { status, lines, inviter: credited } } },
});

const renderModal = ({
	visible = true,
	mutate = vi.fn().mockResolvedValue(ackResponse()),
	cookies = { kv_inv: 'invite-origin' },
	kvTrackEvent = vi.fn(),
} = {}) => ({
	mutate,
	kvTrackEvent,
	...render(AcknowledgeInviterModal, {
		props: { visible },
		global: {
			provide: { apollo: { mutate }, cookieStore: { get: name => cookies[name] } },
			mocks: { $kvTrackEvent: kvTrackEvent },
			stubs: {
				KvLightbox: {
					props: ['visible', 'title'],
					emits: ['lightbox-closed'],
					template: '<div v-if="visible" role="dialog" :aria-label="title"><slot />'
						+ '<button data-testid="lightbox-close" @click="$emit(\'lightbox-closed\')" /></div>',
				},
				KvButton: KvButtonStub,
				KvTextInput: KvTextInputStub,
			},
		},
	}),
});

const LABEL = 'Enter your friend\'s email address or lender page URL (i.e http://kiva.org/lender/kivastaff)';

const submitInviter = async ({ getByLabelText, getByRole }, value) => {
	await fireEvent.update(getByLabelText(LABEL), value);
	await fireEvent.click(getByRole('button', { name: 'Submit' }));
};

describe('AcknowledgeInviterModal', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('shows nothing until it is opened', () => {
		const { queryByRole } = renderModal({ visible: false });
		expect(queryByRole('dialog')).toBeNull();
	});

	it('asks for the inviter', () => {
		const { getByRole, getByText, getByLabelText } = renderModal();
		expect(getByRole('dialog', { name: 'Invited to Kiva by a friend?' })).toBeTruthy();
		expect(getByText(/Say thanks and help them track their overall impact/)).toBeTruthy();
		expect(getByLabelText(LABEL).value).toBe('');
	});

	it('credits the inviter with where the viewer came from, and reports it', async () => {
		const utils = renderModal();
		await submitInviter(utils, 'friend@example.com');
		await waitFor(() => expect(utils.emitted().acknowledged).toHaveLength(1));
		const [{ mutation, variables }] = utils.mutate.mock.calls[0];
		expect(getOperationName(mutation)).toBe('AcknowledgeInviter');
		expect(variables).toEqual({ inviter: 'friend@example.com', inviteRef: 'invite-origin' });
		expect(utils.emitted().acknowledged[0]).toEqual([{ inviter, lines: [THANKS] }]);
		expect(utils.kvTrackEvent).toHaveBeenCalledWith('portfolio', 'click', 'Invites acknowledge inviter');
	});

	it('sends no invite origin when the viewer did not follow an invite link', async () => {
		const utils = renderModal({ cookies: {} });
		await submitInviter(utils, 'friend@example.com');
		await waitFor(() => expect(utils.mutate).toHaveBeenCalled());
		expect(utils.mutate.mock.calls[0][0].variables.inviteRef).toBeNull();
	});

	it.each([
		['NOT_FOUND', [NOT_FOUND]],
		['INVALID_INPUT', [INVALID_FORMAT, NOT_FOUND]],
	])('shows each line and keeps the entry when the result is %s', async (status, lines) => {
		const mutate = vi.fn().mockResolvedValue(ackResponse({ status, lines, inviter: null }));
		const utils = renderModal({ mutate });
		await submitInviter(utils, 'not a friend');
		await waitFor(() => {
			expect(utils.getByTestId('ack-inviter-result').querySelectorAll('p')).toHaveLength(lines.length);
		});
		lines.forEach(line => expect(utils.getByText(line)).toBeTruthy());
		expect(utils.getByLabelText(LABEL).value).toBe('not a friend');
		expect(utils.emitted().acknowledged).toBeUndefined();
		// Only a found-nothing result may mean the viewer was credited elsewhere
		expect(utils.emitted()['not-found']?.length ?? 0).toBe(status === 'NOT_FOUND' ? 1 : 0);
	});

	it('shows what was entered as text', async () => {
		const line = 'Oops <b>x</b>';
		const mutate = vi.fn().mockResolvedValue(ackResponse({ status: 'NOT_FOUND', lines: [line], inviter: null }));
		const utils = renderModal({ mutate });
		await submitInviter(utils, '<b>x</b>');
		expect(await utils.findByText(line)).toBeTruthy();
		expect(utils.getByTestId('ack-inviter-result').querySelector('b')).toBeNull();
	});

	it.each(FAILED_MUTATIONS)('shows a generic error after %s', async (_, makeMutate) => {
		const utils = renderModal({ mutate: makeMutate() });
		await submitInviter(utils, 'friend@example.com');
		expect(await utils.findByText('An error occurred. Please try again.')).toBeTruthy();
		expect(utils.getByLabelText(LABEL).value).toBe('friend@example.com');
		expect(utils.emitted().acknowledged).toBeUndefined();
		expect(logFormatter).toHaveBeenCalledWith(expect.stringContaining('Error acknowledging inviter'), 'error');
	});

	it('disables the form while submitting and ignores another submit', async () => {
		let resolve;
		const mutate = vi.fn(() => new Promise(r => { resolve = r; }));
		const utils = renderModal({ mutate });
		await submitInviter(utils, 'friend@example.com');
		expect(utils.getByRole('button', { name: 'Submit' }).dataset.state).toBe('loading');
		expect(utils.getByLabelText(LABEL).disabled).toBe(true);
		await fireEvent.submit(utils.getByTestId('ack-inviter-form'));
		expect(mutate).toHaveBeenCalledTimes(1);
		resolve(ackResponse({ status: 'NOT_FOUND', lines: [NOT_FOUND], inviter: null }));
		await utils.findByText(NOT_FOUND);
		expect(utils.getByLabelText(LABEL).disabled).toBe(false);
	});

	it('puts focus on the entry when it opens', async () => {
		const utils = renderModal({ visible: false });
		await utils.rerender({ visible: true });
		await waitFor(() => expect(document.activeElement).toBe(utils.getByLabelText(LABEL)));
	});

	it('clears the last entry and message when it opens again', async () => {
		const notFound = ackResponse({ status: 'NOT_FOUND', lines: [NOT_FOUND], inviter: null });
		const utils = renderModal({ mutate: vi.fn().mockResolvedValue(notFound) });
		await submitInviter(utils, 'friend@example.com');
		await utils.findByText(NOT_FOUND);
		await utils.rerender({ visible: false });
		await utils.rerender({ visible: true });
		expect(utils.getByLabelText(LABEL).value).toBe('');
		expect(utils.queryByText(NOT_FOUND)).toBeNull();
	});

	it('puts focus back on the entry after a failed submit', async () => {
		const notFound = ackResponse({ status: 'NOT_FOUND', lines: [NOT_FOUND], inviter: null });
		let respond;
		const utils = renderModal({ mutate: vi.fn(() => new Promise(resolve => { respond = resolve; })) });
		// Focus is on the page while the request runs, as when the browser drops it from the disabled form
		await submitInviter(utils, 'friend@example.com');
		expect(document.activeElement).toBe(document.body);
		respond(notFound);
		await utils.findByText(NOT_FOUND);
		await waitFor(() => expect(document.activeElement).toBe(utils.getByLabelText(LABEL)));
	});

	it('leaves focus alone after a failed submit when the viewer moved it', async () => {
		const notFound = ackResponse({ status: 'NOT_FOUND', lines: [NOT_FOUND], inviter: null });
		const utils = renderModal({ mutate: vi.fn().mockResolvedValue(notFound) });
		const elsewhere = document.createElement('input');
		document.body.appendChild(elsewhere);
		await submitInviter(utils, 'friend@example.com');
		elsewhere.focus();
		await utils.findByText(NOT_FOUND);
		expect(document.activeElement).toBe(elsewhere);
		elsewhere.remove();
	});

	it('asks to close', async () => {
		const { getByTestId, emitted } = renderModal();
		await fireEvent.click(getByTestId('lightbox-close'));
		expect(emitted().close).toHaveLength(1);
	});

	it('suppresses what is entered from session recording', () => {
		const { getByTestId } = renderModal();
		expect(getByTestId('ack-inviter-form').classList.contains('data-hj-suppress')).toBe(true);
	});
});
