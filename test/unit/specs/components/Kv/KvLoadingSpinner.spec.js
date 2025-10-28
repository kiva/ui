import { render } from '@testing-library/vue';
import KvLoadingSpinner from '#src/components/Kv/KvLoadingSpinner';

describe('KvLoadingSpinner.vue', () => {
	it('renders the loading spinner', () => {
		const { container } = render(KvLoadingSpinner);

		const spinner = container.querySelector('.loading-spinner');
		expect(spinner).toBeTruthy();
	});

	it('renders 8 lines for the spinner animation', () => {
		const { container } = render(KvLoadingSpinner);

		const lines = container.querySelectorAll('.line');
		expect(lines.length).toBe(8);
	});

	it('has correct structure', () => {
		const { container } = render(KvLoadingSpinner);

		const spinner = container.querySelector('.loading-spinner');
		expect(spinner).toBeTruthy();

		// Check that all lines are children of the spinner
		const lines = spinner.querySelectorAll('.line');
		expect(lines.length).toBe(8);
	});

	it('exports a valid Vue component', () => {
		expect(KvLoadingSpinner).toBeTruthy();
		expect(typeof KvLoadingSpinner).toBe('object');
	});
});
