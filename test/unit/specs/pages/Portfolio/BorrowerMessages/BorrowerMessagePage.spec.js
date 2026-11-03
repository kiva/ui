import { render } from '@testing-library/vue';
import { ref } from 'vue';
import { useHead } from '@unhead/vue';
import BorrowerMessagePage from '#src/pages/Portfolio/BorrowerMessages/BorrowerMessagePage';

const mockMessage = ref(null);
const mockIsLoggedIn = ref(false);

vi.mock('vue-router', () => ({
	useRoute: () => ({ path: '/portfolio/borrower-messages/123', params: { id: '123' } }),
}));

vi.mock('@unhead/vue', () => ({
	useHead: vi.fn(),
}));

vi.mock('#src/composables/useBorrowerMessage', () => ({
	default: () => ({ message: mockMessage, isLoggedIn: mockIsLoggedIn, loading: ref(false) }),
	BORROWER_MESSAGES_LIST_PATH: '/portfolio/borrower-messages',
}));

const buildMessage = overrides => ({
	id: 123,
	type: 'loan',
	subject: 'Original subject',
	subjectTranslated: null,
	body: '<p>Thanks to <b>your</b> support.</p><script>alert(1)</script>',
	bodyTranslated: null,
	originalLanguage: 'English',
	date: '2026-03-25T19:00:00Z',
	image: {
		id: 1,
		width: 3171,
		height: 2378,
		default: 'https://example.com/update.jpg',
		share: 'https://example.com/update-share.jpg',
	},
	...overrides,
	loan: {
		id: 456,
		name: 'Dina Teresa',
		anonymizationLevel: 'none',
		geocode: { city: 'Agencia El Triunfo', country: { id: 1, name: 'El Salvador' } },
		image: { id: 2, default: 'https://example.com/loan.jpg', share: 'https://example.com/loan-share.jpg' },
		userProperties: { lentTo: true },
		partner: { id: 3, name: 'CrediCampo' },
		...overrides?.loan,
	},
});

const renderPage = (message, { isLoggedIn = false } = {}) => {
	mockMessage.value = message;
	mockIsLoggedIn.value = isLoggedIn;
	return render(BorrowerMessagePage, {
		global: {
			provide: { $appConfig: { host: 'www.kiva.org' } },
			directives: {
				kvTrackEvent: {
					beforeMount(el, { value }) {
						el.setAttribute('data-track-event', JSON.stringify(value));
					},
				},
			},
			stubs: {
				WwwPage: { template: '<div><slot /></div>' },
				RouterLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
			},
		},
	});
};

const getHead = () => useHead.mock.calls.at(-1)[0].value;

beforeEach(() => {
	useHead.mockClear();
});

