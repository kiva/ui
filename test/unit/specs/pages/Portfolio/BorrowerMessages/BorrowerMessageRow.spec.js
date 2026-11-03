import { render, fireEvent } from '@testing-library/vue';
import BorrowerMessageRow from '#src/pages/Portfolio/BorrowerMessages/BorrowerMessageRow';

const RouterLinkStub = {
	props: ['to'],
	template: '<a :href="to"><slot /></a>',
};

const buildMessage = overrides => ({
	id: 123,
	authorName: 'Field Partner Staff',
	subject: 'Original subject',
	subjectTranslated: null,
	body: '<p>Thanks to <b>your</b> support &amp; help.</p>',
	bodyTranslated: null,
	date: '2026-07-01T19:00:00Z',
	image: {
		id: 1,
		default: 'https://example.com/update-s120.jpg',
		retina: 'https://example.com/update-s240.jpg',
	},
	loan: {
		id: 456,
		name: 'Maria',
		geocode: { country: { id: 1, name: 'Philippines' } },
		image: {
			id: 2,
			default: 'https://example.com/loan-s120.jpg',
			retina: 'https://example.com/loan-s240.jpg',
		},
		partner: { id: 3, name: 'NWTF' },
	},
	...overrides,
});

const renderRow = message => render(BorrowerMessageRow, {
	props: { message },
	global: {
		stubs: { RouterLink: RouterLinkStub },
		directives: { kvTrackEvent: {} },
	},
});

describe('BorrowerMessageRow', () => {
	it('links to the message detail page', () => {
		const { getByRole } = renderRow(buildMessage());

		expect(getByRole('link').getAttribute('href')).toBe('/portfolio/borrower-messages/123');
	});

	it('opens the message when the row is clicked', async () => {
		const { getByRole, getByText } = renderRow(buildMessage());
		const onLinkClick = vi.fn();
		getByRole('link').addEventListener('click', onLinkClick);

		await fireEvent.click(getByText('Maria · Philippines'));

		expect(onLinkClick).toHaveBeenCalledTimes(1);
	});

	it('does not open the message when the click ends a text selection', async () => {
		const { getByRole, getByText } = renderRow(buildMessage());
		const onLinkClick = vi.fn();
		getByRole('link').addEventListener('click', onLinkClick);
		const body = getByText('Thanks to your support & help.');
		window.getSelection().selectAllChildren(body);

		await fireEvent.click(body);

		expect(onLinkClick).not.toHaveBeenCalled();
		window.getSelection().removeAllRanges();
	});

	it('shows the subject, borrower, plain-text body and signature', () => {
		const { getByRole, getByText } = renderRow(buildMessage());

		expect(getByRole('heading', { name: 'Original subject' })).toBeDefined();
		getByText('Maria · Philippines');
		getByText('Thanks to your support & help.');
		getByText('Posted by Field Partner Staff · July 1, 2026');
	});

	it('prefers the translated subject and body', () => {
		const { getByRole, getByText, queryByText } = renderRow(buildMessage({
			subjectTranslated: 'Translated subject',
			bodyTranslated: 'Translated body',
		}));

		expect(getByRole('heading', { name: 'Translated subject' })).toBeDefined();
		getByText('Translated body');
		expect(queryByText(/Thanks to/)).toBeNull();
	});

	it('falls back to the partner name when there is no author', () => {
		const { getByText } = renderRow(buildMessage({ authorName: null }));

		getByText('Posted by NWTF · July 1, 2026');
	});

	it('shows only the date when there is no author or partner', () => {
		const message = buildMessage({ authorName: '' });
		delete message.loan.partner;
		const { getByText } = renderRow(message);

		getByText('July 1, 2026');
	});

	it('uses the update image as the thumbnail', () => {
		const { container } = renderRow(buildMessage());
		const img = container.querySelector('img');

		expect(img.getAttribute('src')).toBe('https://example.com/update-s120.jpg');
		expect(img.getAttribute('srcset')).toBe('https://example.com/update-s240.jpg 2x');
	});

	it('falls back to the loan image when the update has no image', () => {
		const { container } = renderRow(buildMessage({ image: null }));

		expect(container.querySelector('img').getAttribute('src')).toBe('https://example.com/loan-s120.jpg');
	});

	it('falls back to the Kiva placeholder when neither image exists', () => {
		const message = buildMessage({ image: null });
		message.loan.image = null;
		const { container, getByTestId } = renderRow(message);

		getByTestId('borrower-message-placeholder');
		expect(container.querySelector('img').getAttribute('src')).toMatch(/kiva_k/);
	});
});
