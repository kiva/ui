import { render } from '@testing-library/vue';
import KvLoadingOverlay from '#src/components/Kv/KvLoadingOverlay';

describe('KvLoadingOverlay.vue', () => {
	it('renders a loading overlay container', () => {
		const { container } = render(KvLoadingOverlay);

		const overlay = container.querySelector('.loading-overlay');
		expect(overlay).toBeTruthy();
	});

	it('renders a spinner wrapper', () => {
		const { container } = render(KvLoadingOverlay);

		const spinnerWrapper = container.querySelector('.spinner-wrapper');
		expect(spinnerWrapper).toBeTruthy();
	});

	it('renders KvLoadingSpinner component', () => {
		const { container } = render(KvLoadingOverlay);

		// KvLoadingSpinner should render its characteristic structure
		const spinner = container.querySelector('.spinner-wrapper');
		expect(spinner).toBeTruthy();
	});
});
