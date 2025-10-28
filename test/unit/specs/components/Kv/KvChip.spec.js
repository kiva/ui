import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import KvChip from '#src/components/Kv/KvChip';

describe('KvChip.vue', () => {
	it('renders with required title prop', () => {
		const { getByText } = render(KvChip, {
			props: {
				title: 'Test Filter'
			}
		});

		expect(getByText('Test Filter')).toBeTruthy();
	});

	it('renders as a button element', () => {
		const { container } = render(KvChip, {
			props: {
				title: 'Test Filter'
			}
		});

		const button = container.querySelector('button');
		expect(button).toBeTruthy();
		expect(button.classList.contains('filter-chip')).toBe(true);
	});

	it('renders close icon', () => {
		const { container } = render(KvChip, {
			props: {
				title: 'Test Filter'
			}
		});

		// KvIcon component should be rendered
		const icon = container.querySelector('.filter-close-button');
		expect(icon).toBeTruthy();
	});

	it('emits click-chip event when clicked', async () => {
		const user = userEvent.setup();
		const { container, emitted } = render(KvChip, {
			props: {
				title: 'Test Filter'
			}
		});

		const button = container.querySelector('button');
		await user.click(button);

		expect(emitted()['click-chip']).toBeTruthy();
		expect(emitted()['click-chip'].length).toBe(1);
	});

	it('can be clicked multiple times', async () => {
		const user = userEvent.setup();
		const { container, emitted } = render(KvChip, {
			props: {
				title: 'Test Filter'
			}
		});

		const button = container.querySelector('button');
		await user.click(button);
		await user.click(button);
		await user.click(button);

		expect(emitted()['click-chip'].length).toBe(3);
	});
});
