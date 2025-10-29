import { render } from '@testing-library/vue';
import KvSettingsCard from '../../../../../src/components/Kv/KvSettingsCard';

describe('KvSettingsCard.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvSettingsCard).toBeDefined();
		expect(KvSettingsCard.name).toBe('KvSettingsCard');
	});

	it('renders the card container', () => {
		const { container } = render(KvSettingsCard);

		const card = container.querySelector('.tw-bg-primary');
		expect(card).toBeTruthy();
	});

	it('renders title when provided', () => {
		const { container } = render(KvSettingsCard, {
			props: {
				title: 'Settings Title'
			}
		});

		const title = container.querySelector('h2');
		expect(title).toBeTruthy();
		expect(title.textContent).toBe('Settings Title');
	});

	it('does not render title when not provided', () => {
		const { container } = render(KvSettingsCard);

		const title = container.querySelector('h2');
		expect(title).toBeFalsy();
	});

	it('has empty string as default title', () => {
		const { container } = render(KvSettingsCard);

		expect(container.querySelector('h2')).toBeFalsy();
	});

	it('renders content slot', () => {
		const { container } = render(KvSettingsCard, {
			slots: {
				content: '<p>Card content here</p>'
			}
		});

		expect(container.textContent).toContain('Card content here');
	});

	it('is not disabled by default', () => {
		const { container } = render(KvSettingsCard);

		const card = container.querySelector('.tw-bg-primary');
		expect(card.classList.contains('tw-opacity-low')).toBe(false);
		expect(card.classList.contains('tw-pointer-events-none')).toBe(false);
	});

	it('applies disabled styling when disabled prop is true', () => {
		const { container } = render(KvSettingsCard, {
			props: {
				disabled: true
			}
		});

		const card = container.querySelector('.tw-bg-primary');
		expect(card.classList.contains('tw-opacity-low')).toBe(true);
		expect(card.classList.contains('tw-pointer-events-none')).toBe(true);
	});

	it('applies correct padding classes', () => {
		const { container } = render(KvSettingsCard);

		const card = container.querySelector('.tw-bg-primary');
		expect(card.classList.contains('tw-p-4')).toBe(true);
	});

	it('applies correct margin classes', () => {
		const { container } = render(KvSettingsCard);

		const card = container.querySelector('.tw-bg-primary');
		expect(card.classList.contains('tw-mb-4')).toBe(true);
	});

	it('renders title with correct margin when provided', () => {
		const { container } = render(KvSettingsCard, {
			props: {
				title: 'Test Title'
			}
		});

		const title = container.querySelector('h2');
		expect(title.classList.contains('tw-mb-2')).toBe(true);
	});
});