describe('BorrowerMessagePage', () => {
	it('shows the subject and header byline', () => {
		const { getByRole, getByText } = renderPage(buildMessage());

		getByRole('heading', { level: 1, name: 'Original subject' });
		getByText('Posted by Dina Teresa on Mar 25, 2026');
	});

	it('links logged-in viewers back to the message list', () => {
		const { getByRole } = renderPage(buildMessage(), { isLoggedIn: true });

		expect(getByRole('link', { name: 'Back to message list' }).getAttribute('href'))
			.toBe('/portfolio/borrower-messages');
	});

	it('tracks clicks on the message list link', () => {
		const { getByRole } = renderPage(buildMessage(), { isLoggedIn: true });

		expect(JSON.parse(getByRole('link', { name: 'Back to message list' }).dataset.trackEvent))
			.toEqual(['portfolio', 'click', 'Borrower message back to list']);
	});

	it('hides the message list link from logged-out viewers', () => {
		const { queryByRole } = renderPage(buildMessage());

		expect(queryByRole('link', { name: 'Back to message list' })).toBeNull();
	});

	it('shows the sanitized body', () => {
		const { getByTestId } = renderPage(buildMessage());

		expect(getByTestId('borrower-message-body').innerHTML).toBe('<p>Thanks to <b>your</b> support.</p>');
	});

	it('prefers the translated subject and body', () => {
		const { getByRole, getByTestId } = renderPage(buildMessage({
			subjectTranslated: 'Translated subject',
			bodyTranslated: 'Translated body',
		}));

		getByRole('heading', { level: 1, name: 'Translated subject' });
		expect(getByTestId('borrower-message-body').textContent).toBe('Translated body');
	});

	it('shows the partner signature with the loan location', () => {
		const { getByText } = renderPage(buildMessage());

		getByText('CrediCampo');
		getByText('Posted by Dina Teresa from Agencia El Triunfo, El Salvador · Mar 25, 2026');
	});

	it('falls back to San Francisco when the loan has no location', () => {
		const { getByText } = renderPage(buildMessage({ loan: { geocode: { city: null, country: null } } }));

		getByText('Posted by Dina Teresa from San Francisco, United States · Mar 25, 2026');
	});

	it('shows the update photo, falling back to the loan photo', () => {
		const { getByRole, unmount } = renderPage(buildMessage());
		const photo = getByRole('img');
		expect(photo.getAttribute('src')).toBe('https://example.com/update.jpg');
		expect([photo.getAttribute('width'), photo.getAttribute('height')]).toEqual(['3171', '2378']);
		unmount();

		const { getByRole: getByRoleFallback } = renderPage(buildMessage({ image: null }));
		expect(getByRoleFallback('img', { name: 'Photo of Dina Teresa' }).getAttribute('src'))
			.toBe('https://example.com/loan.jpg');
	});

	it('shows the machine-translation notice with the original text', () => {
		const { getByTestId, getByText } = renderPage(buildMessage({
			subject: 'Asunto',
			subjectTranslated: 'Subject',
			body: 'Cuerpo',
			bodyTranslated: 'Body',
			originalLanguage: 'Spanish',
		}));

		getByText('This update was written in Spanish by Kiva field partner CrediCampo. '
			+ 'We machine-translated it into English for your convenience. The original text is below.');
		getByText('Asunto');
		expect(getByTestId('borrower-message-translation').textContent).toContain('Cuerpo');
	});

	it('writes Arabic and Hebrew originals right to left', () => {
		const { getByText } = renderPage(buildMessage({
			subject: 'موضوع',
			subjectTranslated: 'Subject',
			bodyTranslated: 'Body',
			originalLanguage: 'Arabic',
		}));

		expect(getByText('موضوع').getAttribute('dir')).toBe('rtl');
	});

	it('hides the notice for English updates and untranslated updates', () => {
		const { queryByTestId, unmount } = renderPage(buildMessage({ bodyTranslated: 'Body' }));
		expect(queryByTestId('borrower-message-translation')).toBeNull();
		unmount();

		const { queryByTestId: queryUntranslated } = renderPage(buildMessage({ originalLanguage: 'Spanish' }));
		expect(queryUntranslated('borrower-message-translation')).toBeNull();
	});

	it('links lenders to the loan comments', () => {
		const { getByRole } = renderPage(buildMessage());

		expect(getByRole('link', { name: 'Post a comment on the loan page' }).getAttribute('href'))
			.toBe('/lend/456#loanComments');
	});

	it('tracks clicks on the comment link', () => {
		const { getByRole } = renderPage(buildMessage());

		expect(JSON.parse(getByRole('link', { name: 'Post a comment on the loan page' }).dataset.trackEvent))
			.toEqual(['portfolio', 'click', 'Borrower message post a comment', 123]);
	});

	it('hides the comment link from viewers who have not lent to the loan', () => {
		const { queryByRole } = renderPage(buildMessage({ loan: { userProperties: { lentTo: false } } }));

		expect(queryByRole('link', { name: 'Post a comment on the loan page' })).toBeNull();
	});

	it('shows a placeholder until the message loads', () => {
		const { getByTestId, queryByRole } = renderPage(null);

		getByTestId('borrower-message-loading');
		expect(queryByRole('heading')).toBeNull();
	});

	it('sets the title and share tags', () => {
		renderPage(buildMessage());

		expect(getHead()).toEqual({
			title: 'Update for Dina Teresa\'s Loan',
			meta: [
				{ property: 'og:title', content: 'Update for Dina Teresa\'s Loan' },
				{ property: 'og:description', content: 'Thanks to your support.' },
				{ name: 'description', content: 'Thanks to your support.' },
				{ property: 'og:url', content: 'https://www.kiva.org/portfolio/borrower-messages/123' },
				{ property: 'og:image', content: 'https://example.com/update-share.jpg' },
			],
		});
	});

	it('truncates the share description to 60 words', () => {
		const words = Array.from({ length: 70 }, (_, i) => `w${i}`);
		renderPage(buildMessage({ body: words.join(' ') }));

		const description = getHead().meta.find(tag => tag.property === 'og:description').content;
		expect(description).toBe(`${words.slice(0, 60).join(' ')}…`);
	});

	it('omits the share image for anonymized loans', () => {
		renderPage(buildMessage({ loan: { anonymizationLevel: 'pii' } }));

		expect(getHead().meta.some(tag => tag.property === 'og:image')).toBe(false);
	});

	it('falls back to the page title when the subject is empty', () => {
		const { getByRole } = renderPage(buildMessage({ subject: '' }));

		getByRole('heading', { level: 1, name: 'Update for Dina Teresa\'s Loan' });
	});
});
