import { render } from '@testing-library/vue';
import KvProgressBar from '../../../../../src/components/Kv/KvProgressBar';

describe('KvProgressBar.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvProgressBar).toBeDefined();
		expect(KvProgressBar.name).toBe('KvProgressBar');
	});

	it('renders a progress element', () => {
		const { container } = render(KvProgressBar, {
			props: {
				value: '50'
			}
		});

		expect(container.querySelector('progress')).toBeTruthy();
	});

	it('requires value prop', () => {
		const { container } = render(KvProgressBar, {
			props: {
				value: '75'
			}
		});

		const progress = container.querySelector('progress');
		expect(progress.value).toBe(75);
	});

	it('has default max prop of 100', () => {
		const { container } = render(KvProgressBar, {
			props: {
				value: '50'
			}
		});

		const progress = container.querySelector('progress');
		expect(progress.max).toBe(100);
	});

	it('accepts custom max value', () => {
		const { container } = render(KvProgressBar, {
			props: {
				max: '200',
				value: '150'
			}
		});

		const progress = container.querySelector('progress');
		expect(progress.max).toBe(200);
		expect(progress.value).toBe(150);
	});

	it('applies kv-progress-bar class', () => {
		const { container } = render(KvProgressBar, {
			props: {
				value: '50'
			}
		});

		const progress = container.querySelector('progress');
		expect(progress.classList.contains('kv-progress-bar')).toBe(true);
	});

	it('renders with 0 value', () => {
		const { container } = render(KvProgressBar, {
			props: {
				value: '0'
			}
		});

		const progress = container.querySelector('progress');
		expect(progress.value).toBe(0);
	});

	it('renders with 100 value (full)', () => {
		const { container } = render(KvProgressBar, {
			props: {
				value: '100'
			}
		});

		const progress = container.querySelector('progress');
		expect(progress.value).toBe(100);
	});

	it('accepts string type for max prop', () => {
		const { container } = render(KvProgressBar, {
			props: {
				max: '150',
				value: '75'
			}
		});

		const progress = container.querySelector('progress');
		expect(progress.getAttribute('max')).toBe('150');
	});

	it('accepts string type for value prop', () => {
		const { container } = render(KvProgressBar, {
			props: {
				value: '33'
			}
		});

		const progress = container.querySelector('progress');
		expect(progress.getAttribute('value')).toBe('33');
	});
});
