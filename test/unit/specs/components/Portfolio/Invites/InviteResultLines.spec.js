import { render } from '@testing-library/vue';
import InviteResultLines from '#src/components/Portfolio/Invites/InviteResultLines';

const box = container => container.querySelector('[role="status"] > div');

describe('InviteResultLines', () => {
	it('keeps an empty status region for screen readers when there is nothing to show', () => {
		const { getByRole, container } = render(InviteResultLines);
		expect(getByRole('status').textContent.trim()).toBe('');
		expect(box(container)).toBeNull();
	});

	it('shows each line in order', () => {
		const { getByRole } = render(InviteResultLines, { props: { lines: ['First', 'Second'] } });
		expect([...getByRole('status').querySelectorAll('p')].map(p => p.textContent.trim()))
			.toEqual(['First', 'Second']);
	});

	it('shows lines as text, not markup', () => {
		const { getByRole } = render(InviteResultLines, { props: { lines: ['<b>bold</b>'] } });
		expect(getByRole('status').querySelector('b')).toBeNull();
		expect(getByRole('status').textContent).toContain('<b>bold</b>');
	});

	it.each([
		[true, 'tw-bg-secondary'],
		[false, 'tw-bg-caution-highlight'],
	])('colors the box by whether the request succeeded (%s)', (success, expected) => {
		const { container } = render(InviteResultLines, { props: { lines: ['Done'], success } });
		expect(box(container).classList.contains(expected)).toBe(true);
	});
});
