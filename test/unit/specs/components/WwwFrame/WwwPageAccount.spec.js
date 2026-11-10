import { render } from '@testing-library/vue';
import WwwPageAccount from '#src/components/WwwFrame/WwwPageAccount';

const renderFrame = (props = {}, slots = {}) => render(WwwPageAccount, {
	props: { title: 'A title', ...props },
	slots,
	global: {
		stubs: { WwwPage: { template: '<div><slot /></div>' } },
	},
});

describe('WwwPageAccount', () => {
	it('renders the eyebrow, title as the only h1, and subtitle', () => {
		const { getByText, getAllByRole } = renderFrame({ eyebrow: 'Your account', subtitle: 'A subtitle' });

		getByText('Your account');
		getByText('A subtitle');
		const headings = getAllByRole('heading', { level: 1 });
		expect(headings).toHaveLength(1);
		expect(headings[0].textContent.trim()).toBe('A title');
	});

	it('omits the eyebrow and subtitle when empty', () => {
		const { queryByTestId } = renderFrame();

		expect(queryByTestId('account-frame-eyebrow')).toBeNull();
		expect(queryByTestId('account-frame-subtitle')).toBeNull();
	});

	it('renders the nav slot before the header and content after it', () => {
		const { container } = renderFrame({}, {
			nav: '<nav data-testid="nav">Nav</nav>',
			default: '<p data-testid="content">Content</p>',
		});
		const order = [...container.querySelectorAll('[data-testid="nav"], h1, [data-testid="content"]')]
			.map(el => el.dataset.testid ?? el.tagName.toLowerCase());

		expect(order).toEqual(['nav', 'h1', 'content']);
	});

	it('does not hide the title from session recordings', () => {
		const { getByRole } = renderFrame();

		expect(getByRole('heading', { level: 1 }).hasAttribute('data-hj-suppress')).toBe(false);
	});

	it('renders a title slot in place of the title prop', () => {
		const { getByRole } = renderFrame({ title: '' }, { title: '<span data-testid="slotted">Slotted</span> title' });

		expect(getByRole('heading', { level: 1 }).textContent.trim()).toBe('Slotted title');
	});
});
