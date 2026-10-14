import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import CollapsibleSection from '#src/components/BorrowerProfile/CollapsibleSection';
import { toBeVisible } from '../../../specUtils';

function renderComponent(props = {}, { subtitle } = {}) {
	return render(CollapsibleSection, {
		props: { id: 'bp-test', ...props },
		slots: {
			heading: '<h2>Section title</h2>',
			title: 'Section title',
			...(subtitle ? { subtitle } : {}),
			default: '<p>Section body</p>',
		},
	});
}

describe('CollapsibleSection', () => {
	describe('when collapsible', () => {
		it('starts collapsed with the title in a toggle button', () => {
			const { getByRole, getByText } = renderComponent({ collapsible: true });

			const button = getByRole('button', { name: /Section title/ });
			expect(button.getAttribute('aria-expanded')).toBe('false');
			expect(toBeVisible(getByText('Section body'))).toBe(false);
		});

		it('points the toggle at the body region', () => {
			const { getByRole, getByText } = renderComponent({ collapsible: true });

			const controls = getByRole('button').getAttribute('aria-controls');
			expect(getByText('Section body').closest(`#${controls}`)).not.toBeNull();
		});

		it('opens and closes by click', async () => {
			const user = userEvent.setup();
			const { getByRole, getByText } = renderComponent({ collapsible: true });
			const button = getByRole('button');

			await user.click(button);
			expect(button.getAttribute('aria-expanded')).toBe('true');
			expect(toBeVisible(getByText('Section body'))).toBe(true);

			await user.click(button);
			expect(button.getAttribute('aria-expanded')).toBe('false');
		});

		it('opens by keyboard', async () => {
			const user = userEvent.setup();
			const { getByRole } = renderComponent({ collapsible: true });
			const button = getByRole('button');

			button.focus();
			await user.keyboard('{Enter}');
			expect(button.getAttribute('aria-expanded')).toBe('true');

			await user.keyboard(' ');
			expect(button.getAttribute('aria-expanded')).toBe('false');
		});

		it('shows the subtitle in the collapsed row', () => {
			const { getByRole } = renderComponent({ collapsible: true }, { subtitle: 'Row subtitle' });

			expect(getByRole('button', { name: /Row subtitle/ })).toBeTruthy();
		});
	});

	describe('when not collapsible', () => {
		it('renders the section heading and the body with no toggle', () => {
			const { getByRole, queryByRole, getByText } = renderComponent({ collapsible: false });

			expect(getByRole('heading', { level: 2, name: 'Section title' })).toBeTruthy();
			expect(queryByRole('button')).toBeNull();
			expect(toBeVisible(getByText('Section body'))).toBe(true);
		});

		it('does not render the subtitle', () => {
			const { queryByText } = renderComponent({ collapsible: false }, { subtitle: 'Row subtitle' });

			expect(queryByText('Row subtitle')).toBeNull();
		});
	});
});
