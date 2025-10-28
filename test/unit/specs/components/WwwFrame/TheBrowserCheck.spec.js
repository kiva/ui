import { render } from '@testing-library/vue';
import TheBrowserCheck from '#src/components/WwwFrame/TheBrowserCheck';

// Mock KvAlert
vi.mock('#src/components/Kv/KvAlert', () => ({
	default: {
		name: 'KvAlert',
		props: ['variant'],
		template: '<div class="kv-alert" :data-variant="variant"><slot /></div>'
	}
}));

describe('TheBrowserCheck', () => {
	const renderComponent = (deviceData = {}) => {
		return render(TheBrowserCheck, {
			global: {
				provide: {
					device: deviceData
				}
			}
		});
	};

	// Component structure tests
	it('should have the correct component name', () => {
		expect(TheBrowserCheck.name).toBe('TheBrowserCheck');
	});

	// Internet Explorer detection tests
	it('should show alert for Internet Explorer', () => {
		const { container } = renderComponent({
			browser: { name: 'Internet Explorer' },
			platform: { vendor: 'Microsoft' }
		});
		const alert = container.querySelector('.kv-alert');
		expect(alert).toBeTruthy();
	});

	it('should not show alert for Chrome', () => {
		const { container } = renderComponent({
			browser: { name: 'Chrome' },
			platform: { vendor: 'Google' }
		});
		const alert = container.querySelector('.kv-alert');
		expect(alert).toBeFalsy();
	});

	it('should not show alert for Firefox', () => {
		const { container } = renderComponent({
			browser: { name: 'Firefox' },
			platform: { vendor: 'Mozilla' }
		});
		const alert = container.querySelector('.kv-alert');
		expect(alert).toBeFalsy();
	});

	it('should not show alert for Safari', () => {
		const { container } = renderComponent({
			browser: { name: 'Safari' },
			platform: { vendor: 'Apple' }
		});
		const alert = container.querySelector('.kv-alert');
		expect(alert).toBeFalsy();
	});

	it('should not show alert for Microsoft Edge', () => {
		const { container } = renderComponent({
			browser: { name: 'Edge' },
			platform: { vendor: 'Microsoft' }
		});
		const alert = container.querySelector('.kv-alert');
		expect(alert).toBeFalsy();
	});

	// Alert variant tests
	it('should use caution variant for alert', () => {
		const { container } = renderComponent({
			browser: { name: 'Internet Explorer' }
		});
		const alert = container.querySelector('.kv-alert');
		expect(alert.getAttribute('data-variant')).toBe('caution');
	});

	// Content tests - general message
	it('should display unsupported browser message', () => {
		const { container } = renderComponent({
			browser: { name: 'Internet Explorer' }
		});
		expect(container.textContent).toContain('Your browser is unsupported.');
	});

	it('should display "Please use" instruction', () => {
		const { container } = renderComponent({
			browser: { name: 'Internet Explorer' }
		});
		expect(container.textContent).toContain('Please use');
	});

	// Apple device specific tests
	it('should mention Safari for Apple devices', () => {
		const { container } = renderComponent({
			browser: { name: 'Internet Explorer' },
			platform: { vendor: 'Apple' }
		});
		expect(container.textContent).toContain('Safari');
	});

	it('should not mention Safari for non-Apple devices', () => {
		const { container } = renderComponent({
			browser: { name: 'Internet Explorer' },
			platform: { vendor: 'Microsoft' }
		});
		expect(container.textContent).not.toContain('Safari');
	});

	// Browser recommendation links tests
	it('should include Firefox download link', () => {
		const { container } = renderComponent({
			browser: { name: 'Internet Explorer' }
		});
		const firefoxLink = container.querySelector('a[href*="firefox"]');
		expect(firefoxLink).toBeTruthy();
		expect(firefoxLink.textContent).toBe('Firefox');
		expect(firefoxLink.getAttribute('target')).toBe('_blank');
	});

	it('should include Chrome download link', () => {
		const { container } = renderComponent({
			browser: { name: 'Internet Explorer' }
		});
		const chromeLink = container.querySelector('a[href*="chrome"]');
		expect(chromeLink).toBeTruthy();
		expect(chromeLink.textContent).toBe('Chrome');
		expect(chromeLink.getAttribute('target')).toBe('_blank');
	});

	it('should include Microsoft Edge link', () => {
		const { container } = renderComponent({
			browser: { name: 'Internet Explorer' }
		});
		const edgeLink = container.querySelector('a[href*="edge"]');
		expect(edgeLink).toBeTruthy();
		expect(edgeLink.textContent).toBe('Microsoft Edge');
		expect(edgeLink.getAttribute('target')).toBe('_blank');
	});

	it('should have three browser links for non-Apple devices', () => {
		const { container } = renderComponent({
			browser: { name: 'Internet Explorer' },
			platform: { vendor: 'Microsoft' }
		});
		const links = container.querySelectorAll('a');
		expect(links).toHaveLength(3);
	});

	// Styling tests
	it('should center the message text', () => {
		const { container } = renderComponent({
			browser: { name: 'Internet Explorer' }
		});
		const messageDiv = container.querySelector('.tw-text-center');
		expect(messageDiv).toBeTruthy();
	});

	it('should use medium font weight', () => {
		const { container } = renderComponent({
			browser: { name: 'Internet Explorer' }
		});
		const messageDiv = container.querySelector('.tw-font-medium');
		expect(messageDiv).toBeTruthy();
	});

	// Edge cases
	it('should handle missing device data gracefully', () => {
		const { container } = renderComponent();
		const alert = container.querySelector('.kv-alert');
		expect(alert).toBeFalsy();
	});

	it('should handle device with missing browser property', () => {
		const { container } = renderComponent({
			platform: { vendor: 'Apple' }
		});
		const alert = container.querySelector('.kv-alert');
		expect(alert).toBeFalsy();
	});

	it('should handle device with missing platform property', () => {
		const { container } = renderComponent({
			browser: { name: 'Chrome' }
		});
		const alert = container.querySelector('.kv-alert');
		expect(alert).toBeFalsy();
	});

	it('should handle empty device object', () => {
		const { container } = renderComponent({});
		const alert = container.querySelector('.kv-alert');
		expect(alert).toBeFalsy();
	});
});
